import { Schema, model } from 'mongoose';
import { IProformaInvoice } from './proforma-invoice.types';

const proformaInvoiceSchema = new Schema<IProformaInvoice>(
  {
    proforma_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    issue_date: {
      type: Date,
      required: true,
    },
    valid_until: {
      type: Date,
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      billing_address: { type: String, required: true },
      shipping_address: { type: String, required: true },
      contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
      },
      tax_id: { type: String },
    },
    company: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    line_items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
        discount: { type: Number },
        tax_percentage: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    totals: {
      subtotal: { type: Number, required: true },
      total_tax: { type: Number, required: true },
      grand_total: { type: Number, required: true },
    },
    payment_terms: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
      default: 'Draft',
    },
    linked_invoice_id: { type: String },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export const ProformaInvoiceCounterEntity = model('ProformaInvoiceCounter', counterSchema);

const ProformaInvoiceEntity = model('ProformaInvoice', proformaInvoiceSchema);

export default ProformaInvoiceEntity;
