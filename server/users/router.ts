import express from 'express'
import auth from '../middleware/auth'
import { create, getCurrent, login, getAllContacts, setAvatar } from './controller'
import { UserRequest } from 'server/type'
import ControllerFile from 'server/file/controller'

const router = express.Router()

const handleSetAvatar = async (req: UserRequest, res, next) => {
  try {
    const { user } = req
    const fileName = await ControllerFile.saveFile(req.files.avatar)
    await setAvatar(user.id, fileName)
    res.status(200).send(fileName)
  } catch (e) {
    next(e)
  }
}

router.post('/', create)
router.post('/login', login)
router.get('/current', auth, getCurrent)
router.get('/contacts', auth, getAllContacts)
router.post('/avatar', auth, handleSetAvatar)


export default router
