import { Server } from 'http'
import socketIo, { Socket } from 'socket.io'
import socketAuth from 'socketio-auth'
import utils from './utils'
import { SERVER_ERROR } from '../constants/error'
import { IUserJWTPayload } from './type'

interface ISocketChat extends Socket {
  user: IUserJWTPayload
}

const run = (http: Server) => {
  const io = socketIo(http)

  const postAuthenticate = async (socket: ISocketChat) => {
    const { userName } = socket.user
    io.emit('info', `${userName} joined the chat`)

    socket.on('sendMessage', msg => {
      const { userName } = socket.user
      io.emit('sendMessage', { userName, msg })
    })
  }

  socketAuth(io, {
    authenticate: async (socket: ISocketChat, data, callback) => {
      const { token } = data

      try {
        socket.user = utils.verifyAuthToken(token)

        return callback(null, true)
      } catch (e) {
        return callback({ message: SERVER_ERROR.ACCESS_TOKEN_INVALID })
      }
    },
    postAuthenticate,
    disconnect: async socket => {
      if (socket.user) {
        const { userName } = socket.user
        io.emit('info', `${userName} left the chat`)
      } else {
        console.log('Not auth user disconnect')
      }
    },
  })
}

export default { run }
