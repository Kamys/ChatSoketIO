import { Server } from 'http'
import socketIo from 'socket.io'

const run = (http: Server) => {
  const io = socketIo(http)

  io.on('connection', socket => {
    console.log('a user connected')
    socket.on('initUser', ({ userName }) => {
      io.emit('info', `${userName} joined the chat`)
      socket.on('disconnect', () => {
        io.emit('info', `${userName} left the chat`)
      })
      socket.on('sendMessage', msg => {
        console.log('sendMessage', { userName, msg })
        io.emit('sendMessage', { userName, msg })
      })
    })
  })
}

export default { run }
