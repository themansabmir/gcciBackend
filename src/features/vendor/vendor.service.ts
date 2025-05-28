import { isValidObjectId } from 'mongoose';
import { VendorRepository } from './vendor.repository';
import { IQuery, IVendor, IVendorUpdateBody } from './vendor.types';

export class VendorService {
  private vendorRepository;
  constructor(vendorRepository: VendorRepository) {
    this.vendorRepository = vendorRepository;
  }
  public async createVendor(vendorBody: IVendor) {
    try {
      return await this.vendorRepository.create(vendorBody);
    } catch (error) {
      throw error;
    }
  }

  public async deleteVendor(id: string) {
    try {
      if (!isValidObjectId(id)) throw new Error('Incorrect DB id');
      return await this.vendorRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  public async updateVendor(_id: string, vendorUpdateBody: IVendorUpdateBody) {
    try {
      if (!isValidObjectId(_id)) throw new Error('Invalid Id');
      return await this.vendorRepository.updateById(_id, {
        ...vendorUpdateBody,
      });
    } catch (error) {
      throw error;
    }
  }
  public async findVendorById(vendorId: string) {
    try {
      if (!isValidObjectId(vendorId)) throw new Error('Incorrect DB id');
      return await this.vendorRepository.findById(vendorId);
    } catch (error) {
      throw error;
    }
  }
  public async findAllVendors(query: IQuery) {
    try {
      const { page, limit, search, sortBy, sortOrder } = query;

      let skip, sort: Record<string, 1 | -1>;

      const filter: any = {};

      if (search) {
        filter.vendor_name = { $regex: search, $options: 'i' };
      }
      const vendorQueryBuilder = this.vendorRepository.find(filter);
      if (limit) {
        vendorQueryBuilder.limit(limit);
      }
      if (limit && page) {
        skip = (page - 1) * limit;
        vendorQueryBuilder.skip(skip);
      }
      if (sortBy && sortOrder) {
        sort = {
          [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };
        vendorQueryBuilder.sort(sort);
      }
      const countPromise = this.vendorRepository.count(filter);
      const [data, total] = await Promise.all([vendorQueryBuilder, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }
}
