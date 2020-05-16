import request from 'supertest'
import app from '../../index'
import { HTTP_STATUS } from '../../domainError/types'

describe('user', () => {
  it('login correct', (done) => {
    request(app)
      .post('/api/users/login')
      .send({name: 'Vasa', password: '123'})
      .expect(HTTP_STATUS.OK)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
            id: expect.any(String),
            name: 'Vasa',
          }),
        )
        done()
      })
  })
  it('failed if password incorrect', (done) => {
    request(app)
      .post('/api/users/login')
      .send({name: 'Vasa', password: '000'})
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
