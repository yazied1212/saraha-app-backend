import { Users } from "../../db/models/user.model.js";
import {
  compare,
  encrypt,
  hashSync,
  sendEmail,
  signToken,
  verifyToken,
  messages,
} from "../../utils/index.js";

//register
export const register = async (req, res, next) => {
  //destruct req.body
  const { email, password, userName, phoneNumber, gender } = req.body;

  //create user
  const createdUser = await Users.create({
    email,
    password: hashSync(password, 12),
    userName,
    phoneNumber: encrypt(phoneNumber),
    gender,
  });

  // activate account
  const token = signToken({
    payload: { id: createdUser._id },
    key: process.env.TOKEN_KEY,
    option: { expiresIn: "1m" },
  });
  const link = `http://localhost:3000/auth/activate-account/${token}`;
  const isSent = sendEmail({
    to: email,
    subject: "activate your account",
    html: `<p>to activate your account please click <a href=${link}>here</a></p>`,
  });
  if (!isSent) {
    return next(
      new Error("fail to send email please try again", { cause: 500 }),
    );
  }

  //send res
  return res.status(201).json({
    success: true,
    message: messages.user.createdSuccessfully,
    user: createdUser,
  });
};

//login
export const login = async (req, res, next) => {
  //destruct email and password and check if email exists
  const { email, password } = req.body;
  const isExists = await Users.findOne({ email: email });

  //checks if email is valid
  if (!isExists) {
    return next(new Error(messages.user.invalidEorP, { cause: 401 }));
  }

  //compare the pass and check if it is valid
  const match = compare(password, isExists.password);
  if (!match) {
    return next(new Error(messages.user.invalidEorP, { cause: 401 }));
  }

  //check if account is activated and create token
  if (isExists.isConfirmed === false) {
    return next(new Error("please activate your account", { cause: 400 }));
  }
  const token = signToken({
    payload: { id: isExists._id },
    key: process.env.TOKEN_KEY,
    option: { expiresIn: "1y" },
  });

  //reactivate account
  if (isExists.isDeleted === true) {
    await Users.updateOne({ _id: isExists._id }, { isDeleted: false });
  }

  //send res
  return res.status(200).json({
    success: true,
    message: "login successfully",
    token,
  });
};

//activate account
export const activateAccount = async (req, res, next) => {
  //destruct token and id
  const token = req.params.token;
  const { id, error } = verifyToken(token, process.env.TOKEN_KEY);
  if (error) {
    return next(new Error(error.message));
  }

  //find the user and update is confirmed
  const user = await Users.findByIdAndUpdate(id, { isConfirmed: true });
  if (!user) {
    return next(new Error(messages.user.notfound, { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    message: "account activated",
  });
};
