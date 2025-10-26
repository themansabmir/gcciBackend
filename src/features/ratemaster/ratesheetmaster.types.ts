import { CONTAINER_SIZE, CONTAINER_TYPE } from "@features/mbl/mbl.types";
import mongoose, { Document, ObjectId } from "mongoose";
export enum TRADE_TYPE {
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
}

export enum RATE_SHEET_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}


export interface IExcelRow {
    shippingLineId: string;
    startPortId: string;
    endPortId: string;
    containerType: CONTAINER_TYPE;
    containerSize: CONTAINER_SIZE;
    tradeType: TRADE_TYPE;
    effectiveFrom: Date;
    effectiveTo?: Date;
    chargeName: string;
    hsnCode: string;
    price: number;
    currency: string;
}

export interface IRateSheetMaster extends Document {
    _id: ObjectId;
    comboKey: string;
    shippingLineId: ObjectId;
    startPortId: ObjectId;
    endPortId: ObjectId;
    containerType: CONTAINER_TYPE;
    containerSize: CONTAINER_SIZE;
    tradeType: TRADE_TYPE;
    remarks?: string;
    status: RATE_SHEET_STATUS;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICharge extends Document {
    _id: ObjectId;
    rateSheetMasterId: ObjectId;
    chargeName: string;
    hsnCode?: string;
    currency: string;
    price: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    createdAt: Date;
    updatedAt: Date;
}


export interface GetRateSheetsFilters {
  shippingLineId: string;
  containerType?: string;
  containerSize?: number | string;
  startPortId?: string;
  endPortId?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  tradeType?: string;
}

export interface IChargeSheetFilter {
    shippingLineId?: ObjectId | string;
    startPortId?: ObjectId | string;
    endPortId?: ObjectId | string;
    containerType?: CONTAINER_TYPE;
    containerSize?: CONTAINER_SIZE;
    tradeType?: TRADE_TYPE;
    effectiveDate?: Date;
    effectiveDateRange?: {
        from?: Date;
        to?: Date;
    };
    searchQuery?: string;
    status?: RATE_SHEET_STATUS;
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IChargeSheetResult {
    _id: ObjectId;
    comboKey: string;
    shippingLine: {
        _id: ObjectId;
        vendor_name: string;
    };
    startPort: {
        _id: ObjectId;
        port_code: string;
        port_name: string;
    };
    endPort: {
        _id: ObjectId;
        port_code: string;
        port_name: string;
    };
    containerType: CONTAINER_TYPE;
    containerSize: CONTAINER_SIZE;
    tradeType: TRADE_TYPE;
    status: RATE_SHEET_STATUS;
    charges: Array<{
        _id: ObjectId;
        chargeName: string;
        hsnCode?: string;
        currency: string;
        price: number;
        effectiveFrom: Date;
        effectiveTo?: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}