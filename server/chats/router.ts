import express from 'express'
import auth from '../middleware/auth'
import { createPersonal, myChats } from './controller'

const router = express.Router()

router.post('/createPersonal', auth, createPersonal)

router.get('/current', auth, myChats)

export default router
