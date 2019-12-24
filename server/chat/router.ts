import express from 'express'
import auth from '../middleware/auth'
import { createPersonal, getChat, myChats } from './controller'

const router = express.Router()

router.post('/createPersonal', auth, createPersonal)

router.get('/getChat', auth, getChat)

router.get('/current', auth, myChats)

export default router
