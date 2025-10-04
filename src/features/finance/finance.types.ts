import { Document, ObjectId } from "mongoose";

// Define the document types
export type FinanceDocumentType = 'proforma' | 'invoice' | 'credit_note';

// Define the document status
export type FinanceDocumentStatus = 'draft' | 'sent' | 'acknowledged' | 'paid' | 'issued' | 'cancelled';

// Interface for line items
export interface ILineItem {
    serviceItem: string;
    hsn?: string;
    rate: number;
    currency: string;
    unit?: string;
    exchangeRate: number;
    quantity: number;
    pricePerUnit: number;
    discount: number;
    taxableAmount: number;
    gstPercent: number;
    gstAmount: number;
    totalWithGst: number;
}

// Interface for the finance document
export interface IFinanceDocument extends Document {
    shipmentId: ObjectId;
    customerId: ObjectId;
    parentDocumentId?: ObjectId;
    locationId?: string;

    //
    type: FinanceDocumentType;
    status: FinanceDocumentStatus;
    documentNumber: string;
    issueDate: Date;
    dueDate?: Date;
    lineItems: ILineItem[];
    currency: string;
    net_taxable: number;
    net_discount: number;
    net_gst: number;
    grand_total: number;
    acknowledgedAt?: Date;
    paidAt?: Date;
    _id: string;
}

export type update_finance_dto = Partial<IFinanceDocument>;
