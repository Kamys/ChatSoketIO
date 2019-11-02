import auth from '../middleware/auth'
import bcrypt from 'bcrypt'
import express from 'express'
import {
  UserModel,
  validateUser,
  generateAuthToken,
  IUser,
} from '../models/user.model'
import { CustomRequest, RequestUser } from '../type'

const router = express.Router()

router.get('/current', auth, async (req: RequestUser, res) => {
  const user = await UserModel.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async (req: CustomRequest<IUser>, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  let user = await UserModel.findOne({ email: req.body.email })
  if (user) {
    res.status(400).send('User already registered.')
    return
  }

  user = new UserModel({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  })
  user.password = await bcrypt.hash(user.password, 10)
  await user.save()

  const token = generateAuthToken(user)
  res.header('x-access-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  })
})

export default router
