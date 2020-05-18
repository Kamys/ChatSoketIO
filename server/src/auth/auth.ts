import UserUtils from '~/users/utils'
import { HUR } from '~/type'
import { SERVER_ERROR } from '~/domainError/constants'

const auth: HUR = (req, res, next) => {
  const tokenString = req.headers.authorization as string
  if (!tokenString) {
    res.status(401).send('Access denied. No token provided.')
    return
  }

  const token = tokenString.replace('Bearer ', '')
  try {
    req.user = UserUtils.verifyAuthToken(token)
    next()
  } catch (ex) {
    res.status(401).send(SERVER_ERROR.ACCESS_TOKEN_INVALID)
  }
}

export default auth
