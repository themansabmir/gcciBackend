import { IMedia } from './media.types';
import MediaEntity from './media.entity';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { ISuccessResponse } from '../../middleware/successResponse';

class MediaRepository {
  async create(media: IMedia): Promise<IMedia> {
    return await MediaEntity.create(media);
  }

  async find(
    filter: FilterQuery<IMedia>,
    options?: QueryOptions
  ): Promise<ISuccessResponse | IMedia[]> {
    return await MediaEntity.find(filter, null, options);
  }

  async findOne(filter: FilterQuery<IMedia>): Promise<IMedia | null> {
    return await MediaEntity.findOne(filter);
  }

  async updateOne(
    filter: FilterQuery<IMedia>,
    update: UpdateQuery<IMedia>
  ): Promise<IMedia | null> {
    return await MediaEntity.findOneAndUpdate(filter, update, { new: true });
  }

  async deleteOne(filter: FilterQuery<IMedia>): Promise<any> {
    return await MediaEntity.deleteOne(filter);
  }
}

export default new MediaRepository();
