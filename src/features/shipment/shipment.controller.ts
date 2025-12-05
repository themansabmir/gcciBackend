import { NextFunction, RequestHandler, Request, Response } from 'express';
import ShipmentService from './shipment.service';
import { IShipment } from './shipment.types';
import { successResponse } from '@middleware/successResponse';
import ShipmentRepository from './shipment.repository';
import ShipmentEntity from './shipment.entity';
import { IQuery } from '@features/vendor/vendor.types';

class ShipmentController {
  private shipmentService;
  constructor(shipmentService: ShipmentService) {
    this.shipmentService = shipmentService;
  }

  public create: RequestHandler<unknown, any, IShipment> = async (req: Request<unknown, any, IShipment>, res: Response, next: NextFunction) => {
    try {
      const shipmentBody = req.body;
      const shipmentRes = await this.shipmentService.createShipment(shipmentBody);
      successResponse({ res, response: shipmentRes, message: 'Shipment Created Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public findAll: RequestHandler<unknown, any, any, IQuery> = async (req: Request<unknown, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total, page, limit, totalPages } = await this.shipmentService.getAllShipments(query);
      successResponse({
        res,
        response: {
          data,
          pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
        message: 'Shipments Fetched Successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public findById: RequestHandler<{ id: string }, any, any, any> = async (
    req: Request<{ id: string }, any, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const shipmentRes = await this.shipmentService.findById(id);
      successResponse({ res, response: shipmentRes, message: 'Shipment Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public findDocumentsByShipmentId: RequestHandler<{ id: string }, any, any, any> = async (
    req: Request<{ id: string }, any, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const shipmentRes = await this.shipmentService.findDocumentsByShipmentId(id);
      successResponse({ res, response: shipmentRes, message: 'Shipment Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const shipmentRepo = new ShipmentRepository(ShipmentEntity);
export const shipmentService = new ShipmentService(shipmentRepo);
export const shipmentController = new ShipmentController(shipmentService);
