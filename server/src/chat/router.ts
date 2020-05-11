import express, { Router } from 'express'
import { validate } from 'express-validation'

import auth from '../middleware/auth'

import {
  createPersonal,
  createPersonalValidation,
  getChat,
  getChatValidation,
  myChats,
} from './controller'

const router: Router = express.Router()

router.post(
  '/createPersonal',
  auth,
  validate(createPersonalValidation),
  createPersonal
)

router.get('/getChat', auth, validate(getChatValidation), getChat)

router.get('/current', auth, myChats)

export default router
