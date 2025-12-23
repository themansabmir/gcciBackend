import { isValidObjectId } from 'mongoose';
import { VendorRepository } from './vendor.repository';
import { IQuery, IVendor, IVendorUpdateBody } from './vendor.types';

export class VendorService {
  private vendorRepository;
  constructor(vendorRepository: VendorRepository) {
    this.vendorRepository = vendorRepository;
  }

  private groupVendors(rows: any[]) {
    const vendorsMap = new Map();

    for (const row of rows) {
      if (!row || !row.vendor_name) throw new Error('Invalid data');

      const vendorKey = `${row.vendor_name}`;
      const vendorType = row.vendor_type?.split(',').map((type: string) => type.trim()) ?? [];

      // If Vendor not exists, create it.
      if (!vendorsMap.has(vendorKey)) {
        vendorsMap.set(vendorKey, {
          vendor_name: row.vendor_name,
          vendor_type: vendorType,
          credit_days: row.credit_days,
          pan_number: row.pan_number,
          primary_email: row.primary_email,
          primary_mobile_number: row.primary_mobile_number,
          locations: [],
        });
      }

      // Push location
      vendorsMap.get(vendorKey).locations.push({
        city: row.city,
        address: row.address,
        state: row.state,
        country: row.country,
        pin_code: row.pin_code,
        telephone: row.telephone,
        mobile_number: row.mobile_number,
        fax: row.fax,
        gst_number: row.gst_number,
      });
    }

    return Array.from(vendorsMap.values());
  }

  public async bulkImportVendors(vendorRows: any[]) {
    try {
      const vendors = this.groupVendors(vendorRows);
      await this.vendorRepository.createMany(vendors);
      return 'Vendors imported successfully';
    } catch (error) {
      throw error;
    }
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
