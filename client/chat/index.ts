import socketIOClient from 'socket.io-client'
import { getToken } from '../api/utils'
import user from '../store/user'
import { baseURL } from '../api'

const socket = socketIOClient(baseURL, {
  autoConnect: false,
})

const init = () => {
  socket.on('connect', () => {
    socket.emit('authentication', {
      token: getToken(),
    })
  })

  socket.on('authenticated', reason => {
    console.log('Authenticated:', reason)
  })

  socket.on('unauthorized', reason => {
    console.log('Unauthorized:', reason)
    user.logout()
    socket.disconnect()
  })

  socket.on('disconnect', reason => {
    console.log(`Disconnected: ${reason}`)
  })

  socket.open()
}

type Messages = {
  chatId: string
  msg: string
}

const sendMessage = (messages: Messages) => {
  socket.emit('sendMessage', messages)
}

const handleSendMessage = (handler: Function) => {
  socket.on('sendMessage', handler)
}

const handleSendInfo = (handler: Function) => {
  socket.on('info', handler)
}

const closeAllHandler = () => {
  socket.off('sendMessage')
  socket.off('info')
}

export default {
  init,
  sendMessage,
  handleSendMessage,
  handleSendInfo,
  closeAllHandler,
}
