import { SERVER_ERROR } from '~/constants/error'
import UserUtils from '~/users/utils'
import { HUR } from '~/type'

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
