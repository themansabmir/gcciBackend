import { Schema, model } from 'mongoose';
import { IShipment } from './shipment.types';

const shipmentEntity = new Schema<IShipment>(
  {
    shipment_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    shipment_type: {
      type: String,
      required: true,
      enum: ['IMP', 'EXP'],
    },
  },
  {
    timestamps: true,
  }
);

const counterSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const ShipmentCounterEntity = model('ShipmentCounter', counterSchema);

const ShipmentEntity = model('Shipment', shipmentEntity);

export default ShipmentEntity;
