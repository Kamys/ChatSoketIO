require('module-alias/register')
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import mongoose from 'mongoose'
import User from './users'
import Chat from './chats'
import checkEnvironment from './utils/checkEnvironment'

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
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))
app.use('/api/users', User.router)
app.use('/api/chats', Chat.router)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

http.listen(3000, () => {
  console.log('Server start: http://127.0.0.1:3000/')
})

User.chat.run(http)
