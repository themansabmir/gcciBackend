import { Router } from 'express';
import { quotationController } from './quotation.controller';
import { validate } from '../middleware/validate'; // Assuming this is where the middleware is
import { CreateQuotationSchema, UpdateQuotationSchema, QuotationFilterSchema } from './quotation.dto';

const router = Router();

const validateBody = (schema: any) => validate({ body: schema });
const validateQuery = (schema: any) => validate({ query: schema });

router.post('/', validateBody(CreateQuotationSchema), quotationController.createQuotation);
router.get('/', validateQuery(QuotationFilterSchema), quotationController.getAllQuotations);
router.get('/:id', quotationController.getQuotation);
router.put('/:id', validateBody(UpdateQuotationSchema), quotationController.updateQuotation);
router.delete('/:id', quotationController.deleteQuotation);
router.patch('/:id/status', quotationController.changeQuotationStatus);
router.post('/:id/duplicate', quotationController.duplicateQuotation);
router.post('/:id/send', quotationController.sendQuotation);

export default router;
