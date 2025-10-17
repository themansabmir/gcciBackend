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

export interface IBillingPartySnapshot {
    name: string;
    gst_number: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    vendor_name: string;
    mobile_number: string;
    pin_code: string;
    pan_number: string;
}

// Interface for the finance document
export interface IFinanceDocument extends Document {
    shipmentId: ObjectId;
    document: ObjectId, 
    docType: "HBL" | "MBL";
    customerId: ObjectId;
    parentDocumentId?: ObjectId;
    locationId?: string;
    billingPartySnapshot: IBillingPartySnapshot;

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
