import { isConnected } from "./db/connect.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import messageRouter from "./modules/message/message.controller.js";
import { notFound } from "./utils/errors/not-found.js";
import { errorHandler } from "./utils/errors/error-handle.js";

export const bootStrap = async (app, express) => {
  //parse
  app.use(express.json());

  //connect db
  await isConnected();

  //routers
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/messages", messageRouter);

  //handle wrong reqs
  app.all("*", notFound);

  //error handling
  app.use(errorHandler);
};
