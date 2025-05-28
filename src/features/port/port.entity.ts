import { Schema, model } from 'mongoose';
import { IPort } from './port.types';

const portEntity = new Schema<IPort>(
  {
    port_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    port_code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PortModel = model('Port', portEntity);

export default PortModel;
