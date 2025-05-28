import { NextFunction, Request, RequestHandler, Response } from 'express';
import AirportService from './airport.service';
import { IAirport } from './airport.types';
import { successResponse } from '@middleware/successResponse';
import { IQuery } from '@features/vendor/vendor.types';
import { Logger } from '@lib/logger';
import AiportEntity from './airport.entity';
import AirportRepository from './airport.repository';

class AirportController {
  private airportService;
  constructor(airportService: AirportService) {
    this.airportService = airportService;
  }
  public createAirport: RequestHandler<{}, any, IAirport> = async (req: Request<{}, any, IAirport>, res: Response, next: NextFunction) => {
    try {
      const airportBody = req.body;
      const airportRes = await this.airportService.createAirport(airportBody);

      res.status(200).json({ message: 'Airport Created Successfully', response: airportRes });
    } catch (error) {
      next(error);
    }
  };

  public getAllAirports: RequestHandler<any, any, any, IQuery> = async (req: Request<any, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.airportService.findAirports(query);
       successResponse({ res, response: data, message: 'Airports Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  public updateAirport: RequestHandler<{ id: string }, any, IAirport> = async (
    req: Request<{ id: string }, any, IAirport>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const airportUpdateBody = req.body;
      const id = req.params?.id;
      const airportRes = await this.airportService.updateAirport(id, airportUpdateBody);
       successResponse({ res, response: airportRes, message: 'Airport updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteAirport: RequestHandler<{ id: string }, any, any> = async (
    req: Request<{ id: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const airportRes = await this.airportService.deleteAirport(id);
       successResponse({ res, response: airportRes, message: 'Airport deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const airportRepository = new AirportRepository(AiportEntity);
const airportService = new AirportService(airportRepository);
export const airportController = new AirportController(airportService);
