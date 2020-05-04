import express, { Router } from 'express'
import auth from '../middleware/auth'
import { validate } from 'express-validation'
import {
  createPersonal,
  getChat,
  myChats,
  createPersonalValidation,
  getChatValidation,
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
