import { defaultRouter } from "@lib/router";
import { permissionCheck, routeProtector } from "@middleware/routeProtector";
import { validateDTO } from "@middleware/validateDTO";
import { authController } from "./auth.controller";
import { loginschema, SignupSchema, updatePasswordSchema } from "./auth.dto";

const authRouter = defaultRouter()


authRouter.post("/login", validateDTO(loginschema), authController.login)
authRouter.post('/sign-up', routeProtector, permissionCheck("employee_create"), validateDTO(SignupSchema), authController.signup);
authRouter.put("/update-password/:id", routeProtector, validateDTO(updatePasswordSchema), authController.updatePassword)
export default authRouter;