import joi from "joi";
import { GENDERS } from "../../common/constants/gender.js";

//register
export const registerSchema = joi
  .object({
    userName: joi.string().min(2).max(25).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    phoneNumber: joi
      .string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
    gender: joi
      .string()
      .valid(...Object.values(GENDERS))
      .required(),
  })
  .required();

//login
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();
