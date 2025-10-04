import { finance_validate, update_finance_validate } from './finance.dto';
import { validateDTO } from '@middleware/validateDTO';
import { defaultRouter } from '@lib/router';
import { financeController } from './finance.controller';

const financeRouter = defaultRouter();

financeRouter.post('/', validateDTO(finance_validate), financeController.createFinanceDocument);
financeRouter.get('/', financeController.getAllFinanceDocuments);
financeRouter.put('/:id', validateDTO(update_finance_validate), financeController.updateFinanceDocument);
financeRouter.delete('/:id', financeController.deleteFinanceDocument);
financeRouter.get('/shipment/:shipmentId', financeController.getFinanceDocumentsByShipment);
financeRouter.get('/customer/:customerId', financeController.getFinanceDocumentsByCustomer);

export default financeRouter;
