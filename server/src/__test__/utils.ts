import User from '../users'
import utils from '../users/utils'

export const createUser = async (name = 'Jack', password = '123') => {
  const user = await User.createModel(name, password)
  await user.save()
  const token = utils.generateAuthToken({ id: user.id, name })

  return { id: user.id, name, password, token }
}
