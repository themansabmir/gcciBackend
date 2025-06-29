import { defaultRouter } from '@lib/router';
import { mblController } from './mbl.controller';

const mblRouter = defaultRouter();

mblRouter.post('/', mblController.createOrUpdateMBL);
mblRouter.get('/:id', mblController.getByShipmentFolderId);

export default mblRouter;
