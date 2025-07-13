import { Schema, model } from 'mongoose';
import { IMedia } from './media.types';

const mediaEntity = new Schema<IMedia>(
  {
    shipment_folder_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MediaEntity = model('Media', mediaEntity);

export default MediaEntity;
