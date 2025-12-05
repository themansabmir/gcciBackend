import FileRepository from './file.repository';
import { IFile } from './file.types';
import { storageProvider, UploadOptions } from '@lib/storage';
import { STORAGE_PROVIDER } from '@config/env';

export default class FileService {
  private fileRepository: FileRepository;

  constructor(fileRepository: FileRepository) {
    this.fileRepository = fileRepository;
  }

  async uploadFile(file: Buffer, shipmentId: string, originalName: string, mimeType: string, fileSize: number): Promise<IFile> {
    try {
      // Upload to storage provider
      const uploadOptions: UploadOptions = {
        folder: `shipments/${shipmentId}`,
        resourceType: 'auto',
      };

      const uploadResult = await storageProvider.upload(file, uploadOptions);

      // Save file metadata to database
      const fileData: Partial<IFile> = {
        file_name: originalName,
        file_url: uploadResult.secureUrl,
        file_type: mimeType,
        file_size: fileSize,
        storage_provider: STORAGE_PROVIDER,
        storage_public_id: uploadResult.publicId,
        shipment_id: shipmentId,
      };

      return await this.fileRepository.create(fileData);
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async getFileById(fileId: string): Promise<IFile | null> {
    try {
      return await this.fileRepository.findById(fileId);
    } catch (error) {
      console.error('Error fetching file:', error);
      throw new Error(`Failed to fetch file: ${error}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file details to retrieve storage_public_id
      const file = await this.fileRepository.findById(fileId);

      if (!file) {
        throw new Error('File not found');
      }

      // Delete from storage provider
      const deleteResult = await storageProvider.delete(file.storage_public_id);

      if (!deleteResult) {
        throw new Error('Failed to delete file from storage provider');
      }

      // Delete from database
      await this.fileRepository.deleteById(fileId);
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async deleteFilesByShipment(shipmentId: string): Promise<void> {
    try {
      const files = await this.fileRepository.findByShipmentId(shipmentId);

      for (const file of files) {
        try {
          await storageProvider.delete(file.storage_public_id);
        } catch (error) {
          console.error(`Failed to delete file ${file._id} from storage:`, error);
        }
      }

      // Delete all files for this shipment from database
      await this.fileRepository.deleteMultiple(files.map((f) => f._id?.toString() || ''));
    } catch (error) {
      console.error('Batch file deletion error:', error);
      throw new Error(`Failed to delete files: ${error}`);
    }
  }

  async getFilesByShipment(shipmentId: string): Promise<IFile[]> {
    try {
      return await this.fileRepository.findByShipmentId(shipmentId);
    } catch (error) {
      console.error('Error fetching files by shipment:', error);
      throw new Error(`Failed to fetch files: ${error}`);
    }
  }
}
