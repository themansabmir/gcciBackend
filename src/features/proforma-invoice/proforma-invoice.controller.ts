import { NextFunction, Request, Response, RequestHandler } from 'express';
import ProformaInvoiceService from './proforma-invoice.service';
import ProformaInvoiceRepository from './proforma-invoice.repository';
import { IProformaInvoice } from './proforma-invoice.types';
import { successResponse } from '../../middleware/successResponse';

class ProformaInvoiceController {
  private proformaInvoiceService: ProformaInvoiceService;

  constructor(proformaInvoiceService: ProformaInvoiceService) {
    this.proformaInvoiceService = proformaInvoiceService;
  }

  public create: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proformaInvoiceBody = req.body;
      const proformaInvoiceRes = await this.proformaInvoiceService.createProformaInvoice(proformaInvoiceBody);
      successResponse({ res, response: proformaInvoiceRes, message: 'Proforma Invoice Created Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public findAll: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as any;
      const { data, total } = await this.proformaInvoiceService.getAllProformaInvoices(query);
      successResponse({ res, response: data, message: 'Proforma Invoices Fetched Successfully', total });
    } catch (error) {
      next(error);
    }
  };

  public findById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const proformaInvoiceRes = await this.proformaInvoiceService.findProformaInvoiceById(id);
      successResponse({ res, response: proformaInvoiceRes, message: 'Proforma Invoice Fetched Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public update: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const updateBody = req.body;
        const proformaInvoiceRes = await this.proformaInvoiceService.updateProformaInvoice(id, updateBody);
        successResponse({ res, response: proformaInvoiceRes, message: 'Proforma Invoice Updated Successfully' });
    } catch (error) {
        next(error);
    }
  }

  public delete: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        await this.proformaInvoiceService.deleteProformaInvoice(id);
        successResponse({ res, message: 'Proforma Invoice Deleted Successfully' });
    } catch (error) {
        next(error);
    }
  }
}

const proformaInvoiceRepo = new ProformaInvoiceRepository();
export const proformaInvoiceService = new ProformaInvoiceService(proformaInvoiceRepo);
export const proformaInvoiceController = new ProformaInvoiceController(proformaInvoiceService);
