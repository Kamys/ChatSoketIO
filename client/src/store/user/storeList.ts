import { createEffect, createStore } from 'effector'

import { axiosInstance } from '~/api'

import { IUser } from './user'

const getAll = createEffect<void, IUser[], void>('getAll', {
  handler: () => {
    return axiosInstance.get('users/contacts').then(response => response.data)
  },
})

const storeList = createStore<IUser[]>([]).on(
  getAll.done,
  (state, payload) => payload.result
)

export default {
  storeList,
  getAll,
}
