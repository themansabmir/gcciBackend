import { IQuery } from '@features/vendor/vendor.types';
import AirportRepository from './airport.repository';
import { IAirport, update_airport_dto } from './airport.types';

class AirportService {
  private airportRepository;

  constructor(airportRepository: AirportRepository) {
    this.airportRepository = airportRepository;
  }
  async createAirport(airport_DTO: IAirport) {
    try {
      return await this.airportRepository.create(airport_DTO);
    } catch (error) {
      throw error;
    }
  }

  async updateAirport(id: string, update_airport_DTO: update_airport_dto) {
    try {
      return await this.airportRepository.updateById(id, {
        ...update_airport_DTO,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAirport(id: string) {
    try {
      return await this.airportRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAirportById(id: string) {
    try {
      return await this.airportRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAirports(query: IQuery) {
    const { filter, limit, skip, sort } = this.airportRepository.buildSearchQuery(query, ['airport_name', 'airport_code']);

    const filterQuery = this.airportRepository.find(filter);
    if (limit) filterQuery.limit(limit);
    if (skip) filterQuery.skip(skip);
    if (sort && Object.keys(sort).length) filterQuery.sort(sort);

    try {
      const countPromise = this.airportRepository.count(filter);
      const [data, total] = await Promise.all([filterQuery, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }
}
export default AirportService;
