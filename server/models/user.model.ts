import config from '../config'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import mongoose, { Document } from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  isAdmin: Boolean,
})

export interface IUser extends Document {
  name: string
  email: string
  password: string
  isAdmin: boolean
}

export const UserModel = mongoose.model<IUser>('User', UserSchema)

export const validateUser = user => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required(),
  }

  return Joi.validate(user, schema)
}

export const generateAuthToken = user => {
  return jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.myprivatekey)
}
