import request from 'supertest'
import { createApp } from '../../app'
import User from '../../users'
import { HTTP_STATUS } from '../../domainError/types'
import mongoose from 'mongoose'
import { createUser } from '../../__test__/utils'
import utils from '../utils'
import path from 'path'
import fs from 'fs'

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
      const { name, password } = await createUser()

      request(app)
        .post('/api/users/login')
        .send({ name, password })
        .expect(HTTP_STATUS.OK)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).toEqual(
            expect.objectContaining({
              token: expect.any(String),
              id: expect.any(String),
              name: name,
            })
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
        .send({ name, password: '000' })
        .expect(HTTP_STATUS.UNAUTHORIZED)
        .end(done)
    })
    it('failed validation name', (done) => {
      request(app)
        .post('/api/users/login')
        .send({ name: 'Va', password: '000' })
        .expect(
          HTTP_STATUS.BAD_REQUEST,
          {
            path: ['name'],
            error: '"name" length must be at least 3 characters long',
          },
          done
        )
    })
    it('user not found', (done) => {
      request(app)
        .post('/api/users/login')
        .send({ name: 'NotExistUserName', password: '000' })
        .expect(
          HTTP_STATUS.NOT_FOUND,
          {
            error: 'User not found',
          },
          done
        )
    })
  })

  describe('create user', () => {
    it('create successful', (done) => {
      request(app)
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
            })
          )
          done()
        })
    })
    it('user already exist', async (done) => {
      const { name, password } = await createUser()

      request(app).post('/api/users').send({ name, password }).expect(
        HTTP_STATUS.BAD_REQUEST,
        {
          error: 'User already exist',
          domainErrorType: 'ModelAlreadyExist',
        },
        done
      )
    })
    it('failed validation name', (done) => {
      request(app)
        .post('/api/users')
        .send({ name: 'r', password: '123' })
        .expect(
          HTTP_STATUS.BAD_REQUEST,
          {
            path: ['name'],
            error: '"name" length must be at least 3 characters long',
          },
          done
        )
    })
  })

  describe('contacts', () => {
    it('get empty contacts', async (done) => {
      const { id, name } = await createUser()
      const token = utils.generateAuthToken({ id, name })

      request(app)
        .get('/api/users/contacts')
        .set('authorization', token)
        .send({})
        .expect(HTTP_STATUS.OK, [], done)
    })

    it('get one contact', async (done) => {
      const { token } = await createUser()
      const secondUser = await createUser('Second user')

      request(app)
        .get('/api/users/contacts')
        .set('authorization', token)
        .send({})
        .expect(
          HTTP_STATUS.OK,
          [{ id: secondUser.id, name: secondUser.name }],
          done
        )
    })
  })

  it('get current', async (done) => {
    const { id, token, name } = await createUser()

    request(app)
      .get('/api/users/current')
      .set('authorization', token)
      .send({})
      .expect(HTTP_STATUS.OK, {
        id,
        name,
      }, done)
  })

  describe('contacts', () => {
    it('get error avatar is required', async (done) => {
      const { token } = await createUser()

      const imagePath = path.resolve('./src/users/__test__/userAvatar.png')
      request(app)
        .post('/api/users/avatar')
        .attach('file', imagePath)
        .set('authorization', token)
        .expect(HTTP_STATUS.BAD_REQUEST, {
          domainErrorType: 'InvalidArguments',
          error: 'File avatar is required',
          path: [
            'files',
            'avatar'
          ]
        }, done)
    })

    it('get image path', async (done) => {
      const { token } = await createUser()

      const imagePath = path.resolve('./src/users/__test__/userAvatar.png')
      request(app)
        .post('/api/users/avatar')
        .attach('avatar', imagePath)
        .set('authorization', token)
        .expect(HTTP_STATUS.OK)
        .end((err, res) => {
          if (err) return done(err)
          const fileName = res.body.fileName
          expect(fileName).toEqual(expect.any(String))
          const fulFIleName = path.resolve('../uploads', fileName)
          const avatar = fs.readFileSync(fulFIleName)
          const avatarActually = fs.readFileSync(imagePath)
          expect(avatar.equals(avatarActually)).toBeTruthy()
          fs.unlinkSync(fulFIleName)
          done()
        })
    })
  })
})
