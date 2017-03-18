import http from 'http'
import Koa from 'koa'
import request from 'supertest'
import debug from 'debug'
import assert from 'assert'
import _ from 'lodash'

import Router from '../../src/'
import models from '../models/'

const router = Router(models)
const log = debug('koa-sequelize-resource:test:disable-count')

describe ('disable count', function () {

  let server

  before (function () {
    let app = new Koa()
    
    router.define('user', (resources) => ({
      index: resources.User.index({disableCount: true})
    }))
    
    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  describe('RANGE', () => {
    it('should be 200 and body length equal 2', done => {
      server
        .get('/user')
        .set('content-range', 'items 1-2/2')
        .expect('content-range', 'items 1-2/2')
        .expect(206, done)
    })
  })
})