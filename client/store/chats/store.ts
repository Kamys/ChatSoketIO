import { createEffect, createStore } from 'effector'
import { axiosInstance } from '../../api'
import { Chat } from './type'

const getAll = createEffect<void, Chat[], void>('getAll', {
  handler: () => {
    return axiosInstance.get('chats/current').then(response => response.data)
  },
})

type GetChatPayload = {
  memberId: string
}

const getChat = createEffect<GetChatPayload, Chat, void>('getChat', {
  handler: (params) => {
    return axiosInstance.get('chats/getChat', { params: params }).then(response => response.data)
  },
})

const storeChats = createStore<Chat[]>([]).on(
  getAll.done,
  (state, payload) => payload.result
)
  .on(
    getChat.done,
    (state, payload) => [...state, payload.result]
  )

export default {
  storeChats,
  getAll,
  getChat,
}
