import { quotationRepository } from './quotation.repository';
import {
  CreateQuotationDTO,
  QUOTATION_STATUS,
  QuotationFilters,
  UpdateQuotationDTO,
  CreateQuotationLineItemDTO,
  IQuotationLineItem,
} from './quotation.types';
import { IQuery } from '../vendor/vendor.types';
import { renderTemplate } from '../../lib/pugRenderer';
import { mailer } from '../../lib/mail';
import { VendorRepository } from '../vendor/vendor.repository';
import { VendorEntity } from '../vendor/vendor.entity';
import PortRepository from '../port/port.repository';
import PortModel from '../port/port.entity';
import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from '../../config/env';
import puppeteer from 'puppeteer';

class QuotationService {
  private generateQuotationNumber(): string {
    const prefix = 'QUOT';
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  }

  async createQuotation(dto: CreateQuotationDTO) {
    const quotationNumber = this.generateQuotationNumber();
    dto.quotationNumber = quotationNumber;
    dto.status = QUOTATION_STATUS.DRAFT;
    return quotationRepository.createWithTransaction(dto);
  }

  async getQuotationById(id: string) {
    return quotationRepository.findById(id);
  }

  async getAllQuotations(query: IQuery, filters: QuotationFilters) {
    return quotationRepository.findAll(query, { ...filters, status: { $ne: QUOTATION_STATUS.DELETED } });
  }

  async updateQuotation(id: string, dto: UpdateQuotationDTO) {
    return quotationRepository.updateWithTransaction(id, dto);
  }

  async deleteQuotation(id: string) {
    return quotationRepository.updateById(id, { status: QUOTATION_STATUS.DELETED });
  }

  async changeStatus(id: string, status: QUOTATION_STATUS) {
    const quotation = await this.getQuotationById(id);
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const allowedTransitions: { [key in QUOTATION_STATUS]: QUOTATION_STATUS[] } = {
      [QUOTATION_STATUS.DRAFT]: [QUOTATION_STATUS.SENT],
      [QUOTATION_STATUS.SENT]: [QUOTATION_STATUS.ACCEPTED, QUOTATION_STATUS.REJECTED, QUOTATION_STATUS.EXPIRED],
      [QUOTATION_STATUS.ACCEPTED]: [],
      [QUOTATION_STATUS.REJECTED]: [],
      [QUOTATION_STATUS.EXPIRED]: [],
      [QUOTATION_STATUS.DELETED]: [],
    };

    if (!allowedTransitions[quotation.status].includes(status)) {
      throw new Error(`Invalid status transition from ${quotation.status} to ${status}`);
    }

    return quotationRepository.updateById(id, { status });
  }

  async duplicateQuotation(id: string) {
    const originalQuotation = await this.getQuotationById(id);
    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }

    const originalQuotationObject = originalQuotation.toObject();

    const newQuotationData: CreateQuotationDTO = {
      customerId: originalQuotationObject.customerId.toString(),
      customerName: originalQuotationObject.customerName,
      customerEmail: originalQuotationObject.customerEmail,
      shippingLineId: originalQuotationObject.shippingLineId.toString(),
      startPortId: originalQuotationObject.startPortId.toString(),
      endPortId: originalQuotationObject.endPortId.toString(),
      containerType: originalQuotationObject.containerType,
      containerSize: originalQuotationObject.containerSize,
      tradeType: originalQuotationObject.tradeType,
      validFrom: originalQuotationObject.validFrom,
      validTo: originalQuotationObject.validTo,
      lineItems: originalQuotationObject.lineItems.map(
        (item: IQuotationLineItem): CreateQuotationLineItemDTO => ({
          chargeName: item.chargeName,
          hsnCode: item.hsnCode,
          price: item.price,
          currency: item.currency,
          quantity: item.quantity,
        })
      ),
    };

    return this.createQuotation(newQuotationData);
  }

  async sendQuotationEmail(id: string) {
    const quotation = await this.getQuotationById(id);
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const info = await mailer.sendMail({
      to: quotation.customerEmail,
      subject: `Quotation ${quotation.quotationNumber}`,
      html: `<p>Here is your quotation.</p>`,
    });

    // Mark quotation as SENT when email is dispatched, but only if it's not already SENT
    let updatedQuotation = quotation;
    try {
      if ((quotation as any).status !== QUOTATION_STATUS.SENT) {
        // changeStatus returns the updated quotation
        // await and assign so we return the latest document
        // (preserves previous return behavior)

        // @ts-expect-error: updatedQuotation type mismatch with changeStatus return type
        updatedQuotation = await this.changeStatus(id, QUOTATION_STATUS.SENT);
      }
    } catch (err) {
      console.warn('Could not change quotation status:', (err as Error).message);
    }

    return updatedQuotation;
  }

  /**
   * Send quotation HTML email (Pug template) to a vendor.
   * Accepts vendorId, fetches vendor details including email from locations,
   * and port names from port entities.
   */
  async sendQuotationToVendor(id: string, vendorId: string) {
    const quotation = await this.getQuotationById(id);
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // Fetch vendor to get email from first location
    const vendorRepository = new VendorRepository(VendorEntity);
    const vendor = await vendorRepository.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Resolve a valid vendor email address. Prefer explicit email fields if present.
    const locationEmail = vendor.locations?.find((l: any) => l.email)?.email;
    const vendorEmail = (vendor as any).email || (vendor as any).contact_email || locationEmail;
    if (!vendorEmail) {
      // Provide a clearer error so caller can fix vendor data instead of getting mailer "No recipients defined"
      throw new Error('Vendor does not have an email address. Add an `email` field to vendor or one of its locations before sending.');
    }
    // Fetch port names
    const portRepository = new PortRepository(PortModel);
    const startPort = await portRepository.findById((quotation as any).startPortId);
    const endPort = await portRepository.findById((quotation as any).endPortId);

    const startPortName = startPort?.port_name || 'N/A';
    const endPortName = endPort?.port_name || 'N/A';

    // Prepare line items and totals
    const lineItems = (quotation as any).lineItems || [];
    const subtotal = lineItems.reduce((s: number, it: any) => s + (it.totalAmount ?? it.price * it.quantity), 0);
    const currency = lineItems.length ? lineItems[0].currency : 'USD';

    const templateData = {
      quotationNumber: (quotation as any).quotationNumber,
      customerName: (quotation as any).customerName,
      customerEmail: (quotation as any).customerEmail,
      validFrom: (quotation as any).validFrom,
      validTo: (quotation as any).validTo,
      containerType: (quotation as any).containerType,
      containerSize: (quotation as any).containerSize,
      tradeType: (quotation as any).tradeType,
      startPortName,
      endPortName,
      lineItems: lineItems.map((it: any) => ({
        chargeName: it.chargeName,
        hsnCode: it.hsnCode,
        price: it.price,
        currency: it.currency,
        quantity: it.quantity,
        totalAmount: it.totalAmount ?? it.price * it.quantity,
      })),
      subtotal,
      total: subtotal,
      currency,
    };

    const html = renderTemplate('quotationEmail', templateData);

    // Use mailer service to send email
    const info = await mailer.sendMail({
      to: vendorEmail,
      subject: `Quotation ${templateData.quotationNumber}`,
      html,
    });

    // Mark quotation as SENT when email is dispatched, but only if it's not already SENT
    try {
      if ((quotation as any).status !== QUOTATION_STATUS.SENT) {
        await this.changeStatus(id, QUOTATION_STATUS.SENT);
      }
    } catch (err) {
      console.warn('Could not change quotation status:', (err as Error).message);
    }

    return { info, vendorId, to: vendorEmail };
  }

  async generateQuotationPDF(id: string): Promise<Buffer> {
    const quotation = await this.getQuotationById(id);
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const html = renderTemplate('quotation', quotation.toObject());

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}

export const quotationService = new QuotationService();
