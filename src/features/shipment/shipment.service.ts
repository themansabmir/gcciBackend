import { IQuery } from '@features/vendor/vendor.types';
import { ShipmentCounterEntity } from './shipment.entity';
import ShipmentRepository from './shipment.repository';
import { IShipment, IShipmentQuery } from './shipment.types';

export default class ShipmentService {
  private shipmentRepository;
  constructor(shipmentRepository: ShipmentRepository) {
    this.shipmentRepository = shipmentRepository;
  }

  public async getShipmentFolderName(prefix: string): Promise<string> {
    try {
      const counter = await ShipmentCounterEntity.findOneAndUpdate(
        { _id: prefix }, // filter by prefix like 'IMP' or 'EXP'
        { $inc: { seq: 1 } }, // increment seq by 1
        { new: true, upsert: true } // return the updated doc, create if missing
      );

      const seqNumber = counter.seq;
      return `${prefix}-${seqNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating folder number:', error);
      throw error;
    }
  }

  public async createShipment(shipmentBody: IShipment) {
    try {
      if (shipmentBody.shipment_type !== 'IMP' && shipmentBody.shipment_type !== 'EXP') throw new Error('Shipment Must be IMP or EXP type in nature');

      const shipment_name = await this.getShipmentFolderName(shipmentBody.shipment_type);
      const payload: Partial<IShipment> = {
        shipment_name,
        created_by: shipmentBody.created_by,
        shipment_type: shipmentBody.shipment_type,
      };
      return this.shipmentRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  public async getAllShipments(query: IShipmentQuery) {
    try {
      const { skip, sort, limit, filter } = this.shipmentRepository.buildSearchQuery({...query}, ['shipment_name', 'shipment_type']);

      if (query.shipment_type) {
        filter['shipment_type'] = query.shipment_type;
      }
      const data = await this.shipmentRepository.find(filter).sort(sort);
      const total = await this.shipmentRepository.count(filter);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string) {
    try {
      return await this.shipmentRepository.findById(id).populate({path:'created_by', select: 'first_name last_name createdAt -_id'});
    } catch (error) {
      throw error;
    }
  }
}
