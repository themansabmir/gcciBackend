// src/modules/user/user.route.ts
import { Router } from "express";
import UserController from "./user.controller";
import { validateToken } from "@middleware/routeProtector";
import { validateDTO } from "@middleware/validateDTO";
import { UpdateUserSchema } from "./user.dto";

const router = Router();
const userController = new UserController();

// ✅ View user profile
router.get("/profile", validateToken, (req, res, next) => {
  void userController.getProfile(req, res, next);
});


// ✅ Update user profile
router.patch(
  "/profile",
  validateToken,
  validateDTO(UpdateUserSchema),
  (req, res, next) => {
    void userController.updateProfile(req, res, next);
  }
);

export default router;
