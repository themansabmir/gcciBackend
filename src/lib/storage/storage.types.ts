/**
 * Storage provider types and interfaces
 * Defines the contract for storage providers (Cloudinary, AWS S3, GCP, etc.)
 */

/**
 * Configuration for storage providers
 */
export interface StorageConfig {
  provider: 'cloudinary' | 'aws-s3' | 'gcp';
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  awsS3?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  gcp?: {
    projectId: string;
    keyFilename: string;
    bucket: string;
  };
}

/**
 * Options for file upload
 */
export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  allowedFormats?: string[];
  maxFileSize?: number;
}

/**
 * Result from file upload
 */
export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  originalFilename?: string;
}

/**
 * Storage provider interface
 * All storage providers must implement this interface
 */
export interface IStorageProvider {
  /**
   * Upload a file to the storage provider
   * @param file - File buffer or path
   * @param options - Upload options
   * @returns Upload result with URL and metadata
   */
  upload(file: Buffer | string, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Delete a file from the storage provider
   * @param publicId - Unique identifier of the file
   * @returns Success status
   */
  delete(publicId: string): Promise<boolean>;

  /**
   * Get the public URL of a file
   * @param publicId - Unique identifier of the file
   * @returns Public URL
   */
  getUrl(publicId: string): string;
}
