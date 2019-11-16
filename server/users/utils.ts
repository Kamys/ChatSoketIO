import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUserJWTPayload } from './type'
import config from '../config'

export const toHas = async (password: string): Promise<string> => {
  return bcrypt.hash(password.toString(), 10)
}

export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash)

const validateUser = user => {
  const schema = {
    userName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),
  }

  return Joi.validate(user, schema)
}

const generateAuthToken = user => {
  const userPayload: IUserJWTPayload = { id: user._id, userName: user.userName }
  return jwt.sign(userPayload, config.myprivatekey)
}

/**
 * @throws Error if token not verify
 */
const verifyAuthToken = (token: string): IUserJWTPayload => {
  return jwt.verify(token, config.myprivatekey) as IUserJWTPayload
}

export default {
  toHas,
  checkPassword,
  validateUser,
  generateAuthToken,
  verifyAuthToken,
}
