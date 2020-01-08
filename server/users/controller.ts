import { RequestUser, UnAuthRequest } from '../type'
import { IUser } from './type'
import User from './model'
import utils from './utils'
import { SERVER_ERROR } from '../constants/error'
import { HTTP_STATUS } from 'server/domainError/types'

const create = async (req: UnAuthRequest<IUser>, res) => {
  const { body } = req
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  let user: IUser = await User.getByName(body.name)
  if (user) {
    res.status(400).send('User already registered.')
    return
  }

  user = User.createModel(body.name, body.password)
  user.password = await utils.toHas(user.password)
  await user.save()

  const token = utils.generateAuthToken(user)
  res.send({
    user: {
      id: user._id,
      name: user.name,
    },
    token,
  })
}

const getCurrent = async (req: RequestUser, res) => {
  const user = await User.getById(req.user.id)
  if (!user) {
    res.status(HTTP_STATUS.FORBIDDEN).send()
    return
  }
  res.send(utils.toView(user))
}

const login = async (req: RequestUser, res) => {
  const { body } = req
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  const user = await User.getByName(body.name)
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
    user: utils.toView(user),
    token,
  })
}

const getAllContacts = async (req: RequestUser, res) => {
  const allUser = await User.getAllContacts(req.user.id)
  res.send(allUser.map(utils.toView))
}

const setAvatar = async (userId: string, fileName: string) => {
  const user = await User.getById(userId)
  user.avatar = fileName
  await user.save()
}

export { create, getCurrent, login, getAllContacts, setAvatar }
