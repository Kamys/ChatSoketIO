import { HUR } from 'server/src/type'
import RequestValidation from 'server/src/utils/RequestValidation'

import Users from '../users'

import Chat from './model'
import { IChat } from './type'
import utils from './utils'

type ChatCreateBody = {
  memberId?: string
}

const createPersonalValidation = {
  body: RequestValidation.object({
    memberId: RequestValidation.id().required(),
  })
}

const createPersonal: HUR<ChatCreateBody> = async (req, res) => {
  const { body, user } = req
  const member = await Users.getById(body.memberId)
  if (!member) {
    res.status(400).send(`Member with id ${body.memberId} not found`)
    return
  }
  const chat = Chat.createModel({ memberIds: [member._id, user.id] })
  const chatSaved = await chat.save()
  res.status(200).send(chatSaved)
}

const getChatValidation = {
  query: RequestValidation.object({
    memberId: RequestValidation.id().required(),
  })
}

const getChat: HUR<void, ChatCreateBody> = async (req, res) => {
  const { user, query } = req
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

const myChats: HUR = async (req, res) => {
  const currentChat = await Chat.findByMember([req.user.id])
  res.status(200).send(currentChat)
}

export default { createPersonal, myChats, getChat, createPersonalValidation, getChatValidation }