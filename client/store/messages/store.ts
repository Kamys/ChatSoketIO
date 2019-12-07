import { createEffect, createStore } from 'effector'
import { ChatElement } from './type'
import { IDictionary } from '../../type'

const receiveMessage = createEffect<ChatElement, ChatElement, void>('receiveMessage', {
  handler: params => params,
})

const store = createStore<IDictionary<Array<ChatElement>>>({}).on(
  receiveMessage.done,
  (state, payload) => {
    const oldMessages = state[payload.result.chatId] || []
    return ({
      ...state,
      [payload.result.chatId]: [
        ...oldMessages,
        payload.result,
      ],
    })
  }
)

export default {
  store,
  receiveMessage,
}
