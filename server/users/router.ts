import express from 'express'
import auth from '../middleware/auth'
import { create, getCurrent, login, getAllContacts } from './controller'

const router = express.Router()

router.post('/', create)

router.post('/login', login)

router.get('/current', auth, getCurrent)

router.get('/contacts', auth, getAllContacts)

export default router
