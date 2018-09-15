import http from 'http'
import Koa from 'koa'
import request from 'supertest'
import debuger from 'debug'
import assert from 'assert'
import _ from 'lodash'

import Router from '../../src/'
import models from '../models/'

const router = Router(models)
const debug = debuger('ksr:test:disable-count')

describe('disable count', function () {
  let server

  before(function () {
    let app = new Koa()

    router.define('user', (resources) => ({
      all: resources.User.all({disableCount: true})
    }))

    router.define('user/:uid/posts', (resources) => ({
      all: resources.User.relations('Posts', 'uid').all({disableCount: true}),
    }))

    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  describe('RESOURCE', () => {
    it('should be 200 and body length equal 2', done => {
      server
        .get('/user?limit=2')
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          let { items, metadata } = res.body
          assert(items.length === 2)
          assert(metadata.pagination.totalCount === 0)
          done()
        })
    })
  })

  describe('ASSOCIATION RESOURCE', () => {
    it('should be 200 and body length equal 2', done => {
      server
        .get('/user/1/posts?limit=2')
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          let { items, metadata } = res.body
          assert(items.length === 2)
          assert(metadata.pagination.limit === 2)
          assert(metadata.pagination.totalCount === 0)
          done()
        })
    })
  })
})
