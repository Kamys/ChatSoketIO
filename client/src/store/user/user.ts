import { createEffect, createStore } from 'effector'
import { axiosInstance, initToken } from '../../api'
import { removeToken } from '../../api/utils'

export interface IUserLoginForm {
  name: string
  password: string
}

export interface ILoginResponse {
  user: IUser
  token: string
}

export interface IUser {
  id: string
  name: string
  avatar: string
}

type SaveAvatarRequest = {
  avatar: File
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

const saveAvatar = createEffect<SaveAvatarRequest, void, void>('saveAvatar', {
  handler: ({ avatar }) => {
    const formData = new FormData()
    formData.append('avatar', avatar)
    return axiosInstance
      .post('users/avatar', formData)
      .then(response => response.data)
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
  .on(login.done, (_, action) => {
    console.log('login.done: ', action.result.user)
    return action.result.user
  })
  .on(createUser.done, (_, action) => action.result.user)
  .on(fetchAccount.done, (_, action) => {
    console.log('fetchAccount.done: ', action)
    return action.result
  })
  .on(logout.done, () => null)

export default {
  storeAccount,
  login,
  logout,
  createUser,
  fetchAccount,
  saveAvatar,
}
