import express from 'express'
import { createServer } from 'http'
import path from 'path'
import mongoose from 'mongoose'
import chat from './chat'
import usersRoute from './routes/user.route'
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

app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))
app.use('/api/users', usersRoute)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

http.listen(3000, () => {
  console.log('Server start: http://localhost:3000/')
})

chat.run(http)
