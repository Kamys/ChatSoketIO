import { CustomRequest } from '../type'
import { IUser, RequestUser } from './type'
import User from './model'
import utils from './utils'
import { SERVER_ERROR } from '../constants/error'

const create = async (req: CustomRequest<IUser>, res) => {
  const { body } = req
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  let user: IUser = await User.getByUserName(body.userName)
  if (user) {
    res.status(400).send('User already registered.')
    return
  }

  user = User.createModel(body.userName, body.password)
  user.password = await utils.toHas(user.password)
  await user.save()

  const token = utils.generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
}

const getCurrent = async (req: RequestUser, res) => {
  const user = await User.getById(req.user.id)
  res.send(user)
}

const login = async (req: RequestUser, res) => {
  const { body } = req
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  const user = await User.getByUserName(body.userName)
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

  const token = utils.generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      userName: user.userName,
    },
    token,
  })
}

export { create, getCurrent, login }
