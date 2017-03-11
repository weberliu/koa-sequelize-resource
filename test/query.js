'use strict';

import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import request from 'supertest'
import logger from 'debug'
import assert from 'assert'
import _ from 'lodash'

import Resource from '../src/resource'
import models from './models/'

const debug = logger('koa-sequelize-resource:test:query')

describe ('query routers', function () {

  let server

  before (function () {
    let app = new Koa()
      , user = new Resource(models.User)
      , router = Router()
    
    router.get('/user', async (ctx, next) => {
      await next()
    }, user.readAll())

    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  describe('QUERY', () => {
    it('content range', done => {
      server
        .get('/user?name=n')
        .set('content-range', 'items 1-2/2')
        .expect('content-range', 'items 1-2/4')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let body = res.body
          debug(res.header)
          assert(body.length === 2)
          done()
        })
    })

    // it('query string', done => {
    //   server
    //     .get('/user?name=n')
    //     .expect(200)
    //     .end((err, res) => {
    //       if (err) throw done(err)
    //       let body = res.body
    //       debug(body)
    //       // assert(body.length === 2)
    //       done()
    //     })
    // })
  })
})