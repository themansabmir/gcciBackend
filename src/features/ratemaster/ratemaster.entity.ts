import { CONTAINER_SIZE, CONTAINER_TYPE } from "@features/mbl/mbl.types";
import mongoose from "mongoose";
import { RATE_SHEET_STATUS, TRADE_TYPE } from "./ratesheetmaster.types";


const RateSheetMasterEntity = new mongoose.Schema(
    {
        comboKey: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        shippingLineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingLine",
            required: true,
        },
        startPortId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Port",
            required: true,
        },
        endPortId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Port",
            required: true,
        },
        containerType: {
            type: String,
            enum: Object.values(CONTAINER_TYPE),
            required: true,
        },
        containerSize: {
            type: String,
            enum: Object.values(CONTAINER_SIZE),
            required: true,
        },
        tradeType: {
            type: String,
            enum: Object.values(TRADE_TYPE),
            default: TRADE_TYPE.EXPORT,
        },
        remarks: String,
        status: {
            type: String,
            enum: Object.values(RATE_SHEET_STATUS),
            default: RATE_SHEET_STATUS.ACTIVE,
        },
    },
    { timestamps: true }
);

const ChargeEntity = new mongoose.Schema(
    {
        rateSheetMasterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RateSheetMaster",
            required: true,
            index: true,
        },
        chargeName: {
            type: String,
            required: true,
            trim: true,
        },
        hsnCode: String,
        currency: {
            type: String,
            default: "INR",
        },
        price: {
            type: Number,
            required: true,
        },
        effectiveFrom: {
            type: Date,
            required: true,
        },
        effectiveTo: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

ChargeEntity.index(
    { rateSheetComboId: 1, chargeName: 1, effectiveFrom: 1 },
    { unique: true }
);
const RateSheetMasterTable = mongoose.model("RateSheetMaster", RateSheetMasterEntity);
const ChargeTable = mongoose.model("Charge", ChargeEntity);

export { RateSheetMasterTable, ChargeTable };

