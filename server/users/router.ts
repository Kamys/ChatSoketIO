import express from 'express'
import auth from '../middleware/auth'
import { CustomRequest } from '../type'
import { SERVER_ERROR } from '../constants/error'
import User from './model'
import utils from './utils'
import { IUser, RequestUser } from './type'

const router = express.Router()

router.post('/', async (req: CustomRequest<IUser>, res) => {
  const { error } = User.validateUser(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  let user: IUser = await User.Model.findOne({ userName: req.body.userName })
  if (user) {
    res.status(400).send('User already registered.')
    return
  }

  user = new User.Model({
    userName: req.body.userName,
    password: req.body.password,
  })
  user.password = await utils.toHas(user.password)
  await user.save()

  const token = User.generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
})

router.get('/current', auth, async (req: RequestUser, res) => {
  const user = await User.getById(req.user.id)
  res.send(user)
})

router.post('/login', async (req: RequestUser, res) => {
  const { body } = req
  const { error } = User.validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const user = await User.Model.findOne({ userName: body.userName })
  if (!user) {
    res.status(400).send(SERVER_ERROR.USER_NAME_NOT_FOUND)
    return
  }

  const isPasswordCorrect = await utils.checkPassword(
    body.password,
    user.password
  )
  if (!isPasswordCorrect) {
    res.status(401).send(SERVER_ERROR.PASSWORD_INCORRECT)
    return
  }

  const token = User.generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
})

export default router
