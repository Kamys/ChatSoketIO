import express from 'express'
import auth from '../middleware/auth'
import { create, getCurrent, login } from './controller'

const router = express.Router()

router.post('/', create)

router.post('/login', login)

router.get('/current', auth, getCurrent)

export default router
