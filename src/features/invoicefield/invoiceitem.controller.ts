import { NextFunction, Request, RequestHandler, Response } from 'express';
import InvoiceItemService from './invoiceitem.service';
import { IInvoiceItem } from './invoiceitem.types';
import { successResponse } from '@middleware/successResponse';
import { IQuery } from '@features/vendor/vendor.types';
import { Logger } from '@lib/logger';
import { InvoiceItem } from './invoiceitem.entity';
import InvoiceItemRepository from './invoiceitem.repository';

class InvoiceItemController {
  private invoiceItemService;
  
  constructor(invoiceItemService: InvoiceItemService) {
    this.invoiceItemService = invoiceItemService;
  }

  public createInvoiceItem: RequestHandler<{}, any, IInvoiceItem> = async (req: Request<{}, any, IInvoiceItem>, res: Response, next: NextFunction) => {
    try {
      const invoiceItemBody = req.body;
      const invoiceItemRes = await this.invoiceItemService.createInvoiceItem(invoiceItemBody);

      res.status(200).json({ message: 'Invoice Item Created Successfully', response: invoiceItemRes });
    } catch (error) {
      next(error);
    }
  };

  public getAllInvoiceItems: RequestHandler<any, any, any, IQuery> = async (req: Request<any, any, any, IQuery>, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const { data, total } = await this.invoiceItemService.findInvoiceItems(query);
      successResponse({ res, response: data, message: 'Invoice Items Fetched Successfully', total });
    } catch (error) {
      Logger.error('SERVER ERROR', error);
      next(error);
    }
  };

  public updateInvoiceItem: RequestHandler<{ id: string }, any, IInvoiceItem> = async (
    req: Request<{ id: string }, any, IInvoiceItem>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invoiceItemUpdateBody = req.body;
      const id = req.params?.id;
      const invoiceItemRes = await this.invoiceItemService.updateInvoiceItem(id, invoiceItemUpdateBody);
      successResponse({ res, response: invoiceItemRes, message: 'Invoice Item updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public deleteInvoiceItem: RequestHandler<{ id: string }, any, any> = async (
    req: Request<{ id: string }, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params?.id;
      const invoiceItemRes = await this.invoiceItemService.deleteInvoiceItem(id);
      successResponse({ res, response: invoiceItemRes, message: 'Invoice Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

const invoiceItemRepository = new InvoiceItemRepository(InvoiceItem);
const invoiceItemService = new InvoiceItemService(invoiceItemRepository);
export const invoiceItemController = new InvoiceItemController(invoiceItemService);
