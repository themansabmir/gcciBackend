import { StorageFactory } from './storage.factory';
import { StorageConfig } from './storage.types';
import { STORAGE_PROVIDER, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '@config/env';

/**
 * Storage configuration from environment variables
 */
const storageConfig: StorageConfig = {
  provider: STORAGE_PROVIDER,
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  },
  awsS3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
    bucket: process.env.AWS_S3_BUCKET || '',
  },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || '',
    keyFilename: process.env.GCP_KEY_FILENAME || '',
    bucket: process.env.GCP_BUCKET || '',
  },
};

/**
 * Initialize and export the storage provider instance
 */
const storageProvider = StorageFactory.createProvider(storageConfig);

export { storageProvider, StorageFactory, type StorageConfig };
export type { IStorageProvider, UploadOptions, UploadResult } from './storage.types';
