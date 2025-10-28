import { CONTAINER_SIZE, CONTAINER_TYPE } from "@features/mbl/mbl.types";
import  { Document, ObjectId } from "mongoose";
export enum TRADE_TYPE {
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
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

