import OrganizationEntity, { IOrganizationDocument } from './organization.entity';

export default class OrganizationRepository {
  async create(data: Partial<IOrganizationDocument>): Promise<IOrganizationDocument> {
    const org = new OrganizationEntity(data);
    return await org.save();
  }

  async findOne(query: Record<string, any>): Promise<IOrganizationDocument | null> {
    return await OrganizationEntity.findOne(query).exec();
  }

  async findById(id: string): Promise<IOrganizationDocument | null> {
    return await OrganizationEntity.findById(id).exec();
  }

  async updateById(id: string, updateData: Partial<IOrganizationDocument>): Promise<IOrganizationDocument | null> {
    return await OrganizationEntity.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteById(id: string): Promise<IOrganizationDocument | null> {
    return await OrganizationEntity.findByIdAndDelete(id).exec();
  }
}
