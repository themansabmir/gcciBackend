import { defaultRouter } from '@lib/router';
import { fileController } from './file.controller';
import { uploadFile } from '@middleware/upload';

const fileRouter = defaultRouter();

// Upload file for a specific shipment
fileRouter.post('/upload/:shipmentId', uploadFile, fileController.uploadFile);

// Get a single file by ID
fileRouter.get('/:id', fileController.getFile);

export default fileRouter;
