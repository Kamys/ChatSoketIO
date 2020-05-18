import express from 'express'
import fileUpload from 'express-fileupload'
import { ValidationError } from 'express-validation'
import { createServer } from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { DomainErrorOld, DomainError } from 'server/src/domainError'

import Routing from './routing'
import User from './users'
import checkEnvironment from './utils/checkEnvironment'

export const createApp = (mongodbUrl: string) => {
  const app = express()
  const http = createServer(app)

  const errorEnv = checkEnvironment()

  if (errorEnv) {
    console.error('Environment defined not correct.', errorEnv)
    process.exit(1)
  }

  mongoose
    .connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
    next()
  })
  app.use(fileUpload())
  app.use(express.json())
  app.use(express.static(path.join(__dirname, '../dist')))
  app.use('/api', Routing)

// eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.log('Not handle error: ', error)
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json(error)
    }
    if (error instanceof DomainErrorOld) {
      return res.status(error.httpStatus).send({
        messages: 'Not handle domain error',
        error: error.domainErrorType,
        ...error.errorInfo,
      })
    } if (error instanceof DomainError) {
      return res.status(error.httpStatus).send({
        error: error.message,
        path: error.path,
        domainErrorType: error.domainErrorType,
      })
    } else {
      res.status(500).send({
        messages: 'Not handle error ¯\\_(ツ)_/¯',
        error: error.toString(),
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

  const server = http.listen(3000, () => {
    console.log('Server start: http://127.0.0.1:3000/')
  })

  const socketIo = User.chat.run(http)

  const close = async () => {
    await server.close()
    await mongoose.connection.close()
    await socketIo.close()
  }

  return { close, server, app }
}
