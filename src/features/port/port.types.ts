import { Document } from 'mongoose';

export interface IPort extends Document {
  port_name: String;
  port_code: String;
}

export type update_port_dto = Partial<IPort>;
