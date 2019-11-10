import { Server } from 'http'
import socketIo, { Socket } from 'socket.io'
import socketAuth from 'socketio-auth'
import {
  decrementUserConnect,
  hasUserConnect,
  incrementUserConnect,
  IUserJWTPayload,
  verifyAuthToken,
} from '../models/user.model'
import { SERVER_ERROR } from '../constants/error'

interface ISocketChat extends Socket {
  user: IUserJWTPayload
}

const run = (http: Server) => {
  const io = socketIo(http)

  const postAuthenticate = async (socket: ISocketChat) => {
    const { userName, id } = socket.user
    const hasOtherConnection = await hasUserConnect(id)
    await incrementUserConnect(id)

    if (!hasOtherConnection) {
      io.emit('info', `${userName} joined the chat`)
    }

    socket.on('sendMessage', msg => {
      const { userName } = socket.user
      io.emit('sendMessage', { userName, msg })
    })
  }

  socketAuth(io, {
    authenticate: async (socket: ISocketChat, data, callback) => {
      const { token } = data

      try {
        socket.user = verifyAuthToken(token)

        return callback(null, true)
      } catch (e) {
        return callback({ message: SERVER_ERROR.ACCESS_TOKEN_INVALID })
      }
    },
    postAuthenticate,
    disconnect: async socket => {
      if (socket.user) {
        const { userName, id } = socket.user
        await decrementUserConnect(id)
        const hasOtherConnection = await hasUserConnect(id)
        if (!hasOtherConnection) {
          io.emit('info', `${userName} left the chat`)
        }
      } else {
        console.log('Not auth user disconnect')
      }
    },
  })
}

export default { run }
