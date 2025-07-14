import { randomUUID } from 'crypto';
import HBLRepository from './hbl.repository';

export default class HblService {
  private hblRepository: HBLRepository;
  constructor(hblRepository: HBLRepository) {
    this.hblRepository = hblRepository;
  }

  async saveHbl(hbl: any) {
    let { hblId } = hbl ?? {};

    if (!hblId) throw new Error('Hbl Id doesnt exist');
    if (hblId?.toLowerCase() === 'new') {
      const uniqueId = randomUUID();
      hbl.hblId = uniqueId;
      const filter = { hblId: uniqueId };
      const update = { $set: hbl };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      console.log('HBL', hbl);
      return await this.hblRepository.updateOneByQuery(filter, update, { ...options, runValidators: false });
    } else {
      return await this.hblRepository.updateOneByQuery({ _id: hblId }, hbl);
    }
  }

  async getHblById(hblId: string) {
    return await this.hblRepository.findById(hblId);
  }

  async getAllHblByShipmentId(shipment_folder_id: string) {
    return await this.hblRepository.find({ shipment_folder_id });
  }
}
