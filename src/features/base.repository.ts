import {
  Document,
  FilterQuery,
  Model,
  Query,
  UpdateQuery,
  QueryOptions,
  PipelineStage,
} from "mongoose";

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

  updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Query<T | null, T> {
    return this.model.findByIdAndUpdate(id, update, options);
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
}
