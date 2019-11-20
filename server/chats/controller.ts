import { UserRequest } from '../type'
import Chat from './model'

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
  const chat = Chat.createModel({ memberIds: [body.memberId, user.id] })
  await chat.save()
}

const myChats = async (req: UserRequest, res) => {
  const currentChat = Chat.findByMember([req.user.id])
  res.status(200).send(currentChat)
}

export { createPersonal, myChats }
