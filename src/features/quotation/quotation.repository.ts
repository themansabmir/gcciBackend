import { BaseRepository } from '../base.repository';
import { QuotationTable, QuotationLineItemTable } from './quotation.entity';
import { IQuotation, CreateQuotationDTO, UpdateQuotationDTO, QuotationFilters } from './quotation.types';
import { IQuery } from '../vendor/vendor.types';

class QuotationRepository extends BaseRepository<IQuotation> {
  constructor() {
    super(QuotationTable);
  }

  async createWithTransaction(data: CreateQuotationDTO): Promise<IQuotation> {
    try {
      const { lineItems, ...quotationData } = data;
      const quotation = new QuotationTable(quotationData);
      await quotation.save();

      const quotationLineItems = lineItems.map((item) => ({
        ...item,
        quotationId: quotation._id,
        totalAmount: item.price * item.quantity,
      }));
      await QuotationLineItemTable.insertMany(quotationLineItems);

      return quotation;
    } catch (error) {
      throw error;
    }
  }

  async updateWithTransaction(id: string, data: UpdateQuotationDTO): Promise<IQuotation | null> {
    try {
      const { lineItems, ...quotationData } = data;
      const quotation = await this.updateById(id, quotationData);

      if (lineItems) {
        await QuotationLineItemTable.deleteMany({ quotationId: id });
        const quotationLineItems = lineItems.map((item) => ({
          ...item,
          quotationId: id,
          totalAmount: item.price * item.quantity,
        }));
        await QuotationLineItemTable.insertMany(quotationLineItems);
      }

      return quotation;
    } catch (error) {
      throw error;
    }
  }

  findAll(query: IQuery, filters: QuotationFilters) {
    const { filter, skip, limit, sort } = this.buildSearchQuery(query, ['quotationNumber', 'customerName']);
    const finalFilter = { ...filter, ...filters };
    return this.find(finalFilter).skip(skip).limit(limit).sort(sort).populate('lineItems');
  }

  findById(id: string) {
    return super.findById(id).populate('lineItems');
  }

  findByQuotationNumber(quotationNumber: string) {
    return this.findOne({ quotationNumber }).populate('lineItems');
  }

  findByCustomerId(customerId: string) {
    return this.find({ customerId }).populate('lineItems');
  }
}

export const quotationRepository = new QuotationRepository();
