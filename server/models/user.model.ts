import config from '../config'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import mongoose, { Document } from 'mongoose'

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
})

export interface IUser extends Document {
  userName: string
  password: string
}

export interface IUserJWTPayload {
  id: string
  userName: string
}

export const UserModel = mongoose.model<IUser>('User', UserSchema)

export const validateUser = user => {
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

export const generateAuthToken = user => {
  const userPayload: IUserJWTPayload = { id: user._id, userName: user.userName }
  return jwt.sign(userPayload, config.myprivatekey)
}

/**
 * @throws Error if token not verify
 */
export const verifyAuthToken = (token: string): IUserJWTPayload => {
  return jwt.verify(token, config.myprivatekey) as IUserJWTPayload
}
