import auth from '../middleware/auth'
import express from 'express'
import {
  generateAuthToken,
  getUserById,
  IUser,
  UserModel,
  validateUser,
} from '../models/user.model'
import { CustomRequest, RequestUser } from '../type'
import { checkPassword, toHas } from '../utils/password'
import { SERVER_ERROR } from '../constants/error'

const router = express.Router()

router.get('/current', auth, async (req: RequestUser, res) => {
  const user = await getUserById(req.user.id)
  res.send(user)
})

router.post('/', async (req: CustomRequest<IUser>, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  let user: IUser = await UserModel.findOne({ userName: req.body.userName })
  if (user) {
    res.status(400).send('User already registered.')
    return
  }

  user = new UserModel({
    userName: req.body.userName,
    password: req.body.password,
  })
  user.password = await toHas(user.password)
  await user.save()

  const token = generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
})

router.post('/login', async (req: RequestUser, res) => {
  const { body } = req
  const { error } = validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const user = await UserModel.findOne({ userName: body.userName })
  if (!user) {
    res.status(400).send(SERVER_ERROR.USER_NAME_NOT_FOUND)
    return
  }

  const isPasswordCorrect = await checkPassword(body.password, user.password)
  if (!isPasswordCorrect) {
    res.status(401).send(SERVER_ERROR.PASSWORD_INCORRECT)
    return
  }

  const token = generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
})

export default router
