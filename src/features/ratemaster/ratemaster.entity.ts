import { CONTAINER_SIZE, CONTAINER_TYPE } from "@features/mbl/mbl.types";
import mongoose from "mongoose";
import { ICharge, IRateSheetMaster, TRADE_TYPE } from "./ratesheetmaster.types";


const RateSheetMasterEntity = new mongoose.Schema<IRateSheetMaster>(
    {
        comboKey: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        shippingLineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
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
    },
    { timestamps: true }
);

const ChargeEntity = new mongoose.Schema<ICharge>(
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
        hsnCode: {
            type: String,
            required: true,
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
const RateSheetMasterTable = mongoose.model<IRateSheetMaster>("RateSheetMaster", RateSheetMasterEntity);
const ChargeTable = mongoose.model<ICharge>("Charge", ChargeEntity);

export { RateSheetMasterTable, ChargeTable };

