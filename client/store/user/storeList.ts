import { createEffect, createStore } from 'effector'
import { IUser } from './user'
import { axiosInstance } from '../../api'

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
