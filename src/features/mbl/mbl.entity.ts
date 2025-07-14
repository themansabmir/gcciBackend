import { model, Schema } from 'mongoose';
import {
  CONTAINER_SIZE,
  CONTAINER_TYPE,
  FREIGHT_TYPE,
  IMbl,
  INCOTERM,
  MBL_Type,
  MOVEMENT_TYPE,
  ShipmentMode,
  ShipmentType,
  TradeType,
} from './mbl.types';
const { ObjectId } = Schema.Types;

export const ShippingBillSchema = new Schema(
  {
    shipping_bill_number: { type: String, required: true, trim: true },
    shipping_bill_date: { type: Date, required: true },
  },
  { _id: false } // don’t create an _id for each sub‑doc
);

export const BillOfEntrySchema = new Schema(
  {
    bill_of_entry_number: { type: String, required: true, trim: true },
    bill_of_entry_date: { type: Date, required: true },
  },
  { _id: false }
);

// --- container --------------------------------------------------
export const ContainerSchema = new Schema(
  {
    container_number: { type: String, trim: true },
    line_seal: { type: String },
    shipper_seal: { type: String },
    custom_seal: { type: String },
    container_size: { type: String, enum: Object.values(CONTAINER_SIZE) },
    container_type: { type: String, enum: Object.values(CONTAINER_TYPE) },
    package_count: { type: Number, min: 0 },
    package_type: { type: String },
    description: { type: String },

    // use numbers for math or Decimal128 for high precision
    gross_weight: { type: Number },
    net_weight: { type: Number },
    volume: { type: Number },

    // true dates
    arrival_pol_date: { type: Date },
    container_pickup_date: { type: Date },
    container_handover_date: { type: Date },
    rail_out_date: { type: Date },
    gate_in_date: { type: Date },
    arrival_fpod_date: { type: Date },
    delivery_order_date: { type: Date },
    delivery_validity_date: { type: Date },
  },
  { _id: false }
);

export const CommonFields = {
  shipment_details: {
    shipment_folder_id: { type: ObjectId, required: true, ref: 'Shipment' },

    shipment_mode: { type: String, enum: Object.values(ShipmentMode) },
    movement_type: { type: String, enum: Object.values(MOVEMENT_TYPE) },
    shipment_type: { type: String, enum: Object.values(ShipmentType) },
    trade_type: { type: String, enum: Object.values(TradeType) },

    booking_number: { type: String, trim: true },
    mbl_type: { type: String, enum: Object.values(MBL_Type) },
  },

  vendor_refs: {
    shipper: { type: ObjectId, ref: 'Vendor' },
    shipper_address: { type: ObjectId },
    consignee: { type: ObjectId, ref: 'Vendor' },
    consignee_address: { type: ObjectId },
    notify: { type: ObjectId, ref: 'Vendor' },
    notify_address: { type: ObjectId },
    second_notify: { type: ObjectId, ref: 'Vendor' },
    second_notify_address: { type: ObjectId },
    shipping_line: { type: ObjectId, ref: 'Vendor' },

    agent_origin: { type: ObjectId, ref: 'Vendor' },
    agent_origin_address: { type: ObjectId },
    agent_destination: { type: ObjectId, ref: 'Vendor' },
    agent_destination_address: { type: ObjectId },
  },

  port_info: {
    place_carriage: { type: String },
    place_of_receipt: { type: String, ref: 'Port' },
    place_of_delivery: { type: String, ref: 'Port' },
    port_of_loading: { type: ObjectId, ref: 'Port' },
    port_of_discharge: { type: ObjectId, ref: 'Port' },
    voyage_number: { type: String },
    vessel_number: { type: String },
    transhipment_port: { type: ObjectId, ref: 'Port' },
  },

  freight_info: {
    incoterm: { type: String, enum: Object.values(INCOTERM) },
    freight_type: { type: String, enum: Object.values(FREIGHT_TYPE) },
    exchange_rate: { type: Number },
  },

  dates: {
    sob_date: { type: Date },
    eta_pod: { type: String },
    etd_pol: { type: Date },
    etd_fpod: { type: Date },
    ata_pod: { type: Date },
  },

  free_time: {
    free_time_origin: { type: Number },
    free_time_destination: { type: Number },
    extra_free_time: { type: Number },
  },
};

// --- master MBL -------------------------------------------------
const mblEntity = new Schema(
  {
    ...CommonFields.shipment_details,
    ...CommonFields.vendor_refs,
    ...CommonFields.port_info,
    ...CommonFields.freight_info,
    ...CommonFields.dates,
    ...CommonFields.free_time,
    mbl_number: { type: String },
    mbl_date: { type: Date },
    marks_numbers: { type: String },
    description_of_goods: { type: String },

    shipping_bill: { type: [ShippingBillSchema], default: [] },
    bill_of_entry: { type: [BillOfEntrySchema], default: [] },

    containers: { type: [ContainerSchema], default: [] },
    created_by: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

// --- conditional validation ------------------------------------
mblEntity.pre('validate', function (next) {
  // @ts-ignore
  const doc = this as IMbl;

  /** export – rail OR road */
  const needsExportRailRoad = doc.trade_type === 'export' && ['rail', 'road'].includes(doc.movement_type);
  if (needsExportRailRoad && (!doc.shipping_bill?.length || !doc.etd_fpod)) {
    return next(new Error('Export rail/road requires at least one shipping bill and an ETD FPOD.'));
  }

  /** import – rail only */
  const needsImportRail = doc.trade_type === 'import' && doc.movement_type === 'rail';
  if (needsImportRail && (!doc.bill_of_entry?.length || !doc.ata_pod)) {
    return next(new Error('Import rail requires at least one bill of entry and an ATA POD.'));
  }

  next();
});

export const MblEntity = model<IMbl>('Mbl', mblEntity);
