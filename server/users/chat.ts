import { Server } from 'http'
import socketIo, { Socket } from 'socket.io'
import socketAuth from 'socketio-auth'
import utils from './utils'
import { SERVER_ERROR } from '../constants/error'
import { IUserJWTPayload } from './type'

interface ISocketChat extends Socket {
  user: IUserJWTPayload
}

const user = {}

const run = (http: Server) => {
  const io = socketIo(http)

  const getSocketByName = (name: string): ISocketChat => {
    const socketId = user[name]
    return io.sockets.sockets[socketId] as ISocketChat
  }

  const postAuthenticate = async (socket: ISocketChat) => {
    socket.on('sendMessage', message => {
      const { name } = socket.user
      const toSocket = getSocketByName(message.to)
      if (!toSocket) {
        return
      }
      const newMessages = { name, msg: message.msg, to: message.to }
      toSocket.emit('sendMessage', newMessages)
      socket.emit('sendMessage', newMessages)
    })
  }

  socketAuth(io, {
    authenticate: async (socket: ISocketChat, data, callback) => {
      const { token } = data

      try {
        socket.user = utils.verifyAuthToken(token)
        user[socket.user.name] = socket.id
        return callback(null, true)
      } catch (e) {
        return callback({ message: SERVER_ERROR.ACCESS_TOKEN_INVALID })
      }
    },
    postAuthenticate,
    disconnect: async () => {},
  })
}

export default { run }
