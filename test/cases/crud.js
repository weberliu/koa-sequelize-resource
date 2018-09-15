import http from 'http'
import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import request from 'supertest'
import assert from 'assert'
import debuger from 'debug'

import { loadMockData } from '../models/'
import router from '../mock/association-routers'

const debug = debuger('ksr:test:crud')

describe('crud', function () {
  let server

  before(function () {
    let app = new Koa()
    let bodyparser = BodyParser()

    app
      .use(convert(bodyparser))
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  beforeEach(function (done) {
    loadMockData().then(() => {
      debug('reset db done')
      done()
    }).catch(done)
  })

  describe('access router defined by crud method', _ => {
    describe('GET', () => {
      it('should be 200', done => {
        server
          .get('/user')
          .expect(200, done)
      })
    })
  })
})
