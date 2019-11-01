const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const chat = require('./chat')

app.use(express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

http.listen(3000, () => {
  console.log('Server start: http://localhost:3000/')
})

chat.run(http)
