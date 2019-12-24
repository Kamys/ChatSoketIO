import express from 'express'
import auth from '../middleware/auth'
import Controller from './controller'
import { UserRequest } from 'server/type'

const router = express.Router()

type GetMessagesQuery = {
  chatId: string
}

type CreateMessagesBody = {
  chatId: string
  text: string
}

const handlerGetMessages = async (req: UserRequest<void, GetMessagesQuery>, res, next) => {
  try {
    const { user } = req
    const { chatId } = req.query

    const messages = await Controller.getMessages(user, chatId)
    res.status(200).send(messages)
  } catch (e) {
    next(e)
  }
}

const handlerCreateMessages = async (req: UserRequest<CreateMessagesBody>, res, next) => {
  try {
    const { user } = req
    const { chatId, text } = req.body

    const message = await Controller.createMessages(user, chatId, text)
    res.status(200).send(message)
  } catch (e) {
    next(e)
  }
}

router.get('/', auth, handlerGetMessages)
router.post('/', auth, handlerCreateMessages)

export default router
