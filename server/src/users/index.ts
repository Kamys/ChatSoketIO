import utils from './utils'
import model from './model'
import chat from './chat'
import middleware from './middleware'

export default {
  ...model,
  middleware,
  utils,
  chat,
}
