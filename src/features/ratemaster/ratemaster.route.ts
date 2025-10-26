import { defaultRouter } from '@lib/router';
import { rateMasterController } from './ratemaster.controller';

const rateSheetMasterRouter = defaultRouter();

rateSheetMasterRouter.get('/', rateMasterController.getActiveRateSheets);

export default rateSheetMasterRouter;
