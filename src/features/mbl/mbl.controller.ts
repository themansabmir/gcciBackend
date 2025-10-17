import { NextFunction, Request, RequestHandler, Response } from 'express';
import MblService from './mbl.service';
import { IMbl } from './mbl.types';
import { successResponse } from '@middleware/successResponse';
import { IQuery } from '@features/vendor/vendor.types';
import MBLRepository from './mbl.repository';
import { MblEntity } from './mbl.entity';

class MBLController {
  private mblService;
  constructor(mblService: MblService) {
    this.mblService = mblService;
  }

  public createOrUpdateMBL: RequestHandler<{}, any, IMbl> = async (req: Request<{}, any, IMbl>, res: Response, next: NextFunction) => {
    try {
      const mblBody = req.body;
      const mblRes = await this.mblService.createOneOrUpdateMBL(mblBody);
      successResponse({ res, response: mblRes, message: 'MBL saved Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getByShipmentFolderId: RequestHandler<{ id: string }, any, any, IQuery> = async (
    req: Request<{ id: string }, any, any, IQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const mblRes = await this.mblService.findByFolderId(id);
      successResponse({ res, response: mblRes, message: 'MBL Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const mblRepository = new MBLRepository(MblEntity);
export const mblService = new MblService(mblRepository);
export const mblController = new MBLController(mblService);
