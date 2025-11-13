import { BaseRepository } from "../base.repository";
import { ICustomer } from "./customer.types";
import { Model } from 'mongoose';

export class CustomerRepository extends BaseRepository<ICustomer> {
  constructor(model: Model<ICustomer>) {
    super(model);
  }
}