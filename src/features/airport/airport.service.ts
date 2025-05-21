import airportRepository from "./airport.repository";
import { IAirport, update_airport_dto } from "./airport.types";

class AirportService {
  async createAirport(airport_DTO: IAirport) {
    try {
      return await airportRepository.create(airport_DTO);
    } catch (error) {
      throw error;
    }
  }

  async updateAirport(update_airport_DTO: update_airport_dto) {
    try {
    return await  airportRepository.updateById(update_airport_DTO.id, {
        ...update_airport_DTO,
      });
    } catch (error) {
      throw error
    }
  }
}


export const airportService  = new AirportService()