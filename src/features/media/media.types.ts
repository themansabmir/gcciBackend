import { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  shipment_folder_id: Schema.Types.ObjectId;
  file_name: string;
  created_by: Schema.Types.ObjectId;
  url: string;
}
