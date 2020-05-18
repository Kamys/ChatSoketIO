import { Server } from 'http'
import socketIo, { Socket } from 'socket.io'
import socketAuth from 'socketio-auth'

import { IChat } from '~/chat/type'
import Chats from '~/chat'
import Message from '~/message'

import { IUserJWTPayload } from './type'
import utils from './utils'
import { SERVER_ERROR } from '~/domainError/constants'

interface ISocketChat extends Socket {
  user: IUserJWTPayload
}

const user = {}

const run = (http: Server) => {
  const io = socketIo(http)

  const getSocketById = (userId: string): ISocketChat => {
    const socketId = user[userId]
    return io.sockets.sockets[socketId] as ISocketChat
  }

  const postAuthenticate = async (socket: ISocketChat) => {
    socket.on('sendMessage', async message => {
      const chat: IChat = await Chats.findById(message.chatId)
      if (!chat) {
        return
      }
      const newMessages = await Message.controller.createMessages(socket.user, chat.id, message.msg)
      chat.memberIds.forEach(memberId => {
        const toSocket = getSocketById(memberId)
        if (!toSocket) {
          return
        }
        toSocket.emit('sendMessage', newMessages)
      })
    })
  }

  socketAuth(io, {
    authenticate: async (socket: ISocketChat, data, callback) => {
      const { token } = data

      try {
        socket.user = utils.verifyAuthToken(token)
        user[socket.user.id] = socket.id
        return callback(null, true)
      } catch (e) {
        return callback({ message: SERVER_ERROR.ACCESS_TOKEN_INVALID })
      }
    },
    postAuthenticate,
    disconnect: async () => {},
  })

  return io
}

export default { run }