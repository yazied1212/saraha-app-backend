import { Router } from "express";
import { isValid } from "../../middlewares/validation.middleware.js";
import { deleteSchema, sendSchema } from "./message.validation.js";
import { asyncHandler } from "../../utils/errors/async-handler.js";
import { deleteMessage, getMessages, sendMessage } from "./message.service.js";
import { isAuthenticate } from "../../middlewares/auth.middleware.js";

const router = Router();
router.post("/send-message", isValid(sendSchema), asyncHandler(sendMessage));
router.get("/", isAuthenticate, asyncHandler(getMessages));
router.delete(
  "/:id",
  isAuthenticate,
  isValid(deleteSchema),
  asyncHandler(deleteMessage),
);

export default router;
