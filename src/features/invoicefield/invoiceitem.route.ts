import { invoiceitem_validate, update_invoiceitem_validate } from './invoiceitem.dto';
import { validateDTO } from '@middleware/validateDTO';
import { defaultRouter } from '@lib/router';
import { invoiceItemController } from './invoiceitem.controller';

const invoiceItemRouter = defaultRouter();

invoiceItemRouter.post('/', validateDTO(invoiceitem_validate), invoiceItemController.createInvoiceItem);
invoiceItemRouter.get('/', invoiceItemController.getAllInvoiceItems);
invoiceItemRouter.put('/:id', validateDTO(update_invoiceitem_validate), invoiceItemController.updateInvoiceItem);
invoiceItemRouter.delete('/:id', invoiceItemController.deleteInvoiceItem);

export default invoiceItemRouter;
