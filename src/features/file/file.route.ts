import { Router } from 'express';
import { fileController } from './file.controller';
import { uploadMiddleware } from '@middleware/upload';

const fileRouter = Router();

// Upload a file
fileRouter.post('/upload', uploadMiddleware.single('file'), fileController.uploadFile);

// Get file by ID
fileRouter.get('/:id', fileController.getFile);

// Get all files for a shipment
fileRouter.get('/shipment/:shipmentId', fileController.getFilesByShipment);

// Delete a file by ID
fileRouter.delete('/:id', fileController.deleteFile);

// Delete all files for a shipment
fileRouter.delete('/shipment/:shipmentId', fileController.deleteFilesByShipment);

export default fileRouter;
