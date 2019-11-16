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
  connectCount: Number,
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
  return Model.findById({ userName })
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
  createModel,
  getById,
  getByUserName,
  hasConnect,
  incrementConnect,
  decrementConnect,
}
