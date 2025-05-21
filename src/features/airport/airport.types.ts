import { Document } from "mongoose";

export interface IAirport extends Document {
  airport_name: String;
  airport_code: String;
}

export interface update_airport_dto extends IAirport {
  id: string;
}
