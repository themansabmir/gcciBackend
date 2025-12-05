import { Document } from 'mongoose';

export interface IFile extends Document {
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  storage_provider: 'cloudinary' | 'aws-s3' | 'gcp';
  storage_public_id: string;
  shipment_id: string;
  uploaded_by?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * File query interface
 */
export interface IFileQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  shipment_id?: string;
  uploaded_by?: string;
}

/**
 * File upload request
 */
export interface FileUploadRequest {
  shipment_id: string;
}
