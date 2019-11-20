import mongoose, { Schema } from 'mongoose'
import { IChat } from './type'

const ChatSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  memberIds: [Schema.Types.ObjectId],
})

const Model = mongoose.model<IChat>('Chat', ChatSchema)

const createModel = (props: { name?: string; memberIds?: string[] }) => {
  return new Model(props)
}

const findById = async (id: string) => {
  return Model.findById(id)
}

const findByMember = async (memberIds: string[]) => {
  return Model.find({ memberIds: { $all: memberIds } })
}

export default {
  createModel,
  findByMember,
  findById,
}
