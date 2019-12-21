import { UserRequest } from '../type'
import Chat from './model'
import utils from './utils'
import Users from '../users'
import { IChat } from './type'
import { isValidId } from 'server/utils/validation'

type ChatCreateBody = {
  memberId: string
}

const createPersonal = async (req: UserRequest<ChatCreateBody>, res) => {
  const { body, user } = req
  //TODO: Extract validation in middleware
  if (!body.memberId) {
    res.status(400).send('memberId is required field')
    return
  }
  if (!isValidId(body.memberId)) {
    res.status(400).send(`Not correct id: ${body.memberId}`)
    return
  }
  const member = await Users.getById(body.memberId)
  if (!member) {
    res.status(400).send(`Member with id ${body.memberId} not found`)
    return
  }
  const chat = Chat.createModel({ memberIds: [member._id, user.id] })
  const chatSaved = await chat.save()
  res.status(200).send(chatSaved)
}

const getChat = async (req: UserRequest<void, ChatCreateBody>, res) => {
  const { user, query } = req
  //TODO: Extract validation in middleware
  if (!query.memberId) {
    res.status(400).send('memberId is required field')
    return
  }
  if (!isValidId(query.memberId)) {
    res.status(400).send(`Not correct id: ${query.memberId}`)
    return
  }
  const member = await Users.getById(query.memberId)
  if (!member) {
    res.status(400).send(`Member with id ${query.memberId} not found`)
    return
  }
  const existingChat: IChat = await Chat.findOneByMember([req.user.id, query.memberId])
  if (existingChat) {
    res.status(200).send(utils.toView(existingChat))
    return
  }
  const chat = Chat.createModel({ memberIds: [member._id, user.id] })
  const chatSaved = await chat.save()
  res.status(200).send(utils.toView(chatSaved))
}

const myChats = async (req: UserRequest, res) => {
  const currentChat = await Chat.findByMember([req.user.id])
  res.status(200).send(currentChat)
}

export { createPersonal, myChats, getChat }
