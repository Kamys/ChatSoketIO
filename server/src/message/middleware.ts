import { RequestUser } from 'server/src/type'

import Controller from './controller'

type GetMessagesQuery = {
  chatId: string
}

type CreateMessagesBody = {
  chatId: string
  text: string
}

const handlerGetMessages = async (req: RequestUser<void, GetMessagesQuery>, res, next) => {
  try {
    const { user } = req
    const { chatId } = req.query

    const messages = await Controller.getMessages(user, chatId)
    res.status(200).send(messages)
  } catch (e) {
    next(e)
  }
}

const handlerCreateMessages = async (req: RequestUser<CreateMessagesBody>, res, next) => {
  try {
    const { user } = req
    const { chatId, text } = req.body

    const message = await Controller.createMessages(user, chatId, text)
    res.status(200).send(message)
  } catch (e) {
    next(e)
  }
}



export default {
  handlerCreateMessages,
  handlerGetMessages,
}
