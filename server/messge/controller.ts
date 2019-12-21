import { UserRequest } from '../type'
import Message from './model'
import Chat from '../chats'
import utils from './utils'
import { isValidId } from 'server/utils/validation'

type GetMessagesQuery = {
  chatId: string
}

const getMessages = async (req: UserRequest<void, GetMessagesQuery>, res) => {
  const { user } = req
  const { chatId } = req.query
  if (!isValidId(chatId)) {
    res.status(400).send(`Not correct id: ${chatId}`)
    return
  }
  const chat = await Chat.findById(chatId)
  if (!chat) {
    res.status(400).send(`Chat not found id: ${chatId}`)
    return
  }
  if (!chat.memberIds.includes(user.id)) {
    res.status(403).send(`You not chat member: ${chatId}`)
    return
  }
  const messages = await Message.findByChatId(chat._id)
  res.status(200).send(messages)
}

type CreateMessagesBody = {
  chatId: string
  text: string
}

const createMessages = async (req: UserRequest<CreateMessagesBody>, res) => {
  const { user } = req
  const { chatId, text } = req.body
  const chat = await Chat.findById(chatId)
  if (!isValidId(chatId)) {
    res.status(400).send(`Not correct id: ${chatId}`)
    return
  }
  if (!chat) {
    res.status(400).send(`Chat not found id: ${chatId}`)
    return
  }
  if (!chat.memberIds.includes(user.id)) {
    res.status(403).send(`You not chat member: ${chatId}`)
    return
  }
  const message = await Message.createModel({
    chatId: chat._id,
    creatorId: user.id,
    text,
    createDate: new Date().toString(),
  })
  await message.save()
  res.status(200).send(utils.toView(message))
}

export { getMessages, createMessages }
