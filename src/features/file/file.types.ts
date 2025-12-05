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

export interface IFileBody {
  file_name?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  storage_provider?: string;
  storage_public_id?: string;
  shipment_id?: string;
  uploaded_by?: string;
}

export interface IFileQuery {
  shipment_id?: string;
  uploaded_by?: string;
  storage_provider?: string;
}
