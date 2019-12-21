import express from 'express'
import auth from '../middleware/auth'
import { getMessages, createMessages } from './controller'
import { UserRequest } from 'server/type'

const router = express.Router()

type GetMessagesQuery = {
  chatId: string
}

type CreateMessagesBody = {
  chatId: string
  text: string
}

const handlerGetMessages = async (req: UserRequest<void, GetMessagesQuery>, res) => {
  const { user } = req
  const { chatId } = req.query

  const messages = await getMessages(user, chatId)
  res.status(200).send(messages)
}

const handlerCreateMessages = async (req: UserRequest<CreateMessagesBody>, res) => {
  const { user } = req
  const { chatId, text } = req.body

  const message = await createMessages(user, chatId, text)
  res.status(200).send(message)
}

router.get('/', auth, handlerGetMessages)
router.post('/', auth, handlerCreateMessages)

export default router
