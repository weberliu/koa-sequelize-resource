
import http from 'http'
import Koa from 'koa'
import request from 'supertest'
import logger from 'debug'
import assert from 'assert'
import _ from 'lodash'

import router from '../mock/routers'
import { loadMockData } from '../models'

const debug = logger('ksr:test:query')

describe('query models', function () {
  let server

  before(function () {
    let app = new Koa()

    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  beforeEach(function (done) {
    loadMockData()
      .then(() => {
        debug('reset db done')
        done()
      })
      .catch(done)
  })

  describe('RANGE', () => {
    it('should be 200 and body length equal 2', done => {
      server
        .get('/user?limit=2')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let { items } = res.body
          assert(items.length === 2)
          done()
        })
    })
  })

  describe('QUERY', () => {
    it('should be 200 and items length is 3', done => {
      server
        .get('/user?name=n')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let { items } = res.body
          assert(items.length === 3)
          done()
        })
    })
  })

  describe('ORDER', () => {
    it('should be 200 and sort by name desc', done => {
      server
        .get('/user?sort=-name')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let { items } = res.body
          assert(items[0].name === 'Tom')
          done()
        })
    })

    it('should be 200 and sort by name asc', done => {
      server
        .get('/user?sort=name')
        .end((err, res) => {
          if (err) throw done(err)
          let { items } = res.body
          assert(items[0].name === 'Andy')
          done()
        })
    })
  })
})
