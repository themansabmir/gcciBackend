import { Router } from 'express';
import { quotationController } from './quotation.controller';
import { CreateQuotationSchema, UpdateQuotationSchema, QuotationFilterSchema } from './quotation.dto';

const router = Router();

router.post('/', quotationController.createQuotation);
router.get('/', quotationController.getAllQuotations);
// router.get('/:id', quotationController.getQuotation);
router.put('/:id', quotationController.updateQuotation);
router.delete('/:id', quotationController.deleteQuotation);
router.patch('/:id/status', quotationController.changeQuotationStatus);
router.post('/:id/duplicate', quotationController.duplicateQuotation);
router.post('/:id/send', quotationController.sendQuotation);

export default router;
