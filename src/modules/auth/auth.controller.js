import { Router } from "express";
import { activateAccount, login, register } from "./auth.service.js";
import { asyncHandler } from "../../utils/errors/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = Router();
router.post("/register", isValid(registerSchema), asyncHandler(register));
router.post("/login", isValid(loginSchema), asyncHandler(login));
router.get("/activate-account/:token", asyncHandler(activateAccount));

export default router;
