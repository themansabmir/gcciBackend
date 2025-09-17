import { Router } from 'express';
import { proformaInvoiceController } from './proforma-invoice.controller';
import { validateDTO } from '../../middleware/validateDTO';
import { createProformaInvoiceDTO, updateProformaInvoiceDTO } from './proforma-invoice.dto';

const proformaInvoiceRouter = Router();

proformaInvoiceRouter.post(
  '/',
  validateDTO(createProformaInvoiceDTO),
  proformaInvoiceController.create
);

proformaInvoiceRouter.get('/', proformaInvoiceController.findAll);

proformaInvoiceRouter.get('/:id', proformaInvoiceController.findById);

proformaInvoiceRouter.put(
    '/:id',
    validateDTO(updateProformaInvoiceDTO),
    proformaInvoiceController.update
);

proformaInvoiceRouter.delete('/:id', proformaInvoiceController.delete);


export default proformaInvoiceRouter;
