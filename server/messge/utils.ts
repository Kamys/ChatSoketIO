import { IMessage, IViewMessages } from './type'

const toView = (message: IMessage): IViewMessages => {
  return {
    id: message._id,
    chatId: message.chatId,
    creatorId: message.creatorId,
    text: message.text,
    createDate: message.createDate,
  }
}

export default {
  toView,
}
