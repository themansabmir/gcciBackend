/**
 * Storage module exports
 * Provides unified storage abstraction for different cloud providers
 */

import { StorageFactory } from './storage.factory';
import { IStorageProvider, StorageConfig } from './storage.types';
import { STORAGE_PROVIDER, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '@config/env';

// Export types
export * from './storage.types';
export { StorageFactory } from './storage.factory';

/**
 * Get storage configuration from environment variables
 */
function getStorageConfig(): StorageConfig {
  const config: StorageConfig = {
    provider: STORAGE_PROVIDER,
  };

  if (STORAGE_PROVIDER === 'cloudinary') {
    config.cloudinary = {
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      apiSecret: CLOUDINARY_API_SECRET,
    };
  }

  return config;
}

/**
 * Default storage provider instance
 * Configured based on environment variables
 */
export const storageProvider: IStorageProvider = StorageFactory.createProvider(getStorageConfig());
