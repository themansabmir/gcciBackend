import { Document, FilterQuery, Model, Query, UpdateQuery, QueryOptions, PipelineStage } from 'mongoose';
import { IQuery } from './vendor/vendor.types';
import { sanitizeInput, isValidFieldName, sanitizePagination, sanitizeSortParams } from '@lib/security';

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  /** Return mongoose query so you can chain sort, populate, limit etc. */
  find(filter: FilterQuery<T> = {}): Query<T[], T> {
    return this.model.find(filter);
  }

  findOne(filter: FilterQuery<T>): Query<T | null, T> {
    return this.model.findOne(filter);
  }

  findById(id: string): Query<T | null, T> {
    return this.model.findById(id);
  }

  create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  createMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.create(data);
  }

  updateById(id: string, update: UpdateQuery<T>, options: QueryOptions = { new: true }): Query<T | null, T> {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  updateOneByQuery(query: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions = { new: true }) {
    return this.model.findOneAndUpdate(query, update, options);
  }

  deleteById(id: string): Query<T | null, T> {
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(filter: FilterQuery<T>): Query<{ deletedCount?: number }, T> {
    return this.model.deleteMany(filter);
  }

  count(filter: FilterQuery<T> = {}): Query<number, T> {
    return this.model.countDocuments(filter);
  }

  aggregate<R = any>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate(pipeline).exec();
  }

  buildSearchQuery(query: IQuery, searchableFields: string[]) {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = query;

    // Sanitize pagination using centralized utility
    const { skip, limit: sanitizedLimit } = sanitizePagination(page, limit);

    const filter: any = {};
    
    // Sanitize search input to prevent NoSQL injection
    if (search && searchableFields.length > 0) {
      const sanitizedSearch = sanitizeInput(search);
      filter.$or = searchableFields.map((field) => {
        // Validate field names to prevent field injection
        if (!isValidFieldName(field)) {
          throw new Error(`Invalid field name: ${field}`);
        }
        return {
          [field]: { $regex: sanitizedSearch, $options: 'i' },
        };
      });
    }

    // Sanitize sort parameters using centralized utility
    const sort = sanitizeSortParams(sortBy, sortOrder, searchableFields);

    return {
      filter,
      skip,
      limit: sanitizedLimit,
      sort,
    };
  }
}
