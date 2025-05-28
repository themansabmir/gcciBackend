import { IQuery } from '@features/vendor/vendor.types';
import { Logger } from '@lib/logger';
import { successResponse } from '@middleware/successResponse';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import PortModel from './port.entity';
import PortRepository from './port.repository';
import PortService from './port.service';
import { IPort } from './port.types';

class PortController {
  private portService;
  constructor(portService: PortService) {
    this.portService = portService;
  }
  public createAirport: RequestHandler<{}, any, IPort> = async (req: Request<{}, any, IPort>, res: Response, next: NextFunction) => {
    try {
      const portBody = req.body;
      const portRes = await this.portService.createport(portBody);
      res.status(200).json({ message: 'Port Created Successfully', response: portRes });
    } catch (error) {
      next(error);
    }
  };

  public getAllPorts: RequestHandler<any, any, any, IQuery> = async (req: Request<any, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.portService.findPorts(query);
      successResponse({ res, response: data, message: 'Port Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  public updatePort: RequestHandler<{ id: string }, any, IPort> = async (
    req: Request<{ id: string }, any, IPort>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const portUpdateBody = req.body;
      const id = req.params?.id;
      const portRes = await this.portService.updateport(id, portUpdateBody);
      successResponse({ res, response: portRes, message: 'Port updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deletePort: RequestHandler<{ id: string }, any, any> = async (req: Request<{ id: string }, any, any>, res: Response, next: NextFunction) => {
    try {
      const id = req.params?.id;
      const portRes = await this.portService.deleteport(id);
      successResponse({ res, response: portRes, message: 'Port deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const portRepo = new PortRepository(PortModel);
const portService = new PortService(portRepo);
export const portController = new PortController(portService);
