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
      const cleanedFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const quotations = await quotationService.getAllQuotations({ page, limit, sortBy, sortOrder, search }, cleanedFilters);
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
      const { status } = req.body;
      const quotation = await quotationService.changeStatus(req.params.id, status);
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

  async sendQuotationToVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.body;
      if (!vendorId) {
        res.status(400).json({ message: 'vendorId is required in body' });
      }
      const result = await quotationService.sendQuotationToVendor(req.params.id, vendorId);
      res.status(200).json({ message: 'Email sent', result });
    } catch (error) {
      next(error);
    }
  }

  async filterQuotations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sortBy, sortOrder, ...filterParams } = req.query as any;

      // Extract pagination/sorting params
      const query = { page, limit, sortBy, sortOrder };

      // All other query params are filter params
      const quotations = await quotationService.filterQuotations(query, filterParams);

      res.status(200).json(quotations);
    } catch (error) {
      next(error);
    }
  }

  async downloadQuotationPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await quotationService.generateQuotationPDF(req.params.id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quotation-${req.params.id}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}

export const quotationController = new QuotationController();
