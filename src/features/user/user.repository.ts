    import { BaseRepository } from "../base.repository";
    import { IUser } from "./user.types";
    import { Model } from 'mongoose';

    export class UserRepository extends BaseRepository<IUser> {
    constructor(model: Model<IUser>) {
        super(model);
    }
    }