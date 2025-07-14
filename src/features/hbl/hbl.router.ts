import { defaultRouter } from '@lib/router';
import { hblCtrl } from './hbl.controller';

const hblRouter = defaultRouter();

hblRouter.post('/', hblCtrl.saveHbl);
hblRouter.get('/:id', hblCtrl.getHblById);
hblRouter.get('/shipment/:id', hblCtrl.getAllHblByShipmentId);

export default hblRouter;
