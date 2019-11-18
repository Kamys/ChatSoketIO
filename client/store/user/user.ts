import { createEffect, createStore } from 'effector'
import { axiosInstance, initToken } from '../../api'
import { removeToken } from '../../api/utils'

export interface IUserLoginForm {
  name: string
  password: string
}

export interface ILoginResponse {
  user: {
    id: string
    name: string
  }
  token: string
}

export interface IUser {
  id: string
  name: string
}

const createUser = createEffect<IUserLoginForm, ILoginResponse, void>(
  'createUser',
  {
    handler: user => {
      return axiosInstance.post('users', user).then(response => response.data)
    },
  }
)

const login = createEffect<IUserLoginForm, ILoginResponse, void>('login', {
  handler: user => {
    return axiosInstance
      .post('users/login', user)
      .then(response => response.data)
  },
})

const logout = createEffect<void, void, void>('logout', {
  handler: () => {
    removeToken()
  },
})

const fetchAccount = createEffect<void, IUser, void>('fetchAccount', {
  handler: () => {
    return axiosInstance.get('users/current').then(response => response.data)
  },
})

login.done.watch(({ result }) => {
  initToken(result.token)
})

createUser.done.watch(({ result: { token } }) => {
  initToken(token)
})

fetchAccount.fail.watch(() => {
  return logout()
})

const storeAccount = createStore<IUser>(null)
  .on(login.done, (_, action) => action.result.user)
  .on(createUser.done, (_, action) => action.result.user)
  .on(fetchAccount.done, (_, action) => action.result)
  .on(logout.done, () => null)

export default {
  storeAccount,
  login,
  logout,
  createUser,
  fetchAccount,
}
