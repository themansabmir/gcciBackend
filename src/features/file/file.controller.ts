import { Request, Response } from 'express';
import { NextFunction, RequestHandler } from 'express';
import FileService from './file.service';
import FileRepository from './file.repository';
import { successResponse } from '@middleware/successResponse';

class FileController {
  private fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  /**
   * Upload a file for a shipment
   * POST /api/file/upload
   */
  public uploadFile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shipmentId } = req.body;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      if (!shipmentId) {
        res.status(400).json({ error: 'shipmentId is required' });
        return;
      }

      const uploadedFile = await this.fileService.uploadFile(file.buffer, shipmentId, file.originalname, file.mimetype, file.size);

      successResponse({
        res,
        response: uploadedFile,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a file by ID
   * GET /api/file/:id
   */
  public getFile: RequestHandler<{ id: string }> = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const file = await this.fileService.getFileById(id);

      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      successResponse({ res, response: file, message: 'File fetched successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all files for a shipment
   * GET /api/file/shipment/:shipmentId
   */
  public getFilesByShipment: RequestHandler<{ shipmentId: string }> = async (
    req: Request<{ shipmentId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { shipmentId } = req.params;
      const files = await this.fileService.getFilesByShipment(shipmentId);

      successResponse({
        res,
        response: files,
        message: `Found ${files.length} file(s) for shipment`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a file
   * DELETE /api/file/:id
   */
  public deleteFile: RequestHandler<{ id: string }> = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.fileService.deleteFile(id);

      successResponse({ res, response: { id }, message: 'File deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete all files for a shipment
   * DELETE /api/file/shipment/:shipmentId
   */
  public deleteFilesByShipment: RequestHandler<{ shipmentId: string }> = async (
    req: Request<{ shipmentId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { shipmentId } = req.params;
      await this.fileService.deleteFilesByShipment(shipmentId);

      successResponse({
        res,
        response: { shipmentId },
        message: 'All files for the shipment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

const fileRepository = new FileRepository();
const fileService = new FileService(fileRepository);
export const fileController = new FileController(fileService);
