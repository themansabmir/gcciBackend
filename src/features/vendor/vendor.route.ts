import {defaultRouter} from '@lib/router';
import { validateDTO } from '@middleware/validateDTO';
import { vendorController } from './vendor.controller';
import { createVendorDTO } from './vendor.dto';

const vendorRouter= defaultRouter()

vendorRouter.post('/', validateDTO(createVendorDTO), vendorController.createVendor);
vendorRouter.put('/:id', vendorController.updateVendor);

vendorRouter.get('/', vendorController.findVendors);
vendorRouter.delete('/:id', vendorController.deleteVendor);
export default vendorRouter;
