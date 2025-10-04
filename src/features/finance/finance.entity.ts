import mongoose from "mongoose";
import { IFinanceDocument } from "./finance.types";

const { Schema } = mongoose;
const lineItemSchema = new Schema(
    {
        serviceItem: { type: String, required: true },
        hsn: { type: String },

        rate: { type: Number, default: 0 },          // base rate
        currency: { type: String, default: "INR" },
        unit: { type: String },

        exchangeRate: { type: Number, default: 1 },  // useful for foreign currency conversion
        quantity: { type: Number, default: 1 },

        pricePerUnit: { type: Number, default: 0 },  // final price per unit after adjustments
        discount: { type: Number, default: 0 },

        taxableAmount: { type: Number, default: 0 },
        gstPercent: { type: Number, default: 0 },
        gstAmount: { type: Number, default: 0 },

        totalWithGst: { type: Number, default: 0 }
    },
    { _id: false }
);

const financeDocumentSchema = new Schema<IFinanceDocument>(
    {
        shipmentId: { type: Schema.Types.ObjectId, ref: "Shipment", required: true },
        customerId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        locationId: { type: String },

        type: {
            type: String,
            enum: ["proforma", "invoice", "credit_note"],
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "sent", "acknowledged", "paid", "issued", "cancelled"],
            default: "draft"
        },

        parentDocumentId: { type: Schema.Types.ObjectId, ref: "FinanceDocument", default: null },

        documentNumber: { type: String, required: true, unique: true },

        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date },

        lineItems: { type: [lineItemSchema], default: [] },


        // roll-ups from line items
        net_taxable: { type: Number, required: true },
        net_discount: { type: Number, default: 0 },
        net_gst: { type: Number, default: 0 },
        grand_total: { type: Number, required: true },

        acknowledgedAt: { type: Date },
        paidAt: { type: Date }
    },
    { timestamps: true }
);


export const FinanceDocument = mongoose.model<IFinanceDocument>("FinanceDocument", financeDocumentSchema);
