import { Router } from 'express';
import { quotationController } from './quotation.controller';

const quotationRouter = Router();

quotationRouter.post('/', quotationController.createQuotation);
quotationRouter.get('/', quotationController.getAllQuotations);

// Filter route must come before /:id routes to avoid conflicts
quotationRouter.get('/filter', quotationController.filterQuotations);

// quotationRouter.get('/:id', quotationController.getQuotation);
quotationRouter.put('/:id', quotationController.updateQuotation);
quotationRouter.delete('/:id', quotationController.deleteQuotation);
quotationRouter.patch('/:id/status', quotationController.changeQuotationStatus);
quotationRouter.post('/:id/duplicate', quotationController.duplicateQuotation);
quotationRouter.post('/:id/send', quotationController.sendQuotation);
quotationRouter.post('/:id/send-to-vendor', quotationController.sendQuotationToVendor);
quotationRouter.get('/:id/pdf', quotationController.downloadQuotationPDF);

export default quotationRouter;
