import jwt from "jsonwebtoken";

export const signToken = ({
  payload,
  key = process.env.TOKEN_KEY,
  option = {},
}) => {
  return jwt.sign(payload, key, option);
};
