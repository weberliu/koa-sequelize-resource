import http from 'http'
import Koa from 'koa'
import request from 'supertest'
import debuger from 'debug'

import Router from '../../src/'
import models from '../models/'

const router = Router(models)
const debug = debuger('ksr:test:middlewares')

describe('middlewares', function () {
  let server

  before(function () {
    let app = new Koa()

    router
      .define('user',
        async (ctx, next) => {
          ctx.status = 401
        },
        (resources) => ({
          all: resources.User.all()
        }))
      .crud('user/:uid/posts',
        async (ctx, next) => {
          ctx.status = 401
        },
        resources => resources.User.relations('Posts')
      )

    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  describe('get', () => {
    it('should be 401', done => {
      server
        .get('/user')
        .expect(401, done)
    })
    it('should be 401', done => {
      server
        .get('/user/1/posts')
        .expect(401, done)
    })
  })
})
