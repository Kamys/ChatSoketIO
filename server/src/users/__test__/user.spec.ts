import request from 'supertest'
import app from '../../index'
import { HTTP_STATUS } from '../../domainError/types'

jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    next()
  }
})

describe('user', () => {
  it('User login correct', (done) => {
    request(app)
      .post('/api/users/login')
      .send({name: 'Vasa', password: '123'})
      .expect(HTTP_STATUS.OK, {
        user: {
          name: 'Vasa'
        }
      }, done)
  })
  it('User login failed if password incorrect', (done) => {
    request(app)
      .post('/api/users/login')
      .send({name: 'Vasa', password: '000'})
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .end(done)
  })
  it('User login failed validation name', (done) => {
    request(app)
      .post('/api/users/login')
      .send({name: 'Va', password: '000'})
      .expect(HTTP_STATUS.BAD_REQUEST, {
        path: ['name'],
        error: '"name" length must be at least 3 characters long',
      }, done)
  })
})
