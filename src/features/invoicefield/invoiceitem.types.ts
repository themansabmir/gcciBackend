import { Document } from "mongoose";

// Define the UNIT type based on the frontend interface
export type UNIT = 'container' | 'bl' | 'wm';

// Interface for the invoice item document
export interface IInvoiceItem extends Document {
    hsn_code: string;
    fieldName: string;
    gst: number | string;
    unit: UNIT;
    _id: string;
}

export type update_invoiceitem_dto = Partial<IInvoiceItem>;