import mongoose, { Schema } from 'mongoose'
import { IMessage } from './type'

const ChatSchema = new Schema({
  creatorId: Schema.Types.ObjectId,
  creatorName: Schema.Types.String,
  chatId: Schema.Types.ObjectId,
  text: String,
  createDate: Schema.Types.Date,
  memberIds: [Schema.Types.ObjectId],
})

const Model = mongoose.model<IMessage>('Message', ChatSchema)

type createModelProps = {
  chatId?: string
  creatorId: string
  text: string
  createDate: string
  creatorName: string
}

const createModel = (props: createModelProps) => {
  return new Model(props)
}

const findById = async (id: string): Promise<IMessage> => {
  return Model.findById(id)
}

const findByChatId = async (chatId: string): Promise<IMessage[]> => {
  return Model.find({ chatId })
}

export default {
  createModel,
  findById,
  findByChatId,
}
