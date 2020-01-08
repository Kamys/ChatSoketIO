import 'module-alias/register'
import express from 'express'
import fileUpload from 'express-fileupload'
import { DomainError } from 'server/domainError'
import { createServer } from 'http'
import path from 'path'
import mongoose from 'mongoose'
import checkEnvironment from './utils/checkEnvironment'
import User from './users'
import Chat from './chat'
import Message from './message'
import File from './file'


const app = express()
const http = createServer(app)

const errorEnv = checkEnvironment()

if (errorEnv) {
  console.error('Environment defined not correct.', errorEnv)
  process.exit(1)
}

mongoose
  .connect('mongodb://localhost/nodejsauth', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
  next()
})
app.use(fileUpload())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))
app.use('/api/users', User.router)
app.use('/api/chats', Chat.router)
app.use('/api/messages', Message.router)
app.use('/api/file', File.router)

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log('Not handle error: ', error)
  if (error instanceof DomainError) {
    res.status(error.httpStatus).send({
      messages: 'Not handle domain error ¯\\_(ツ)_/¯',
      error: error.domainErrorType,
      ...error.errorInfo,
    })
  } else {
    res.status(500).send({
      messages: 'Not handle error ¯\\_(ツ)_/¯',
      error: error.toString()
    })
  }
})
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404)

  // respond with html page
  if (req.accepts('text/html')) {
    res.status(200)
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    return
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

http.listen(3000, () => {
  console.log('Server start: http://127.0.0.1:3000/')
})

User.chat.run(http)
