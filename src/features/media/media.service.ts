import { IMedia } from './media.types';
import mediaRepository from './media.repository';
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { ISuccessResponse } from '../../middleware/successResponse';

class MediaService {
  async create(media: IMedia): Promise<IMedia> {
    return await mediaRepository.create(media);
  }

  async find(
    filter: FilterQuery<IMedia>,
    options?: QueryOptions
  ): Promise<ISuccessResponse | IMedia[]> {
    return await mediaRepository.find(filter, options);
  }

  async findOne(filter: FilterQuery<IMedia>): Promise<IMedia | null> {
    return await mediaRepository.findOne(filter);
  }

  async updateOne(
    filter: FilterQuery<IMedia>,
    update: UpdateQuery<IMedia>
  ): Promise<IMedia | null> {
    return await mediaRepository.updateOne(filter, update);
  }

  async deleteOne(filter: FilterQuery<IMedia>): Promise<any> {
    return await mediaRepository.deleteOne(filter);
  }
}

export default new MediaService();
