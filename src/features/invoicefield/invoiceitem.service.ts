import { IQuery } from '@features/vendor/vendor.types';
import InvoiceItemRepository from './invoiceitem.repository';
import { IInvoiceItem, update_invoiceitem_dto } from './invoiceitem.types';

class InvoiceItemService {
  private invoiceItemRepository;

  constructor(invoiceItemRepository: InvoiceItemRepository) {
    this.invoiceItemRepository = invoiceItemRepository;
  }

  async createInvoiceItem(invoiceItem_DTO: IInvoiceItem) {
    try {
      const  {_id, ...invoiceItemBody}= invoiceItem_DTO
      console.log("_ID", invoiceItem_DTO)
      if(_id){
        return await this.invoiceItemRepository.updateById(_id, invoiceItemBody, {new: true});
      }
      return await this.invoiceItemRepository.create(invoiceItemBody);
    } catch (error) {
      throw error;
    }
  }

  async updateInvoiceItem(id: string, update_invoiceItem_DTO: update_invoiceitem_dto) {
    try {
      return await this.invoiceItemRepository.updateById(id, {
        ...update_invoiceItem_DTO,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteInvoiceItem(id: string) {
    try {
      return await this.invoiceItemRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async findInvoiceItemById(id: string) {
    try {
      return await this.invoiceItemRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findInvoiceItems(query: IQuery) {
    const { filter, limit, skip, sort } = this.invoiceItemRepository.buildSearchQuery(query, ['hsn_code', 'fieldName', 'unit']);

    const filterQuery = this.invoiceItemRepository.find(filter);
    if (limit) filterQuery.limit(limit);
    if (skip) filterQuery.skip(skip);
    if (sort && Object.keys(sort).length) filterQuery.sort(sort);

    try {
      const countPromise = this.invoiceItemRepository.count(filter);
      const [data, total] = await Promise.all([filterQuery, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }
}

export default InvoiceItemService;
