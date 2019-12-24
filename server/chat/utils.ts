import { IChat, IViewChat } from './type'

const toView = (chat: IChat): IViewChat => {
  return {
    id: chat._id,
    memberIds: chat.memberIds,
  }
}

export default {
  toView,
}
