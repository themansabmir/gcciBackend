import FileEntity from './file.entity';
import { IFile, IFileBody, IFileQuery } from './file.types';

export default class FileRepository {
  async create(data: Partial<IFile>): Promise<IFile> {
    const file = await FileEntity.create(data);
    return file;
  }

  async findById(id: string): Promise<IFile | null> {
    return FileEntity.findById(id);
  }

  async findByQuery(query: IFileQuery): Promise<IFile[]> {
    return FileEntity.find(query).sort({ createdAt: -1 });
  }

  async findByShipmentId(shipmentId: string): Promise<IFile[]> {
    return FileEntity.find({ shipment_id: shipmentId }).sort({
      createdAt: -1,
    });
  }

  async updateById(id: string, data: Partial<IFile>): Promise<IFile | null> {
    return FileEntity.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<IFile | null> {
    return FileEntity.findByIdAndDelete(id);
  }

  async deleteByPublicId(publicId: string): Promise<IFile | null> {
    return FileEntity.findOneAndDelete({ storage_public_id: publicId });
  }

  async deleteMultiple(ids: string[]): Promise<any> {
    return FileEntity.deleteMany({ _id: { $in: ids } });
  }
}
