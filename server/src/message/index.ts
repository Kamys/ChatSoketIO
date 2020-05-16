import middleware from './middleware'
import utils from './utils'
import model from './model'
import controller from './controller'

export default {
  ...model,
  controller,
  middleware,
  utils,
}
