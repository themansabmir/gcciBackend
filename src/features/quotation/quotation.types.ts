import { Document, Types } from 'mongoose';

export enum QUOTATION_STATUS {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
}

export interface IQuotation extends Document {
  quotationNumber: string;
  customerId: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  shippingLineId: Types.ObjectId;
  startPortId: Types.ObjectId;
  endPortId: Types.ObjectId;
  containerType: string;
  containerSize: string;
  tradeType: string;
  validFrom: Date;
  validTo: Date;
  status: QUOTATION_STATUS;
  lineItems: IQuotationLineItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuotationLineItem extends Document {
  quotationId: Types.ObjectId;
  chargeName: string;
  hsnCode: string;
  price: number;
  currency: string;
  quantity: number;
  totalAmount: number;
}

// Plain object type for line items (not extending Document)
export type CreateQuotationLineItemDTO = {
  chargeName: string;
  hsnCode: string;
  price: number;
  currency: string;
  quantity: number;
};

// Plain object type for creating quotation (not extending Document)
export type CreateQuotationDTO = {
  customerId: Types.ObjectId | string;
  customerName: string;
  customerEmail: string;
  shippingLineId: Types.ObjectId | string;
  startPortId: Types.ObjectId | string;
  endPortId: Types.ObjectId | string;
  containerType: string;
  containerSize: string;
  tradeType: string;
  validFrom: Date;
  validTo: Date;
  lineItems: CreateQuotationLineItemDTO[];
  quotationNumber?: string;
  status?: QUOTATION_STATUS;
};

export type UpdateQuotationDTO = Partial<CreateQuotationDTO>;

// Support MongoDB query operators for filters
export type QuotationFilters = {
  quotationNumber?: string | { $regex?: string; $options?: string };
  customerId?: string | Types.ObjectId;
  customerName?: string | { $regex?: string; $options?: string };
  customerEmail?: string | { $regex?: string; $options?: string };
  shippingLineId?: string | Types.ObjectId;
  startPortId?: string | Types.ObjectId;
  endPortId?: string | Types.ObjectId;
  containerType?: string | { $in?: string[] };
  containerSize?: string | { $in?: string[] };
  tradeType?: string | { $in?: string[] };
  status?: QUOTATION_STATUS | { $ne?: QUOTATION_STATUS; $in?: QUOTATION_STATUS[] };
  validFrom?: Date | { $gte?: Date; $lte?: Date };
  validTo?: Date | { $gte?: Date; $lte?: Date };
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
};

// DTO for filter query params from API
export type QuotationFilterDTO = {
  quotationNumber?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  shippingLineId?: string;
  startPortId?: string;
  endPortId?: string;
  containerType?: string;
  containerSize?: string;
  tradeType?: string;
  status?: QUOTATION_STATUS | string;
  validFromStart?: string; // ISO date string
  validFromEnd?: string; // ISO date string
  validToStart?: string; // ISO date string
  validToEnd?: string; // ISO date string
  createdAtStart?: string; // ISO date string
  createdAtEnd?: string; // ISO date string
  updatedAtStart?: string; // ISO date string
  updatedAtEnd?: string; // ISO date string
};

export interface IQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  [key: string]: any;
}
