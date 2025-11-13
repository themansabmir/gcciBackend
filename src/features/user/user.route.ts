import { defaultRouter } from "@lib/router";
import { userController } from "./user.controller";

const userRouter = defaultRouter();

userRouter.post("/invite", userController.inviteUser);

export default userRouter;