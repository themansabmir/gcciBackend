import { quotationRepository } from './quotation.repository';
import {
  CreateQuotationDTO,
  QUOTATION_STATUS,
  QuotationFilters,
  UpdateQuotationDTO,
  CreateQuotationLineItemDTO,
  IQuotationLineItem,
} from './quotation.types';
import nodemailer from 'nodemailer';
import { IQuery } from '../vendor/vendor.types';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } from '../../config/env';
import puppeteer from 'puppeteer';
import { renderTemplate } from '../../lib/pugRenderer';

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

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'your-email@example.com',
      to: quotation.customerEmail,
      subject: `Quotation ${quotation.quotationNumber}`,
      text: 'Here is your quotation.',
    });

    return this.changeStatus(id, QUOTATION_STATUS.SENT);
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
