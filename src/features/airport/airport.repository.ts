import { BaseRepository } from "@features/base.repository";
import { IAirport } from "./airport.types";
import AirportModel from "./airport.entity";

export class AirportRepository extends BaseRepository<IAirport> { }

const airportRepository = new AirportRepository(AirportModel)
export default airportRepository