import { IStorageProvider, StorageConfig } from './storage.types';
import { CloudinaryProvider } from './providers/cloudinary.provider';

/**
 * Storage Provider Factory
 * Creates storage provider instances based on configuration
 */
export class StorageFactory {
  /**
   * Create a storage provider instance
   * @param config - Storage configuration
   * @returns Storage provider instance
   */
  static createProvider(config: StorageConfig): IStorageProvider {
    switch (config.provider) {
      case 'cloudinary':
        if (!config.cloudinary) {
          throw new Error('Cloudinary configuration is required when provider is "cloudinary"');
        }
        return new CloudinaryProvider(config.cloudinary.cloudName, config.cloudinary.apiKey, config.cloudinary.apiSecret);
      case 'aws-s3':
        // TODO: Implement AWS S3 provider in the future
        throw new Error('AWS S3 provider is not yet implemented');
      case 'gcp':
        // TODO: Implement GCP provider in the future
        throw new Error('GCP provider is not yet implemented');
      default:
        throw new Error(`Unknown storage provider: ${config.provider}`);
    }
  }
}
