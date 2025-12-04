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
      return await this.fileRepository.findById(fileId).populate({ path: 'shipment_id', select: 'shipment_name shipment_type -_id' });
    } catch (error) {
      console.error('Error fetching file:', error);
      throw new Error(`Failed to fetch file: ${error}`);
    }
  }
}
