import { Users } from "../../db/models/user.model.js";
import { decrypt } from "../../utils/crypto/decrypt.js";

//fet profile
export const getProfile = async (req, res, next) => {
  const userExists = req.authUser;
  userExists.phoneNumber = decrypt(userExists.phoneNumber);
  return res.status(200).json({
    success: true,
    data: userExists,
  });
};

//deactivate
export const deactivate = async (req, res, next) => {
  const userExists = req.authUser;
  const up = await Users.updateOne(
    { _id: userExists._id },
    { isDeleted: true, deletedAt: Date.now() },
  );
  return res.status(200).json({
    success: true,
    message: "account deactivated successfully",
  });
};
