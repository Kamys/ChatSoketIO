import { createEffect, createStore } from 'effector'
import { axiosInstance } from '../../api'
import { Chat } from './type'

const getAll = createEffect<void, Chat[], void>('getAll', {
  handler: () => {
    return axiosInstance.get('chats/current').then(response => response.data)
  },
})

const storeChats = createStore<Chat[]>([]).on(
  getAll.done,
  (state, payload) => payload.result
)

export default {
  storeChats,
  getAll,
}
