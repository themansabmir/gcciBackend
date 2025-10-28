import RateMasterRepository from "./ratemaster.repository";
import PortModel from "@features/port/port.entity";
import crypto from "crypto";
import { ChargeTable, RateSheetMasterTable } from "./ratemaster.entity";
import { TRADE_TYPE, IExcelRow, GetRateSheetsFilters, ICharge, IRateSheetMaster } from "./ratesheetmaster.types";
import { VendorEntity } from "@features/vendor/vendor.entity";
import mongoose from "mongoose";

interface IChargePopulated {
    _id: any;
    rateSheetMasterId: {
        _id: any;
        comboKey: string;
        shippingLineId: {
            _id: string;
            vendor_name: string;
            vendor_code: string;
        };
        startPortId: {
            _id: string;
            port_name: string;
            port_code: string;
        };
        endPortId: {
            _id: string;
            port_name: string;
            port_code: string;
        };
        containerType: string;
        containerSize: string;
        tradeType: string;
        createdAt: Date;
        updatedAt: Date;
    };
    chargeName: string;
    hsnCode?: string;
    currency: string;
    price: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export default class RateMasterService {
    private rateMasterRepository;
    constructor(rateMasterRepository: RateMasterRepository) {
        this.rateMasterRepository = rateMasterRepository;
    }

    private async resolveRefs(rows: IExcelRow[]): Promise<IExcelRow[]> {
        console.log("1️⃣ BULK INSERTING RATE SHEET START", rows?.length);
        console.log(rows)

        const shippingLines = new Set();
        const ports = new Set();

        rows.forEach(row => {
            shippingLines.add(row.shippingLineId);
            ports.add(row.startPortId);
            ports.add(row.endPortId);
        });

        // Fetch all refs in one go
        const [shippingLineDocs, portDocs] = await Promise.all([
            VendorEntity.find({ vendor_name: { $in: Array.from(shippingLines) } }),
            PortModel.find({ port_code: { $in: Array.from(ports) } }),
        ]);

        const shippingLineMap: { [key: string]: any } = {};
        const portMap: { [key: string]: any } = {};

        shippingLineDocs.forEach(doc => (shippingLineMap[doc.vendor_name] = doc._id));

        portDocs.forEach(doc => (portMap[doc.port_code.toUpperCase()] = doc._id));

        console.log("✅ Found reference IDs");

        // Replace values in each row
        return rows.map(row => ({
            shippingLineId: shippingLineMap[row.shippingLineId],
            startPortId: portMap[row.startPortId?.toUpperCase()],
            endPortId: portMap[row.endPortId?.toUpperCase()],
            containerType: row.containerType,
            containerSize: row.containerSize,
            chargeName: row.chargeName,
            hsnCode: row.hsnCode,
            price: Number(row.price),
            currency: row.currency || "INR",
            effectiveFrom: new Date(row.effectiveFrom),
            tradeType: row.tradeType || TRADE_TYPE.EXPORT,
        }));
    }

    private async getOrCreateCombo(row: IExcelRow) {
        const comboKey = crypto
            .createHash("sha1")
            .update(`${row.shippingLineId}|${row.startPortId}|${row.endPortId}|${row.containerType}|${row.containerSize}`)
            .digest("hex");

        let combo = await RateSheetMasterTable.findOne({ comboKey });
        if (!combo) {
            combo = await RateSheetMasterTable.create({
                comboKey,
                shippingLineId: row.shippingLineId,
                startPortId: row.startPortId,
                endPortId: row.endPortId,
                containerType: row.containerType,
                containerSize: row.containerSize,
                tradeType: row.tradeType,
            });
        }

        return combo._id;
    }

    private async upsertCharge(row: IExcelRow, comboId: mongoose.Schema.Types.ObjectId) {
        const effectiveFrom = new Date(row.effectiveFrom);

        // Find existing charge for same combo and charge name
        const existing = await ChargeTable.findOne({
            rateSheetMasterId: comboId,
            chargeName: row.chargeName,
            effectiveTo: null,
        });

        // 🟡 Case 1: Correction (same effectiveFrom)
        if (existing && existing.effectiveFrom.getTime() === effectiveFrom.getTime()) {
            existing.price = row.price;
            existing.hsnCode = row.hsnCode;
            await existing.save();
            return { action: "UPDATED", charge: row.chargeName };
        }

        // 🟢 Case 2: Version change (new effectiveFrom)
        if (existing && effectiveFrom > existing.effectiveFrom) {
            existing.effectiveTo = new Date(effectiveFrom.getTime() - 24 * 60 * 60 * 1000);
            await existing.save();
        }

        // 🔵 Case 3: New charge
        await ChargeTable.create(
            [
                {
                    rateSheetMasterId: comboId,
                    chargeName: row.chargeName,
                    hsnCode: row.hsnCode,
                    price: row.price,
                    currency: row.currency,
                    effectiveFrom,
                    effectiveTo: null,
                },
            ]
        );

        return { action: existing ? "VERSIONED" : "CREATED", charge: row.chargeName };
    }

    private async getChargesForDate(rateMasterId: mongoose.Schema.Types.ObjectId, shipmentDate = new Date()) {
        return ChargeTable.find({
            rateSheetMasterId: rateMasterId,
            effectiveFrom: { $lte: shipmentDate },
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gte: shipmentDate } }
            ]
        });
    }

    /**
     * Bulk import rates from Excel rows
     * @param rawRows - Array of Excel rows containing rate sheet data
     * @returns Promise<{ data: IChargeSheetResult[], total: number, page: number, limit: number }>
     */
    public async bulkImportRates(rawRows: IExcelRow[]) {
        const normalizedRows = await this.resolveRefs(rawRows);
        console.log("3️⃣ NORMALIZED ROWS", normalizedRows);


        const results = [];

        try {
            for (const row of normalizedRows) {
                const comboId = await this.getOrCreateCombo(row);
                const res = await this.upsertCharge(row, comboId);
                results.push({ ...res, combo: `${row.startPortId}-${row.endPortId}` });
            }

            console.log("✅ Bulk import completed successfully");
            return results;
        } catch (err) {
            console.error("❌ Bulk import failed", err);
            throw err;
        }
    }

    /**
     * Filter charge sheets based on multiple criteria including shipping line, ports, 
     * container details, date ranges, and text search
     * @param filters - Filter parameters for searching charge sheets
     * @returns Promise<{ data: IChargeSheetResult[], total: number, page: number, limit: number }>
     */

    public async getActiveRateSheets(filters: GetRateSheetsFilters) {
        if (!filters.shippingLineId) {
            throw new Error("shippingLineId is required");
        }

        const today = new Date();

        // 1️⃣ Build RateSheetMaster query
        const masterQuery: any = {
            shippingLineId: filters.shippingLineId,
        };

        if (filters.containerType) masterQuery.containerType = filters.containerType;
        if (filters.containerSize) masterQuery.containerSize = filters.containerSize;
        if (filters.startPortId) masterQuery.startPortId = filters.startPortId;
        if (filters.endPortId) masterQuery.endPortId = filters.endPortId;
        if (filters.tradeType) masterQuery.tradeType = filters.tradeType;

        // Fetch matching rate sheet combos
        const rateSheets = await RateSheetMasterTable.find(masterQuery)
        .lean();

        if (!rateSheets.length) return [];

        const rateSheetIds = rateSheets.map(r => r._id);

        // 2️⃣ Build Charge query
        const chargeQuery: any = {
            rateSheetMasterId: { $in: rateSheetIds },
            effectiveFrom: { $lte: today }, // active slab by default
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gte: today } }
            ]
        };

        if (filters.effectiveFrom) chargeQuery.effectiveFrom = { $gte: filters.effectiveFrom };
        if (filters.effectiveTo) chargeQuery.effectiveTo = { $lte: filters.effectiveTo };

        let charges = await ChargeTable.find(chargeQuery)
            .populate({
                path: "rateSheetMasterId",
                populate: [
                    {
                        path: "shippingLineId",
                        model: "Vendor",
                        select: "vendor_name vendor_code"
                    },
                    {
                        path: "startPortId",
                        model: "Port",
                        select: "port_name port_code"
                    },
                    {
                        path: "endPortId",
                        model: "Port",
                        select: "port_name port_code"
                    }
                ]
            })
            .lean() as any as IChargePopulated[]; // to get shippingLine, ports, etc.

        // 3️⃣ Map back to the requested output structure
        const result = charges.map(c => ({
            SHIPPING_LINE: c.rateSheetMasterId.shippingLineId,
            CONTAINER_TYPE: c.rateSheetMasterId.containerType,
            CONTAINER_SIZE: c.rateSheetMasterId.containerSize,
            START_PORT: c.rateSheetMasterId.startPortId,
            END_PORT: c.rateSheetMasterId.endPortId,
            CHARGE_NAME: c.chargeName,
            HSN_CODE: c.hsnCode,
            PRICE: c.price,
            EFFECTIVE_FROM: c.effectiveFrom,
            TRADE_TYPE: c.rateSheetMasterId.tradeType
        }));

        return result;
    }
    




}

export const rateMasterService = new RateMasterService(new RateMasterRepository(RateSheetMasterTable));