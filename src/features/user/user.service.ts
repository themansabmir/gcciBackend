import { UserModel } from "./user.entity";
import { UpdateUserDTO, UserResponseDTO } from "./user.dto";
import { IUser } from "./user.types";

export default class UserService {
  async getProfile(userId: string): Promise<UserResponseDTO> {
    const user = (await UserModel.findById(userId)
      .select("-password")
      .lean()
      .exec()) as IUser | null;

    if (!user) throw new Error("User not found");

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(String),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const updatedUser = (await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    )
      .select("-password")
      .lean()
      .exec()) as IUser | null;

    if (!updatedUser) throw new Error("User not found");

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      permissions: updatedUser.permissions.map(String),
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
