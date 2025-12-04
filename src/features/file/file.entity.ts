import { Schema, model, Types } from 'mongoose';
import { IFile } from './file.types';

const fileSchema = new Schema<IFile>(
  {
    file_name: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
    },
    storage_provider: {
      type: String,
      required: true,
      enum: ['cloudinary', 'aws-s3', 'gcp'],
    },
    storage_public_id: {
      type: String,
      required: true,
    },
    shipment_id: {
      type: String,
      ref: 'Shipment',
      required: true,
      index: true,
    },
    uploaded_by: {
      type: String,
      ref: 'Team',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
fileSchema.index({ shipment_id: 1, createdAt: -1 });

const FileEntity = model<IFile>('File', fileSchema);

export default FileEntity;
