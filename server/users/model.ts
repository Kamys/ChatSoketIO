import mongoose from 'mongoose'
import { IUser } from './type'

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

const Model = mongoose.model<IUser>('User', UserSchema)

const createModel = (userName: string, password: string) => {
  return new Model({
    userName,
    password,
  })
}

const getById = async (userId: string): Promise<Omit<IUser, 'password'>> => {
  return Model.findById(userId).select('-password')
}

const getByUserName = async (userName: string): Promise<IUser> => {
  return Model.findOne({ userName })
}

export default {
  createModel,
  getById,
  getByUserName,
}
