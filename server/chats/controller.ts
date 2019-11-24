import { UserRequest } from '../type'
import Chat from './model'
import Users from '../users'
import mongoose from 'mongoose'

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
  if (!mongoose.Types.ObjectId.isValid(body.memberId)) {
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

const myChats = async (req: UserRequest, res) => {
  const currentChat = await Chat.findByMember([req.user.id])
  res.status(200).send(currentChat)
}

export { createPersonal, myChats }
