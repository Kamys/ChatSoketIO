import utils from './utils'
import model from './model'
import router from './router'
import chat from './chat'

export default {
  ...model,
  ...utils,
  router,
  chat,
}
