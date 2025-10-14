import { Users } from "../db/models/user.model.js";
import { messages, verifyToken } from "../utils/index.js";

export const isAuthenticate = async (req, res, next) => {
  try {
    //destruct token from header
    const { authorization } = req.headers;
    if (!authorization.startsWith("dash")) {
      return next(new Error("invalid barer key", { cause: 400 }));
    }
    const token = authorization.split(" ")[1];

    //destruct id and iat from token
    const { id, iat } = verifyToken(token, process.env.TOKEN_KEY);

    //checks if user exists
    const userExists = await Users.findById(id, { password: 0 });
    if (!userExists) {
      return next(new Error(messages.user.notfound, { cause: 404 }));
    }

    //check if it is deactivated
    if (userExists.isDeleted === true) {
      return next(
        new Error("account is deactivated please login first", { cause: 400 }),
      );
    }
    //destroy token
    if (userExists.deletedAt && userExists.deletedAt.getTime() > iat * 1000) {
      return next(new Error("token is destroyed", { cause: 400 }));
    }

    //send the user to req
    req.authUser = userExists;
    next();
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }));
  }
};
