import { createEffect, createStore } from 'effector'
import axios from 'axios'

export interface IUserPayload {
  userName: string
  password: string
}

const login = createEffect<IUserPayload, IUserPayload, void>('login', {
  handler: user => {
    return axios.post('http://localhost:3000/api/users/login', user)
  },
})

const singUp = createEffect<IUserPayload, IUserPayload, void>('singUp', {
  handler: user => {
    return axios.post('http://localhost:3000/api/users', user)
  },
})

const account = createStore<IUserPayload>(null).on(
  login.done,
  (_, action) => action.result
)

export default {
  login,
  account,
  singUp,
}
