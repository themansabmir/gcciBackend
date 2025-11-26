import { Router } from 'express';
import { quotationController } from './quotation.controller';
import { CreateQuotationSchema, UpdateQuotationSchema, QuotationFilterSchema } from './quotation.dto';

const quotationRouter = Router();

quotationRouter.post('/', quotationController.createQuotation);
quotationRouter.get('/', quotationController.getAllQuotations);
// quotationRouter.get('/:id', quotationController.getQuotation);
quotationRouter.put('/:id', quotationController.updateQuotation);
quotationRouter.delete('/:id', quotationController.deleteQuotation);
quotationRouter.patch('/:id/status', quotationController.changeQuotationStatus);
quotationRouter.post('/:id/duplicate', quotationController.duplicateQuotation);
quotationRouter.post('/:id/send', quotationController.sendQuotation);
quotationRouter.get('/:id/pdf', quotationController.downloadQuotationPDF);

export default quotationRouter;
