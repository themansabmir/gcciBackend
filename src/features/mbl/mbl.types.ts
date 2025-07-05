import { Document, ObjectId } from 'mongoose';

export enum TradeType {
  IMPORT = 'import',
  EXPORT = 'export',
}
export enum ShipmentMode {
  SEA = 'sea',
  AIR = 'air',
}

export enum MOVEMENT_TYPE {
  RAIL= 'RAIL',
  ROAD= 'ROAD',
}
export enum ShipmentType {
  FCL = 'FCL',
  LCL = 'LCL',
}
export enum MBL_Type {
  OBL = 'OBL',
  TLX = 'TLX',
  SEAWAY = 'SEAWAY',
  SURRENDER = 'SURRENDER',
}

export enum INCOTERM {
  FOB = 'FOB',
  EXW = 'EXW',
  CIF = 'CIF',
  FCA = 'FCA',
}
export enum FREIGHT_TYPE {
  PRE = 'PRE',
  COLLECT = 'COLLECT',
}

export enum CONTAINER_TYPE {
  GENERAL = 'GENERAL',
  REEFER = 'REEFER',
  HAZARDOUS = 'HAZARDOUS',
}

export enum CONTAINER_SIZE {
  FORTY = '40',
  TWENTY = '20',
}

export interface IContainer {
  container_number: string;
  line_seal: string;
  shipper_seal: string;
  custom_seal: string;
  container_size: CONTAINER_SIZE;
  container_type: CONTAINER_TYPE;
  package_count: string;
  package_type: string;
  description: string;
  gross_weight: string;
  net_weight: string;
  volume: string;
  arrival_pol_date: string;
  container_pickup_date: string;
  container_handover_date: string;
  rail_out_date: string;
  gate_in_date: string;
  arrival_fpod_date: string;
  delivery_order_date: string;
  delivery_validity_date: string;
}

export interface IMbl extends Document {
  shipment_folder_id: ObjectId;
  movement_type: string;
  shipping_bill: Array<{ shipping_bill_number: string; shipping_bill_date: string }>;
  bill_of_entry: Array<{ bill_of_entry_number: string; bill_of_entry_date: string }>;
  etd_fpod: string;
  etd_pol: string;
  extra_free_time: string;
  shipment_mode: ShipmentMode;
  ata_pod: string;
  shipment_type: ShipmentType;
  trade_type: TradeType;
  booking_number: string;
  mbl_type: MBL_Type;

  shipper: ObjectId;
  shipper_address: ObjectId;
  consignee: ObjectId;
  consignee_address: ObjectId;
  notify: ObjectId;
  notify_address: ObjectId;
  second_notify: ObjectId;
  second_notify_address: ObjectId;
  agent_origin: ObjectId;
  agent_origin_address: ObjectId;
  agent_destination: ObjectId;
  agent_destination_address: ObjectId;

  shipping_line: ObjectId;
  mbl_number: string;
  mbl_date: String;

  place_of_receipt: string;
  place_of_delivery: string;
  port_of_loading: ObjectId;
  port_of_discharge: ObjectId;
  voyage_number: string;
  transhipment_port: ObjectId;
  incoterm: INCOTERM;
  freight_type: FREIGHT_TYPE;
  sob_date: String;
  eta_pod: String;
  shipping_bill_number: string;
  shipping_bill_date: String;

  free_time_origin: string;
  free_time_destination: string;
  exchange_rate: string;
  vessel_number: string;
  marks_numbers: string;

  description_of_goods: string;
  place_carriage: string;
  containers: IContainer[];

  created_by: ObjectId;

  created_at: String;
  updated_at: String;
}
