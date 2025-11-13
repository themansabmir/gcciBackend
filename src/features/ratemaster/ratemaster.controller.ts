import { NextFunction, Request, RequestHandler, Response } from 'express';
import RateMasterService, { rateMasterService } from './ratemaster.service';
import { GetRateSheetsFilters } from './ratesheetmaster.types';
import { successResponse } from '@middleware/successResponse';

class RateMasterController {
    private rateMasterService;
    constructor(rateMasterService: RateMasterService) {
        this.rateMasterService = rateMasterService;
    }

    public getActiveRateSheets: RequestHandler<{}, any, any, GetRateSheetsFilters> = async (
        req: Request<{}, any, any, GetRateSheetsFilters>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const filters = req.query;
            const rateSheets = await this.rateMasterService.getActiveRateSheets(filters);
            successResponse({ res, response: rateSheets, message: 'Active rate sheets fetched successfully' });
        } catch (error) {
            next(error);
        }
    };

    public distinctShippingLines: RequestHandler<{}, any, any, GetRateSheetsFilters> = async (
        req: Request<{}, any, any, GetRateSheetsFilters>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const shippingLines = await this.rateMasterService.distinctShippingLines();
            successResponse({ res, response: shippingLines, message: 'Shipping lines fetched successfully' });
        } catch (error) {
            next(error);
        }
    };

    public distinctPorts: RequestHandler<{shippingLineId: string}, any, any, GetRateSheetsFilters> = async (
        req: Request<{shippingLineId: string}, any, any, GetRateSheetsFilters>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const targetLineId = req.query.shippingLineId;
            const ports = await this.rateMasterService.distinctPorts(targetLineId);
            successResponse({ res, response: ports, message: 'Ports fetched successfully' });
        } catch (error) {
            next(error);
        }
    };
}

export const rateMasterController = new RateMasterController(rateMasterService);
