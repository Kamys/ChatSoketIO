import { IMessage, IViewMessage } from './type'

const toView = (message: IMessage): IViewMessage => {
  return {
    id: message._id,
    chatId: message.chatId,
    creatorId: message.creatorId,
    text: message.text,
    createDate: message.createDate,
    creatorName: message.creatorName
  }
}

export default {
  toView,
}
