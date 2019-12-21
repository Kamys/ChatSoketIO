import express from 'express'
import auth from '../middleware/auth'
import { getMessages, createMessages } from './controller'

const router = express.Router()

router.get('/', auth, getMessages)

router.post('/', auth, createMessages)

export default router
