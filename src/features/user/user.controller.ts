// src/modules/user/user.controller.ts
import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
import { UpdateUserDTO } from "./user.dto";
import { successResponse } from "@middleware/successResponse";

const userService = new UserService();

export default class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await userService.getProfile(userId);
      return successResponse({
        res,
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const data: UpdateUserDTO = req.body;
      const updatedUser = await userService.updateProfile(userId, data);

      return successResponse({
        res,
        message: "User profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
