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

  async bulkUploadPorts(parsedData: any[]) {
    try {
      if (parsedData.length === 0) {
        throw new Error('No data found in the uploaded file');
      }

      // Validate and prepare data
      const validatedPorts: Partial<IPort>[] = [];
      const errors: string[] = [];

      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        const rowNumber = i + 2; // Excel row number (accounting for header)

        // Validate required fields
        if (!row.port_name || !row.port_code) {
          errors.push(`Row ${rowNumber}: Port Name and Port Code are required`);
          continue;
        }

        // Validate port_code format (alphanumeric, no spaces)
        const portCodeRegex = /^[A-Za-z0-9]+$/;
        if (!portCodeRegex.test(row.port_code)) {
          errors.push(`Row ${rowNumber}: Port Code must be alphanumeric without spaces`);
          continue;
        }

        // Check for duplicates in the current batch
        const isDuplicateInBatch = validatedPorts.some(
          port => port.port_code?.toLowerCase() === row.port_code.toLowerCase() ||
            port.port_name?.toLowerCase() === row.port_name.toLowerCase()
        );

        if (isDuplicateInBatch) {
          errors.push(`Row ${rowNumber}: Duplicate port found in the uploaded file`);
          continue;
        }

        // Check for existing ports in database
        const existingPortByCode = await this.portRepository.findOne({
          port_code: row.port_code.toLowerCase()
        });
        const existingPortByName = await this.portRepository.findOne({
          port_name: { $regex: new RegExp(`^${row.port_name}$`, 'i') }
        });

        if (existingPortByCode) {
          errors.push(`Row ${rowNumber}: Port with code '${row.port_code}' already exists`);
          continue;
        }

        if (existingPortByName) {
          errors.push(`Row ${rowNumber}: Port with name '${row.port_name}' already exists`);
          continue;
        }

        validatedPorts.push({
          port_name: row.port_name.trim(),
          port_code: row.port_code.toLowerCase().trim()
        });
      }

      if (errors.length > 0) {
        throw new Error(`Validation errors:\n${errors.join('\n')}`);
      }

      if (validatedPorts.length === 0) {
        throw new Error('No valid ports found to import');
      }

      // Bulk insert validated ports
      const createdPorts = await this.portRepository.createMany(validatedPorts);

      return {
        success: true,
        message: `Successfully imported ${createdPorts.length} ports`,
        imported: createdPorts.length,
        data: createdPorts
      };

    } catch (error) {
      throw error;
    }
  }


}
export default PortService;
