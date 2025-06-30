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

  public create: RequestHandler<{}, any, IShipment> = async (req: Request<{}, any, IShipment>, res: Response, next: NextFunction) => {
    try {
      const shipmentBody = req.body;
      const shipmentRes = await this.shipmentService.createShipment(shipmentBody);
      successResponse({ res, response: shipmentRes, message: 'Shipment Created Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public findAll: RequestHandler<{}, any, any, IQuery> = async (req: Request<{}, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.shipmentService.getAllShipments(query);
      successResponse({ res, response: data, message: 'Shipments Fetched Successfully', total });
    } catch (error) {
      next(error);
    }
  }

  public findById: RequestHandler<{ id: string }, any, any, any> = async (req: Request<{ id: string }, any, any, any>, res: Response, next: NextFunction) => {
    try {
      const id = req.params?.id;
      const shipmentRes = await this.shipmentService.findById(id);
      successResponse({ res, response: shipmentRes, message: 'Shipment Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  }
}

const shipmentService = new ShipmentRepository(ShipmentEntity);
export const shipmentController = new ShipmentController(new ShipmentService(shipmentService));
