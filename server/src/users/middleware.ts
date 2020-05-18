import { HTTP_STATUS } from 'server/src/domainError/types'
import { RequestFiles, RequestUser, UnAuthRequest } from '~/type'

import User from './model'
import { IUser } from './type'
import utils from './utils'
import ControllerFile from '~/file/controller'
import { DomainError } from '~/domainError'
import { SERVER_ERROR } from '~/domainError/constants'

const create = async (req: UnAuthRequest<IUser>, res, next) => {
  const { body } = req
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      path: error.details[0].path,
      error: error.details[0].message,
    })
    return
  }

  const existUser: IUser = await User.getByName(body.name)
  if (existUser) {
    const error = DomainError.alreadyExist({
      modelName: 'User',
    })
    next(error)
    return
  }

  const user = await User.createModel(body.name, body.password)
  await user.save()

  const token = utils.generateAuthToken({ id: user._id, name: user.name })
  res.send({
    id: user._id,
    name: user.name,
    token,
  })
}

const getCurrent = async (req: RequestUser, res) => {
  const user = await User.getById(req.user.id)
  res.send(utils.toView(user))
}

type UserLoginBody = {
  name: string
  password: string
}

const login = async (req: RequestUser<UserLoginBody>, res) => {
  const { body } = req
  // TODO: Out this validation
  const { error } = utils.validateUser(body)
  if (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      error: error.details[0].message,
      path: error.details[0].path
    })
    return
  }
  const user = await User.getByName(body.name)
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).send({
      error: SERVER_ERROR.USER_NAME_NOT_FOUND
    })
    return
  }

  const isPasswordCorrect = await utils.checkPassword(
    body.password,
    user.password
  )
  if (!isPasswordCorrect) {
    res.status(HTTP_STATUS.UNAUTHORIZED).send(SERVER_ERROR.PASSWORD_INCORRECT)
    return
  }

  const token = utils.generateAuthToken({ id: user._id, name: user.name })
  res.send({
    ...utils.toView(user),
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

const handleSetAvatar = async (req: RequestFiles, res, next) => {
  try {
    const { user } = req
    const fileName = await ControllerFile.saveFile(req.files.avatar)
    await setAvatar(user.id, fileName)
    res.status(200).send(fileName)
  } catch (e) {
    next(e)
  }
}

export default { create, getCurrent, login, getAllContacts, handleSetAvatar }
