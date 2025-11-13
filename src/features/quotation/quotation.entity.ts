import mongoose, { Schema } from 'mongoose';
import { IQuotation, IQuotationLineItem, QUOTATION_STATUS } from './quotation.types';

const QuotationLineItemEntity = new Schema<IQuotationLineItem>(
  {
    quotationId: {
      type: Schema.Types.ObjectId,
      ref: 'Quotation',
      required: true,
      index: true,
    },
    chargeName: { type: String, required: true, trim: true },
    hsnCode: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const QuotationEntity = new Schema<IQuotation>(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shippingLineId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    startPortId: { type: Schema.Types.ObjectId, ref: 'Port', required: true },
    endPortId: { type: Schema.Types.ObjectId, ref: 'Port', required: true },
    containerType: { type: String, required: true },
    containerSize: { type: String, required: true },
    tradeType: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(QUOTATION_STATUS),
      default: QUOTATION_STATUS.DRAFT,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuotationEntity.virtual('lineItems', {
  ref: 'QuotationLineItem',
  localField: '_id',
  foreignField: 'quotationId',
});

const QuotationTable = mongoose.model<IQuotation>('Quotation', QuotationEntity);
const QuotationLineItemTable = mongoose.model<IQuotationLineItem>(
  'QuotationLineItem',
  QuotationLineItemEntity
);

export { QuotationTable, QuotationLineItemTable };
