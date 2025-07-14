import { BillOfEntrySchema, CommonFields, ContainerSchema, ShippingBillSchema } from '@features/mbl/mbl.entity';
import mongoose, { model, Schema } from 'mongoose';

const hblEntity = new mongoose.Schema(
  {
    hblId: { type: String, required: true, unique: true, trim: true },
    ...CommonFields.shipment_details,
    ...CommonFields.vendor_refs,
    ...CommonFields.port_info,
    ...CommonFields.freight_info,
    ...CommonFields.dates,
    ...CommonFields.free_time,

    hbl_number: { type: String },
    hbl_date: { type: Date },

    marks_numbers: { type: String },
    description_of_goods: { type: String },

    shipping_bill: { type: [ShippingBillSchema], default: [] },
    bill_of_entry: { type: [BillOfEntrySchema], default: [] },

    containers: { type: [ContainerSchema], default: [] },
    // created_by: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

export const HBLEntity = model('HBL', hblEntity);
