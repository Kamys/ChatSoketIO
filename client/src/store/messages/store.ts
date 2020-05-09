import { createEffect, createStore } from 'effector'
import { ChatElement } from './type'
import { IDictionary } from '../../type'
import { axiosInstance } from 'client/src/api'
import { IViewMessage } from 'server/src/message/type'
import { messageToChatItem } from './utils'

const getAllMessages = createEffect<{ chatId: string }, IViewMessage[], void>(
  'getAllMessages',
  {
    handler: params => {
      return axiosInstance
        .get('/messages', { params: { chatId: params.chatId } })
        .then(response => response.data)
    },
  }
)

const receiveMessage = createEffect<ChatElement, ChatElement, void>(
  'receiveMessage',
  {
    handler: params => params,
  }
)

const store = createStore<IDictionary<Array<ChatElement>>>({})
  .on(receiveMessage.done, (state, payload) => {
    const oldMessages = state[payload.result.chatId] || []
    return {
      ...state,
      [payload.result.chatId]: [...oldMessages, payload.result],
    }
  })
  .on(getAllMessages.done, (state, payload) => {
    return {
      ...state,
      [payload.params.chatId]: payload.result.map(messageToChatItem),
    }
  })

export default {
  store,
  receiveMessage,
  getAllMessages,
}
