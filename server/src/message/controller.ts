import { isValidId } from '../utils/validation'
import { DomainError } from 'server/src/domainError'
import { IViewMessage } from 'server/src/message/type'
import { IUserJWTPayload } from 'server/src/users/type'
import { IChat } from 'server/src/chat/type'
import Message from './model'
import Chat from '../chat'
import utils from './utils'

const isChatMember = (chat: IChat, userId: string): boolean => {
  return chat.memberIds.includes(userId)
}

const getMessages = async (user: IUserJWTPayload, chatId: string): Promise<IViewMessage[]> => {
  if (!isValidId(chatId)) {
    throw DomainError.invalidObjectId({ argumentName: 'chatId' })
  }
  const chat = await Chat.findById(chatId)
  if (!chat) {
    throw DomainError.notFoundEntity({
      entityName: 'Chat',
      searchParams: { chatId },
    })
  }
  if (!isChatMember(chat, user.id)) {
    throw DomainError.forbidden({
      whoTried: user.name,
      protectedEntityName: 'Chat',
      reason: 'You not chat member',
    })
  }
  const messages = await Message.findByChatId(chat._id)
  return messages.map(utils.toView)
}

const createMessages = async (user: IUserJWTPayload, chatId: string, text: string): Promise<IViewMessage> => {
  const chat = await Chat.findById(chatId)
  if (!isValidId(chatId)) {
    throw DomainError.invalidObjectId({ argumentName: 'chatId' })
  }
  if (!chat) {
    throw DomainError.notFoundEntity({
      entityName: 'Chat',
      searchParams: { chatId },
    })
  }
  if (!isChatMember(chat, user.id)) {
    throw DomainError.forbidden({
      whoTried: user.name,
      protectedEntityName: 'Chat',
      reason: 'You not chat member',
    })
  }
  const message = await Message.createModel({
    chatId: chat._id,
    creatorId: user.id,
    creatorName: user.name,
    text,
    createDate: new Date().toString(),
  })
  await message.save()
  return utils.toView(message)
}

export default { getMessages, createMessages }
