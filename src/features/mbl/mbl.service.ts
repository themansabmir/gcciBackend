import { FilterQuery } from 'mongoose';
import MBLRepository from './mbl.repository';
import { IMbl } from './mbl.types';

class MblService {
  private mblRepository: MBLRepository;
  constructor(mblRepository: MBLRepository) {
    this.mblRepository = mblRepository;
  }

  async create(mblBody: IMbl) {
    try {
      return await this.mblRepository.create(mblBody);
    } catch (error) {
      throw error;
    }
  }

  async update(query: FilterQuery<IMbl>, mblBody: IMbl) {
    try {
      return await this.mblRepository.updateOneByQuery(query, mblBody);
    } catch (error) {
      throw error;
    }
  }
  async findByFolderId(id: string) {
    try {
      return await this.mblRepository.findOne({ shipment_folder_id: id }).populate({ path: 'shipment_folder_id', select: 'shipment_name -_id' });
    } catch (error) {
      throw error;
    }
  }

  async createOneOrUpdateMBL(body: Partial<IMbl>) {
    try {
      const { shipment_folder_id } = body;
      if (!shipment_folder_id) {
        throw new Error('Shipment Folder Id is required to update MBL');
      }
      const filter = { shipment_folder_id };
      const update = { $set: body };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const result = await this.mblRepository.updateOneByQuery(filter, update, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default MblService;
