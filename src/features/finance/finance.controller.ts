import { NextFunction, Request, RequestHandler, Response } from 'express';
import FinanceService from './finance.service';
import { IFinanceDocument, ILineItem } from './finance.types';
import { successResponse } from '@middleware/successResponse';
import { IQuery } from '@features/vendor/vendor.types';
import { Logger } from '@lib/logger';
import {FinanceDocument} from './finance.entity';
import FinanceRepository from './finance.repository';

class FinanceController {
  private financeService;
  
  constructor(financeService: FinanceService) {
    this.financeService = financeService;
  }

  public createFinanceDocument: RequestHandler<{}, any, IFinanceDocument> = async (req: Request<{}, any, IFinanceDocument>, res: Response, next: NextFunction) => {
    try {
      const financeBody = req.body;
      const  {lineItems} = financeBody
      lineItems.forEach(row => {
        if (!row.serviceItem || row.quantity <= 0 || row.rate < 0 || !row.rate || !row.quantity || !row.serviceItem) {
          throw new Error(`Invalid row data for serviceItem ${row.serviceItem}`);
        }
      });
      
      const financeRes = await this.financeService.createFinanceDocument(financeBody);

      res.status(200).json({ message: 'Finance Document Created Successfully', response: financeRes });
    } catch (error) {
      next(error);
    }
  };

  public getAllFinanceDocuments: RequestHandler<any, any, any, IQuery> = async (req: Request<any, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.financeService.findFinanceDocuments(query);
      successResponse({ res, response: data, message: 'Finance Documents Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  public updateFinanceDocument: RequestHandler<{ id: string }, any, IFinanceDocument> = async (
    req: Request<{ id: string }, any, IFinanceDocument>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const financeUpdateBody = req.body;
      const id = req.params?.id;
      const financeRes = await this.financeService.updateFinanceDocument(id, financeUpdateBody);
      successResponse({ res, response: financeRes, message: 'Finance Document updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteFinanceDocument: RequestHandler<{ id: string }, any, any> = async (
    req: Request<{ id: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const financeRes = await this.financeService.deleteFinanceDocument(id);
      successResponse({ res, response: financeRes, message: 'Finance Document deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getFinanceDocumentById: RequestHandler<{ id: string }, any, any> = async (
    req: Request<{ id: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const financeRes = await this.financeService.getFinanceDocumentById(id);
      successResponse({ res, response: financeRes, message: 'Finance Document fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getFinanceDocumentsByShipment: RequestHandler<{ shipmentId: string }, any, any> = async (
    req: Request<{ shipmentId: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const shipmentId = req.params?.shipmentId;
      const financeRes = await this.financeService.findFinanceDocumentsByShipment(shipmentId);
      successResponse({ res, response: financeRes, message: 'Finance Documents fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getFinanceDocumentsByCustomer: RequestHandler<{ customerId: string }, any, any> = async (
    req: Request<{ customerId: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const customerId = req.params?.customerId;
      const financeRes = await this.financeService.findFinanceDocumentsByCustomer(customerId);
      successResponse({ res, response: financeRes, message: 'Finance Documents fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const financeRepository = new FinanceRepository(FinanceDocument);
const financeService = new FinanceService(financeRepository);
export const financeController = new FinanceController(financeService);
