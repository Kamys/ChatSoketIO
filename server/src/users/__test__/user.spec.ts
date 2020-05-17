import request from 'supertest'
import { createApp } from '../../app'
import User from '../../users'
import { HTTP_STATUS } from '../../domainError/types'
import mongoose from 'mongoose'

describe('user', () => {

  const mongodbUrl = (global as any).__MONGO_URI__
  const { app, close } = createApp(mongodbUrl)

  afterAll(async (done) => {
    await close()
    done()
  })

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
  })

  describe('login', () => {
    it('login correct', async (done) => {
      const name = 'Jack'
      const password = '123'

      const user = await User.createModel(name, password)
      await user.save()

      request(app)
        .post('/api/users/login')
        .send({name, password})
        .expect(HTTP_STATUS.OK)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body).toEqual(
            expect.objectContaining({
              token: expect.any(String),
              id: expect.any(String),
              name: name,
            }),
          )
          done()
        })
    })
    it('failed if password incorrect', async (done) => {
      const name = 'Jack'
      const password = '123'

      const user = await User.createModel(name, password)
      await user.save()

      request(app)
        .post('/api/users/login')
        .send({name, password: '000'})
        .expect(HTTP_STATUS.UNAUTHORIZED)
        .end(done)
    })
    it('failed validation name', (done) => {
      request(app)
        .post('/api/users/login')
        .send({name: 'Va', password: '000'})
        .expect(HTTP_STATUS.BAD_REQUEST, {
          path: ['name'],
          error: '"name" length must be at least 3 characters long',
        }, done)
    })
  })

  describe('create user', () => {
    it('create successful', (done) => {
      return request(app)
        .post('/api/users')
        .send({ name: 'Test user', password: '123' })
        .expect(HTTP_STATUS.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toEqual(
            expect.objectContaining({
              token: expect.any(String),
              id: expect.any(String),
              name: 'Test user',
            }),
          )
          done()
        })
    })
    it('failed validation name', (done) => {
      return request(app)
        .post('/api/users')
        .send({ name: 'r', password: '123' })
        .expect(HTTP_STATUS.BAD_REQUEST, {
          path: ['name'],
          error: '"name" length must be at least 3 characters long',
        }, done)
    })
  })
})
