import { IQuery } from '@features/vendor/vendor.types';
import PortRepository from './port.repository';
import { IPort, update_port_dto } from './port.types';

class PortService {
  private portRepository;

  constructor(portRepository: PortRepository) {
    this.portRepository = portRepository;
  }
  async createport(port_DTO: IPort) {
    try {
      return await this.portRepository.create(port_DTO);
    } catch (error) {
      throw error;
    }
  }

  async updateport(id: string, update_port_DTO: update_port_dto) {
    try {
      return await this.portRepository.updateById(id, {
        ...update_port_DTO,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteport(id: string) {
    try {
      return await this.portRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async findportById(id: string) {
    try {
      return await this.portRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findPorts(query: IQuery) {
    const { filter, limit, skip, sort } = this.portRepository.buildSearchQuery(query, ['port_name', 'port_code']);

    const filterQuery = this.portRepository.find(filter);
    if (limit) filterQuery.limit(limit);
    if (skip) filterQuery.skip(skip);
    if (sort && Object.keys(sort).length) filterQuery.sort(sort);

    try {
      const countPromise = this.portRepository.count(filter);
      const [data, total] = await Promise.all([filterQuery, countPromise]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }
}
export default PortService;
