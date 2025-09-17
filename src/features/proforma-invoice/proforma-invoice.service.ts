import { IProformaInvoice } from './proforma-invoice.types';
import ProformaInvoiceRepository from './proforma-invoice.repository';
import { ProformaInvoiceCounterEntity } from './proforma-invoice.entity';

interface IQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    customer_name?: string;
    date_from?: string;
    date_to?: string;
}


export default class ProformaInvoiceService {
  private proformaInvoiceRepository: ProformaInvoiceRepository;

  constructor(proformaInvoiceRepository: ProformaInvoiceRepository) {
    this.proformaInvoiceRepository = proformaInvoiceRepository;
  }

  private async generateProformaId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PF-${year}`;
    const counter = await ProformaInvoiceCounterEntity.findOneAndUpdate(
      { _id: prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqNumber = counter.seq;
    return `${prefix}-${seqNumber.toString().padStart(4, '0')}`;
  }

  private calculateTotals(lineItems: IProformaInvoice['line_items']): IProformaInvoice['totals'] {
    let subtotal = 0;
    let total_tax = 0;

    for (const item of lineItems) {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemDiscount = item.discount || 0;
      const itemTotal = itemSubtotal - itemDiscount;
      item.subtotal = itemTotal;
      subtotal += itemTotal;
      total_tax += (itemTotal * item.tax_percentage) / 100;
    }

    const grand_total = subtotal + total_tax;
    return { subtotal, total_tax, grand_total };
  }

  public async createProformaInvoice(proformaInvoiceBody: Omit<IProformaInvoice, 'proforma_id' | 'totals'>): Promise<IProformaInvoice> {
    const proforma_id = await this.generateProformaId();
    const totals = this.calculateTotals(proformaInvoiceBody.line_items);

    const newProformaInvoice: Partial<IProformaInvoice> = {
      ...proformaInvoiceBody,
      proforma_id,
      totals,
      status: 'Draft',
    };

    return this.proformaInvoiceRepository.create(newProformaInvoice as IProformaInvoice);
  }

  public async getAllProformaInvoices(query: IQuery) {
    const { skip, sort, limit, filter } = this.proformaInvoiceRepository.buildSearchQuery(query, ['customer.name', 'proforma_id']);

    if (query.status) {
      filter['status'] = query.status;
    }
    if (query.customer_name) {
        filter['customer.name'] = { $regex: query.customer_name, $options: 'i' };
    }
    if (query.date_from && query.date_to) {
        filter['issue_date'] = { $gte: new Date(query.date_from), $lte: new Date(query.date_to) };
    }


    const data = await this.proformaInvoiceRepository.find(filter).sort(sort).skip(skip).limit(limit);
    const total = await this.proformaInvoiceRepository.count(filter);
    return { data, total };
  }

  public async findProformaInvoiceById(id: string): Promise<IProformaInvoice | null> {
    return this.proformaInvoiceRepository.findById(id).populate('created_by', 'first_name last_name email');
  }

  public async updateProformaInvoice(id: string, updateBody: Partial<IProformaInvoice>): Promise<IProformaInvoice | null> {
    const proformaInvoice = await this.proformaInvoiceRepository.findById(id);
    if (!proformaInvoice) {
      throw new Error('Proforma Invoice not found');
    }
    if (proformaInvoice.status !== 'Draft') {
      throw new Error('Cannot edit a proforma invoice that is not in Draft status');
    }
    if (updateBody.line_items) {
        updateBody.totals = this.calculateTotals(updateBody.line_items);
    }


    return this.proformaInvoiceRepository.updateById(id, updateBody);
  }

  public async deleteProformaInvoice(id: string): Promise<IProformaInvoice | null> {
    return this.proformaInvoiceRepository.deleteById(id);
  }
}
