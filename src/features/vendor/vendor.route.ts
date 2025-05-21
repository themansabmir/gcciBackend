import vendorRouter from '@lib/router';
import { validateDTO } from '@middleware/validateDTO';
import { vendorController } from './vendor.controller';
import { createVendorDTO } from './vendor.dto';

vendorRouter.post('/', validateDTO(createVendorDTO), vendorController.createVendor);
vendorRouter.put('/', vendorController.updateVendor);

vendorRouter.get('/', vendorController.findVendors);
vendorRouter.delete('/:id', vendorController.deleteVendor);
export default vendorRouter;
