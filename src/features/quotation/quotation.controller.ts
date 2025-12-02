import { NextFunction, Request, Response } from 'express';
import { quotationService } from './quotation.service';

class QuotationController {
  async createQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const quotation = await quotationService.createQuotation(req.body);
      res.status(201).json(quotation);
    } catch (error) {
      next(error);
    }
  }

  async getQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const quotation = await quotationService.getQuotationById(req.params.id);
      if (!quotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }
      res.status(200).json(quotation);
    } catch (error) {
      next(error);
    }
  }

  async getAllQuotations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sortBy, sortOrder, search, ...filters } = req.query as any;
      const quotations = await quotationService.getAllQuotations({ page, limit, sortBy, sortOrder, search }, filters);
      res.status(200).json(quotations);
    } catch (error) {
      next(error);
    }
  }

  async updateQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const quotation = await quotationService.updateQuotation(req.params.id, req.body);
      res.status(200).json(quotation);
    } catch (error) {
      next(error);
    }
  }

  async deleteQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      await quotationService.deleteQuotation(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async changeQuotationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      // Changed
      const { status } = req.body;
      const userId = req.user?._id;
      const id = req.params.id;
      const quotation = await quotationService.changeStatus(id, status, userId);
      res.status(200).json(quotation);
    } catch (error) {
      next(error);
    }
  }

  async duplicateQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const quotation = await quotationService.duplicateQuotation(req.params.id);
      res.status(201).json(quotation);
    } catch (error) {
      next(error);
    }
  }

  async sendQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const quotation = await quotationService.sendQuotationEmail(req.params.id);
      res.status(200).json(quotation);
    } catch (error) {
      next(error);
    }
  }
}

export const quotationController = new QuotationController();
