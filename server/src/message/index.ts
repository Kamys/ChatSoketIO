import router from './router'
import utils from './utils'
import model from './model'
import controller from './controller'

export default {
  ...model,
  controller,
  router,
  utils,
}
