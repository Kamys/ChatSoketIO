import config from '../config'

const checkEnvironment = () => {
  if (!config.myprivatekey) {
    return 'myprivatekey is not defined.'
  }
  if (!config.PORT) {
    return 'PORT is not defined.'
  }
  return null
}

export default checkEnvironment
