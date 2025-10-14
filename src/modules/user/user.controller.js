import { Router } from "express";
import { deactivate, getProfile } from "./user.service.js";
import { isAuthenticate } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/errors/async-handler.js";

const router = Router();
router.get("/profile", isAuthenticate, asyncHandler(getProfile));
router.delete("/deactivate", isAuthenticate, asyncHandler(deactivate));

export default router;
