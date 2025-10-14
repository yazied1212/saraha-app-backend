import jwt from "jsonwebtoken";

export const verifyToken = (token, key = process.env.TOKEN_KEY) => {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    return { error };
  }
};
