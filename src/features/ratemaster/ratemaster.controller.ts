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
}

export const rateMasterController = new RateMasterController(rateMasterService);
