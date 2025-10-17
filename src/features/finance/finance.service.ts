import { IQuery } from '@features/vendor/vendor.types';
import FinanceRepository from './finance.repository';
import { IFinanceDocument, ILineItem, update_finance_dto } from './finance.types';

class FinanceService {
  private financeRepository;

  constructor(financeRepository: FinanceRepository) {
    this.financeRepository = financeRepository;
  }

  private recalculatedRows(lineItems: ILineItem[]): ILineItem[] {
    return lineItems.map((row) => {
      const rate = Number(row.rate || 0);
      const quantity = Number(row.quantity || 0);
      const exchangeRate = Number(row.exchangeRate || 1);
      const discount = Number(row.discount || 0);
      const gstPercent = Number(row.gstPercent || 0);

      const pricePerUnit = rate * exchangeRate;
      const totalPrice = pricePerUnit * quantity;
      const taxableAmount = totalPrice - discount;
      const gstAmount = taxableAmount * (gstPercent / 100);
      const totalWithGst = taxableAmount + gstAmount;

      return {
        ...row,
        pricePerUnit,
        taxableAmount,
        gstAmount,
        totalWithGst,
      };
    });
  }

  private recalculateTotals(lineItems: ILineItem[]): { netDiscount: number, netTaxable: number, netGst: number, grandTotal: number } {

    const netDiscount = lineItems.reduce((sum, row) => sum + (row.discount || 0), 0);
    const netTaxable = lineItems.reduce((sum, row) => sum + (row.rate * row.exchangeRate * row.quantity - (row.discount || 0)), 0);
    const netGst = lineItems.reduce((sum, row) => sum + ((row.rate * row.exchangeRate * row.quantity - (row.discount || 0)) * Number(row.gstPercent) / 100), 0);
    const grandTotal = netTaxable + netGst;
    return { netDiscount, netTaxable, netGst, grandTotal };
  }

  async createFinanceDocument(finance_DTO: IFinanceDocument) {
    try {
      const { _id, ...financeBody } = finance_DTO;
      const recalculateRows = this.recalculatedRows(financeBody.lineItems);
      const recalculateTotals = this.recalculateTotals(recalculateRows);
      financeBody.lineItems = recalculateRows;
      financeBody.net_discount = recalculateTotals.netDiscount;
      financeBody.net_taxable = recalculateTotals.netTaxable;
      financeBody.net_gst = recalculateTotals.netGst;
      financeBody.grand_total = recalculateTotals.grandTotal;

      if (_id) {
        return await this.financeRepository.updateById(_id, financeBody, { new: true });
      }
      return await this.financeRepository.create(financeBody);
    } catch (error) {
      throw error;
    }
  }

  async updateFinanceDocument(id: string, update_finance_DTO: update_finance_dto) {
    try {
      return await this.financeRepository.updateById(id, {
        ...update_finance_DTO,
      });
    } catch (error) {
      throw error;
    }
  }

  async getFinanceDocumentById(id: string) {
    try {
      return await this.financeRepository.findById(id)
        .populate('shipmentId')
        .populate({
          path: 'document',
          populate: {
            path: 'billing_party'
          }
        });
    } catch (error) {
      throw error;
    }
  }

  async deleteFinanceDocument(id: string) {
    try {
      return await this.financeRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocumentById(id: string) {
    try {
      return await this.financeRepository.findById(id)
        .populate('shipmentId')
        .populate('document');
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocuments(query: IQuery) {
    const { filter, limit, skip, sort } = this.financeRepository.buildSearchQuery(query, ['documentNumber', 'type', 'status', 'currency']);

    filter['type'] = query.type;
    const filterQuery = this.financeRepository.find(filter)
      .populate('shipmentId')
      .populate('document');
    if (limit) filterQuery.limit(limit);
    if (skip) filterQuery.skip(skip);
    if (sort && Object.keys(sort).length) filterQuery.sort(sort);

    try {
      const countPromise = this.financeRepository.count(filter);
      const [data, total] = await Promise.all([filterQuery, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocumentsByShipment(shipmentId: string) {
    try {
      return await this.financeRepository.find({ shipmentId })
        .populate('shipmentId').select('shipment_name _id')
        .populate('document')
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocumentsByCustomer(customerId: string) {
    try {
      return await this.financeRepository.find({ customerId })
        .populate('shipmentId')
        .populate('document');
    } catch (error) {
      throw error;
    }
  }
}

export default FinanceService;
