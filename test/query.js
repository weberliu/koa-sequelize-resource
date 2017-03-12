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

describe ('query models', function () {

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

  describe('RANGE', () => {
    it('should be 200 and body length equal 2', done => {
      server
        .get('/user')
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
  })

  describe('QUERY', () => {  
    it('should be 200 and body length is 3', done => {
      server
        .get('/user?name=n')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let body = res.body
          debug(body)
          assert(body.length === 3)
          done()
        })
    })
  })
})