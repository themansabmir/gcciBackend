import { NextFunction, Request, RequestHandler, Response } from 'express';
import HblService from './hbl.service';
import { successResponse } from '@middleware/successResponse';
import HBLRepository from './hbl.repository';
import { HBLEntity } from './hbl.entity';

class HblController {
  private hblService;
  constructor(hblService: HblService) {
    this.hblService = hblService;
  }

  public saveHbl: RequestHandler<{}, any, {}> = async (req: Request<{}, any, {}>, res: Response, next: NextFunction) => {
    try {
      const hblBody = req.body;
      const hblRes = await this.hblService.saveHbl(hblBody);
      successResponse({ res, response: hblRes, message: 'HBL saved Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getHblById: RequestHandler<{ id: string }, any, any, {}> = async (
    req: Request<{ id: string }, any, any, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const hblRes = await this.hblService.getHblById(id);
      successResponse({ res, response: hblRes, message: 'HBL Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getAllHblByShipmentId: RequestHandler<{ id: string }, any, any, {}> = async (
    req: Request<{ id: string }, any, any, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const hblRes = await this.hblService.getAllHblByShipmentId(id);
      successResponse({ res, response: hblRes, message: 'HBL Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };
}



const hblRepository = new HBLRepository(HBLEntity)
const hblService  = new HblService(hblRepository)
export const hblCtrl = new HblController(hblService)
