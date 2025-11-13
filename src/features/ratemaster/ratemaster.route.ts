import { defaultRouter } from '@lib/router';
import { rateMasterController } from './ratemaster.controller';

const rateSheetMasterRouter = defaultRouter();

rateSheetMasterRouter.get('/', rateMasterController.getActiveRateSheets);
rateSheetMasterRouter.get('/shippingLines', rateMasterController.distinctShippingLines);
rateSheetMasterRouter.get('/distinctPorts', rateMasterController.distinctPorts);

export default rateSheetMasterRouter;
