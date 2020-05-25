import request from 'supertest'
import { createApp } from '../../app'
import { HTTP_STATUS } from '../../domainError/types'
import mongoose from 'mongoose'
import { createUser } from '../../__test__/utils'

describe('chats', () => {
  const mongodbUrl = (global as any).__MONGO_URI__
  const { app, close } = createApp(mongodbUrl)

  afterAll(async (done) => {
    await close()
    done()
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
  })

  describe('createPersonal', () => {
    it('create personal chat', async (done) => {
      const { token } = await createUser()
      // const secondUser = await createUser('secondUser')
      const memberId = 'notExistId'

      request(app)
        .post('/api/chats/createPersonal')
        .set('authorization', token)
        .send({ memberId })
        .expect(HTTP_STATUS.BAD_REQUEST, {
          error: '""memberId"" is not valid id',
          path: ['memberId'],
          domainErrorType: 'Validation'
        }, done)
    })
  })
})
