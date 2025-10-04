import { IQuery } from '@features/vendor/vendor.types';
import FinanceRepository from './finance.repository';
import { IFinanceDocument, update_finance_dto } from './finance.types';

class FinanceService {
  private financeRepository;

  constructor(financeRepository: FinanceRepository) {
    this.financeRepository = financeRepository;
  }

  async createFinanceDocument(finance_DTO: IFinanceDocument) {
    try {
      const { _id, ...financeBody } = finance_DTO;
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
        .populate('customerId');
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocuments(query: IQuery) {
    const { filter, limit, skip, sort } = this.financeRepository.buildSearchQuery(query, ['documentNumber', 'type', 'status', 'currency']);

    const filterQuery = this.financeRepository.find(filter)
      .populate('shipmentId')
      .populate('customerId');
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
        .populate('customerId').select('vendor_name _id locations');
    } catch (error) {
      throw error;
    }
  }

  async findFinanceDocumentsByCustomer(customerId: string) {
    try {
      return await this.financeRepository.find({ customerId })
        .populate('shipmentId')
        .populate('customerId');
    } catch (error) {
      throw error;
    }
  }
}

export default FinanceService;
