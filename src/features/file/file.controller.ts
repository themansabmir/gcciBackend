import { Request, Response } from 'express';
import FileService from './file.service';
import FileRepository from './file.repository';

class FileController {
  private fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  uploadFile = async (req: Request, res: Response) => {
    try {
      const { shipmentId } = req.params;

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const file = await this.fileService.uploadFile(req.file.buffer, shipmentId, req.file.originalname, req.file.mimetype, req.file.size);

      res.status(201).json({
        message: 'File uploaded successfully',
        data: file,
      });
    } catch (error: any) {
      console.error('Upload file error:', error);
      res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
  };

  /**
   * Get a single file by ID
   * GET /api/file/:id
   */
  getFile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const file = await this.fileService.getFileById(id);

      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.status(200).json({
        message: 'File retrieved successfully',
        data: file,
      });
    } catch (error: any) {
      console.error('Get file error:', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve file' });
    }
  };
}

// Create and export singleton instance
const fileRepository = new FileRepository();
const fileService = new FileService(fileRepository);
export const fileController = new FileController(fileService);
export { FileService };
