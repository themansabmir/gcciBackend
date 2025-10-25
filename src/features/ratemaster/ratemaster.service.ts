import RateMasterRepository from "./ratemaster.repository";
import PortModel from "@features/port/port.entity";
import crypto from "crypto";
import { ChargeTable, RateSheetMasterTable } from "./ratemaster.entity";
import { TRADE_TYPE, IChargeSheetFilter, IChargeSheetResult } from "./ratesheetmaster.types";
import { VendorEntity } from "@features/vendor/vendor.entity";
import mongoose from "mongoose";
class RateMasterService {
    private rateMasterRepository;
    constructor(rateMasterRepository: RateMasterRepository) {
        this.rateMasterRepository = rateMasterRepository;
    }

    private async resolveRefs(rows: any[]) {
        // 1. Build hashSets of unique values to reduce DB calls
        const shippingLines = new Set();
        const ports = new Set();

        rows.forEach(row => {
            shippingLines.add(row.Shipping_Line);
            ports.add(row.Start_Port);
            ports.add(row.End_Port);
        });

        // 2. Fetch IDs from DB in bulk
        const shippingLineMap = {};
        const shippingLineDocs = await VendorEntity.find({ vendor_name: { $in: Array.from(shippingLines) } });
        shippingLineDocs.forEach(doc => shippingLineMap[doc.vendor_name] = doc._id);

        const portMap = {};
        const portDocs = await PortModel.find({ port_code: { $in: Array.from(ports) } });
        portDocs.forEach(doc => portMap[doc.port_code] = doc._id);


        // 3. Replace names with IDs in each row
        return rows.map(row => ({
            shippingLineId: shippingLineMap[row.Shipping_Line],
            start_port_code: portMap[row.Start_Port],
            end_port_code: portMap[row.End_Port],
            containerType: row.Container_Type,
            containerSize: row.Container_Size,
            chargeName: row.Charge_Name,
            hsnCode: row.HSN_Code,
            price: Number(row.Price),
            validityFrom: new Date(row.Effective_From)
        }));
    }

    private async getOrCreateCombo(row) {
        const comboKey = crypto
            .createHash("sha1")
            .update(`${row.shippingLineId}|${row.polId}|${row.podId}|${row.containerTypeId}|${row.containerSizeId}`)
            .digest("hex");

        let combo = await RateSheetMasterTable.findOne({ comboKey });
        if (!combo) {
            combo = await RateSheetMasterTable.create({
                comboKey,
                shippingLineId: row.shippingLineId,
                polId: row.polId,
                podId: row.podId,
                containerTypeId: row.containerTypeId,
                containerSizeId: row.containerSizeId,
                tradeType: TRADE_TYPE.EXPORT
            });
        }

        return combo._id;
    }

    private async upsertCharge(row, comboId, session) {
        const existing = await ChargeTable.findOne({
            rateSheetComboId: comboId,
            chargeName: row.chargeName,
            effectiveTo: null
        }).session(session);

        if (existing) {
            if (row.validityFrom > existing.effectiveFrom) {
                existing.effectiveTo = new Date(row.validityFrom.getTime() - 24 * 60 * 60 * 1000); // day before
                await existing.save({ session });
            } else if (row.validityFrom.getTime() === existing.effectiveFrom.getTime()) {
                // overwrite same day
                await existing.deleteOne({ session });
            }
        }

        await ChargeTable.create([{
            rateSheetComboId: comboId,
            chargeName: row.chargeName,
            hsnCode: row.hsnCode,
            price: row.price,
            currency: row.currency,
            effectiveFrom: row.validityFrom,
            effectiveTo: null
        }], { session });
    }


    async bulkImportRates(rawRows: any[]) {
        const normalizedRows = await this.resolveRefs(rawRows);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            for (const row of normalizedRows) {
                const comboId = await this.getOrCreateCombo(row);
                await this.upsertCharge(row, comboId, session);
            }

            await session.commitTransaction();
            console.log("✅ Bulk import completed successfully");
        } catch (err) {
            await session.abortTransaction();
            console.error("❌ Bulk import failed", err);
        } finally {
            session.endSession();
        }
    }



    async bulkImportRateMaster(rateMasterData: any) {
        try {
            const rateMaster = await this.rateMasterRepository.createMany(rateMasterData);
            return rateMaster;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Filter charge sheets based on multiple criteria including shipping line, ports, 
     * container details, date ranges, and text search
     * @param filters - Filter parameters for searching charge sheets
     * @returns Promise<{ data: IChargeSheetResult[], total: number, page: number, limit: number }>
     */
    async filterChargeSheets(filters: IChargeSheetFilter = {}) {
        try {
            const {
                shippingLineId,
                startPortId,
                endPortId,
                containerType,
                containerSize,
                tradeType,
                effectiveDate,
                effectiveDateRange,
                searchQuery,
                status,
                limit = 20,
                skip = 0,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = filters;

            // Build match conditions for RateSheetMaster
            const matchConditions: any = {};

            if (shippingLineId) {
                matchConditions.shippingLineId = new mongoose.Types.ObjectId(shippingLineId.toString());
            }

            if (startPortId) {
                matchConditions.startPortId = new mongoose.Types.ObjectId(startPortId.toString());
            }

            if (endPortId) {
                matchConditions.endPortId = new mongoose.Types.ObjectId(endPortId.toString());
            }

            if (containerType) {
                matchConditions.containerType = containerType;
            }

            if (containerSize) {
                matchConditions.containerSize = containerSize;
            }

            if (tradeType) {
                matchConditions.tradeType = tradeType;
            }

            if (status) {
                matchConditions.status = status;
            }

            // Build aggregation pipeline
            const pipeline: any[] = [
                // Match RateSheetMaster documents
                { $match: matchConditions },
                
                // Lookup shipping line details
                {
                    $lookup: {
                        from: 'vendors',
                        localField: 'shippingLineId',
                        foreignField: '_id',
                        as: 'shippingLine'
                    }
                },
                { $unwind: '$shippingLine' },
                
                // Lookup start port details
                {
                    $lookup: {
                        from: 'ports',
                        localField: 'startPortId',
                        foreignField: '_id',
                        as: 'startPort'
                    }
                },
                { $unwind: '$startPort' },
                
                // Lookup end port details
                {
                    $lookup: {
                        from: 'ports',
                        localField: 'endPortId',
                        foreignField: '_id',
                        as: 'endPort'
                    }
                },
                { $unwind: '$endPort' },
                
                // Lookup charges
                {
                    $lookup: {
                        from: 'charges',
                        let: { rateSheetId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$rateSheetMasterId', '$$rateSheetId'] }
                                }
                            },
                            // Filter charges by effective date if provided
                            ...(effectiveDate || effectiveDateRange ? [{
                                $match: this.buildDateFilter(effectiveDate, effectiveDateRange)
                            }] : []),
                            // Sort charges by effectiveFrom descending
                            { $sort: { effectiveFrom: -1 } }
                        ],
                        as: 'charges'
                    }
                }
            ];

            // Add text search if searchQuery is provided
            if (searchQuery && searchQuery.trim()) {
                pipeline.push({
                    $match: {
                        $or: [
                            { 'shippingLine.vendor_name': { $regex: searchQuery, $options: 'i' } },
                            { 'startPort.port_code': { $regex: searchQuery, $options: 'i' } },
                            { 'startPort.port_name': { $regex: searchQuery, $options: 'i' } },
                            { 'endPort.port_code': { $regex: searchQuery, $options: 'i' } },
                            { 'endPort.port_name': { $regex: searchQuery, $options: 'i' } },
                            { 'charges.chargeName': { $regex: searchQuery, $options: 'i' } },
                            { 'charges.hsnCode': { $regex: searchQuery, $options: 'i' } }
                        ]
                    }
                });
            }

            // Add projection to format the output
            pipeline.push({
                $project: {
                    _id: 1,
                    comboKey: 1,
                    containerType: 1,
                    containerSize: 1,
                    tradeType: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    shippingLine: {
                        _id: '$shippingLine._id',
                        vendor_name: '$shippingLine.vendor_name'
                    },
                    startPort: {
                        _id: '$startPort._id',
                        port_code: '$startPort.port_code',
                        port_name: '$startPort.port_name'
                    },
                    endPort: {
                        _id: '$endPort._id',
                        port_code: '$endPort.port_code',
                        port_name: '$endPort.port_name'
                    },
                    charges: {
                        $map: {
                            input: '$charges',
                            as: 'charge',
                            in: {
                                _id: '$$charge._id',
                                chargeName: '$$charge.chargeName',
                                hsnCode: '$$charge.hsnCode',
                                currency: '$$charge.currency',
                                price: '$$charge.price',
                                effectiveFrom: '$$charge.effectiveFrom',
                                effectiveTo: '$$charge.effectiveTo'
                            }
                        }
                    }
                }
            });

            // Add sorting
            const sortObj: any = {};
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
            pipeline.push({ $sort: sortObj });

            // Get total count for pagination
            const countPipeline = [...pipeline, { $count: 'total' }];
            const countResult = await RateSheetMasterTable.aggregate(countPipeline);
            const total = countResult.length > 0 ? countResult[0].total : 0;

            // Add pagination
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            // Execute the aggregation
            const results = await RateSheetMasterTable.aggregate(pipeline);

            return {
                data: results as IChargeSheetResult[],
                total,
                page: Math.floor(skip / limit) + 1,
                limit,
                hasMore: skip + limit < total
            };

        } catch (error) {
            console.error('Error filtering charge sheets:', error);
            throw new Error(`Failed to filter charge sheets: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Build date filter conditions for charge effective dates
     * @private
     */
    private buildDateFilter(effectiveDate?: Date, effectiveDateRange?: { from?: Date; to?: Date }) {
        const dateFilter: any = {};

        if (effectiveDate) {
            // Find charges that are effective on the specified date
            dateFilter.$and = [
                { effectiveFrom: { $lte: effectiveDate } },
                {
                    $or: [
                        { effectiveTo: null },
                        { effectiveTo: { $gte: effectiveDate } }
                    ]
                }
            ];
        } else if (effectiveDateRange) {
            const conditions: any[] = [];
            
            if (effectiveDateRange.from) {
                conditions.push({ effectiveFrom: { $gte: effectiveDateRange.from } });
            }
            
            if (effectiveDateRange.to) {
                conditions.push({
                    $or: [
                        { effectiveTo: null },
                        { effectiveTo: { $lte: effectiveDateRange.to } }
                    ]
                });
            }
            
            if (conditions.length > 0) {
                dateFilter.$and = conditions;
            }
        }

        return dateFilter;
    }

    /**
     * Get active charges for a specific rate sheet combo on a given date
     * @param comboKey - The combo key to search for
     * @param effectiveDate - Date to check for active charges (defaults to current date)
     * @returns Promise<IChargeSheetResult | null>
     */
    async getActiveChargesByCombo(comboKey: string, effectiveDate: Date = new Date()) {
        try {
            const result = await this.filterChargeSheets({
                effectiveDate,
                limit: 1
            });

            const matchingCombo = result.data.find(item => item.comboKey === comboKey);
            return matchingCombo || null;

        } catch (error) {
            console.error('Error getting active charges by combo:', error);
            throw new Error(`Failed to get active charges: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}