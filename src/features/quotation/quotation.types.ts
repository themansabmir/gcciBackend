import { Document } from 'mongoose';

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
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingLineId: string;
  startPortId: string;
  endPortId: string;
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
  quotationId: string;
  chargeName: string;
  hsnCode: string;
  price: number;
  currency: string;
  quantity: number;
  totalAmount: number;
}

export type CreateQuotationLineItemDTO = Omit<IQuotationLineItem, 'quotationId' | 'totalAmount' | 'createdAt' | 'updatedAt' | '_id' | 'id'>;

export type CreateQuotationDTO = Omit<IQuotation, 'quotationNumber' | 'status' | 'createdAt' | 'updatedAt' | 'lineItems' | '_id' | 'id'> & {
  lineItems: CreateQuotationLineItemDTO[];
  quotationNumber?: string;
  status?: QUOTATION_STATUS;
};

export type UpdateQuotationDTO = Partial<CreateQuotationDTO>;

export type QuotationFilters = {
  status?: QUOTATION_STATUS;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};
