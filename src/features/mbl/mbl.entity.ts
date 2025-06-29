import { model, Schema } from 'mongoose';
import {
  CONTAINER_SIZE,
  CONTAINER_TYPE,
  FREIGHT_TYPE,
  IContainer,
  IMbl,
  INCOTERM,
  MBL_Type,
  ShipmentMode,
  ShipmentType,
  TradeType,
} from './mbl.types';
const { ObjectId } = Schema.Types;

const ContainerSchema = new Schema<IContainer>({
  container_number: { type: String },
  line_seal: { type: String },
  shipper_seal: { type: String },
  custom_seal: { type: String },
  container_size: { type: String, enum: Object.values(CONTAINER_SIZE) },
  container_type: { type: String, enum: Object.values(CONTAINER_TYPE) },
  package_count: { type: String },
  package_type: { type: String },
  description: { type: String },
  gross_weight: { type: String },
  net_weight: { type: String },
  volume: { type: String },
});

//MBL
const mblEntity = new Schema<IMbl>(
  {
    shipment_folder_id: { type: ObjectId, required: true, ref: 'Shipment' },

    shipment_mode: { type: String, enum: Object.values(ShipmentMode) },
    shipment_type: { type: String, enum: Object.values(ShipmentType) },
    trade_type: { type: String, enum: Object.values(TradeType) },
    booking_number: { type: String },
    mbl_type: { type: String, enum: Object.values(MBL_Type) },
    exchange_rate: { type: String },

    shipper: { type: ObjectId, ref: 'Vendor' },
    shipper_address: { type: ObjectId },
    consignee: { type: ObjectId, ref: 'Vendor' },
    consignee_address: { type: ObjectId },
    notify: { type: ObjectId, ref: 'Vendor' },
    notify_address: { type: ObjectId },
    agent: { type: ObjectId, ref: 'Vendor' },
    agent_address: { type: ObjectId },
    shipping_line: { type: ObjectId, ref: 'Vendor' },

    mbl_number: { type: String },
    mbl_date: { type: String },

    place_of_receipt: { type: String },
    place_of_delivery: { type: String },
    port_of_loading: { type: ObjectId, ref: 'Port' },
    port_of_discharge: { type: ObjectId, ref: 'Port' },
    transhipment_port: { type: ObjectId, ref: 'Port' },

    incoterm: { type: String, enum: Object.values(INCOTERM) },
    freight_type: { type: String, enum: Object.values(FREIGHT_TYPE) },

    sob_date: { type: String },
    eta_pod: { type: String },
    shipping_bill_number: { type: String },
    shipping_bill_date: { type: String },
    bill_of_entry: { type: String },
    bill_of_entry_date: { type: String },

    free_time_pol: { type: String },
    free_time_pod: { type: String },
    etd_pol: { type: String },
    etd_fpod: { type: String },
    movement_type: { type: String },

    created_by: { type: ObjectId, ref: 'Team' },

    containers: { type: [ContainerSchema], default: [] },
  },
  {
    timestamps: true,
  }
);
export const MblEntity = model<IMbl>('Mbl', mblEntity);
