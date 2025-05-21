import { Schema, model } from "mongoose";
import { IAirport } from "./airport.types";

const airportEntity = new Schema<IAirport>(
  {
    airport_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
     index:true
    },
    airport_code: {
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

const AirportModel = model("Airport", airportEntity);

export default AirportModel;
