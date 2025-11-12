import { UserModel, IUser } from './user.entity';
import BcryptService from '@lib/bcrypt';
import { Types } from 'mongoose';

export default class UserService {
  private bcryptService: BcryptService;

  constructor(bcryptService: BcryptService) {
    this.bcryptService = bcryptService;
  }

  // Create a new user
  async create(data: { name: string; email: string; password: string; role?: 'admin' | 'user' }): Promise<IUser> {
    const hashed = await this.bcryptService.hash(data.password);
    const user = new UserModel({
      ...data,
      password: hashed,
    });
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return await UserModel.findById(id).exec();
  }

  async updatePassword(id: string | Types.ObjectId, hashedPassword: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
  }
}
