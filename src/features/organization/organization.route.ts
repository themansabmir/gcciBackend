import OrganizationEntity from './organization.entity';
import { IOrganization } from './organization.types';

export default class OrganizationRepository {
  async create(data: IOrganization) {
    return await OrganizationEntity.create(data);
  }

  async findOne(filter: Partial<IOrganization>) {
    return await OrganizationEntity.findOne(filter);
  }

  async findById(id: string) {
    return await OrganizationEntity.findById(id);
  }

  async updateById(id: string, update: Partial<IOrganization>) {
    return await OrganizationEntity.findByIdAndUpdate(id, update, { new: true });
  }
}
