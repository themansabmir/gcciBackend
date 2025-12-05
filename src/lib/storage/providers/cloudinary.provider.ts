import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IStorageProvider, UploadOptions, UploadResult } from '../storage.types';

/**
 * Cloudinary Storage Provider
 * Implements IStorageProvider for Cloudinary cloud storage
 */
export class CloudinaryProvider implements IStorageProvider {
  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /**
   * Upload a file to Cloudinary
   * @param file - File buffer or file path
   * @param options - Upload options
   * @returns Upload result with URL and metadata
   */
  async upload(file: Buffer | string, options?: UploadOptions): Promise<UploadResult> {
    try {
      let uploadResult: UploadApiResponse;

      if (Buffer.isBuffer(file)) {
        // Upload from buffer
        uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: options?.folder || 'shipments',
              public_id: options?.publicId,
              resource_type: options?.resourceType || 'auto',
              allowed_formats: options?.allowedFormats,
              max_file_size: options?.maxFileSize,
            },
            (error: any, result: UploadApiResponse | undefined) => {
              if (error) reject(error as Error);
              else if (result) resolve(result as UploadApiResponse);
              else reject(new Error('Upload failed'));
            }
          );
          uploadStream.end(file);
        });
      } else {
        // Upload from file path
        uploadResult = await cloudinary.uploader.upload(file, {
          folder: options?.folder || 'shipments',
          public_id: options?.publicId,
          resource_type: options?.resourceType || 'auto',
          allowed_formats: options?.allowedFormats,
        });
      }

      return {
        publicId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
        bytes: uploadResult.bytes,
        originalFilename: uploadResult.original_filename,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload file to Cloudinary: ${error}`);
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId - Cloudinary public ID
   * @returns Success status
   */
  async delete(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete file from Cloudinary: ${error}`);
    }
  }

  /**
   * Get the public URL of a file
   * @param publicId - Cloudinary public ID
   * @returns Public URL
   */
  getUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      secure: true,
    });
  }
}
