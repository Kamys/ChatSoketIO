import express from 'express'
import { validate } from 'express-validation'
import auth from '../auth/auth'

import Users from '~/users'
import Message from '~/message'
import Chat from '~/chat'
import File from '~/file'

const router = express.Router()

// User
router.post('/users/', Users.middleware.create)
router.post('/users/login', Users.middleware.login)
router.get('/users/current', auth, Users.middleware.getCurrent)
router.get('/users/contacts', auth, Users.middleware.getAllContacts)
router.post('/users/avatar', auth, Users.middleware.handleSetAvatar)

// Message
router.get('/messages', auth, Message.middleware.handlerGetMessages)
router.post('/messages', auth, Message.middleware.handlerCreateMessages)

// Chat
router.post(
  '/chats/createPersonal',
  auth,
  validate(Chat.middleware.createPersonalValidation),
  Chat.middleware.createPersonal
)
router.get(
  '/chats/getChat',
  auth,
  validate(Chat.middleware.getChatValidation),
  Chat.middleware.getChat
)
router.get('/chats/current', auth, Chat.middleware.myChats)

// File
router.get('/file', File.middleware.handlerGetFile)

export default router
