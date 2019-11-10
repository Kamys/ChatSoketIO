import { Server } from 'http'
import socketIo, { Socket } from 'socket.io'
import socketAuth from 'socketio-auth'
import { IUserJWTPayload, verifyAuthToken } from '../models/user.model'
import { SERVER_ERROR } from '../constants/error'

interface ISocketChat extends Socket {
  user: IUserJWTPayload
}

const run = (http: Server) => {
  const io = socketIo(http)

  io.on('connection', (socket: ISocketChat) => {
    socket.on('sendMessage', msg => {
      const { userName } = socket.user
      io.emit('sendMessage', { userName, msg })
    })
  })

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
    postAuthenticate: socket => {
      const { userName } = socket.user
      io.emit('info', `${userName} joined the chat`)
    },
    disconnect: socket => {
      const { userName } = socket.user
      io.emit('info', `${userName} left the chat`)
    },
  })
}

export default { run }
