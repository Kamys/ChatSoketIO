import mongoose, { Schema } from 'mongoose'
import { IUser } from './type'
import utils from '~/users/utils'

const UserSchema = new Schema({
  name: {
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
  avatar: String,
})

const Model = mongoose.model<IUser>('User', UserSchema)

const createModel = async (name: string, password: string) => {
  const hasPassword = await utils.toHas(password)
  return new Model({
    name,
    password: hasPassword,
  })
}

const getById = async (userId: string): Promise<Omit<IUser, 'password'>> => {
  return Model.findById(userId).select('-password')
}

const getByName = async (name: string): Promise<IUser> => {
  return Model.findOne({ name })
}

const getAllContacts = async (userId: string) => {
  return Model.find({ _id: { $nin: userId } })
}

export default {
  createModel,
  getById,
  getByName,
  getAllContacts,
}
