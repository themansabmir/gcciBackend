import { Schema, model } from 'mongoose';
import { IInvoiceItem , UNIT} from './invoiceitem.types';



const InvoiceItemSchema = new Schema<IInvoiceItem>({
    hsn_code: {
        type: String,
        required: true,
        trim: true
    },
    fieldName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gst: {
        type: Schema.Types.Mixed, 
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['container', 'bl', 'wm'] as UNIT[], 
        trim: true
    }
}, {
    timestamps: true, 
    versionKey: false 
});

// Create and export the model
export const InvoiceItem = model<IInvoiceItem>('InvoiceItem', InvoiceItemSchema);