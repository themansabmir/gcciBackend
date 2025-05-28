import { Document } from "mongoose";

export interface IAirport extends Document {
  airport_name: String;
  airport_code: String;
}

export type  update_airport_dto= Partial<IAirport>;