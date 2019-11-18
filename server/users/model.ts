import mongoose from 'mongoose'
import { IUser } from './type'

const UserSchema = new mongoose.Schema({
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
})

const Model = mongoose.model<IUser>('User', UserSchema)

const createModel = (name: string, password: string) => {
  return new Model({
    name,
    password,
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
