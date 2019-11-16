import jwt from 'jsonwebtoken'
import Joi from 'joi'
import mongoose from 'mongoose'
import { IUser, IUserJWTPayload } from './type'
import config from '../config'

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
  connectCount: Number,
})

const Model = mongoose.model<IUser>('User', UserSchema)

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

const getById = async (userId: string): Promise<IUser> => {
  return Model.findById(userId).select('-password')
}

const incrementConnect = async (userId: string): Promise<void> => {
  return Model.updateOne({ _id: userId }, { $inc: { connectCount: 1 } }).exec()
}

const decrementConnect = async (userId: string): Promise<void> => {
  return Model.updateOne({ _id: userId }, { $inc: { connectCount: -1 } }).exec()
}

export const hasConnect = async (userId: string): Promise<boolean> => {
  const user = await Model.findById(userId, 'connectCount').exec()
  return user.connectCount > 0
}

export default {
  Model: Model,
  validateUser,
  generateAuthToken,
  verifyAuthToken,
  getById,
  incrementConnect,
  decrementConnect,
  hasConnect,
}
