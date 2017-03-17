'use strict';

import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import request from 'supertest'
import logger from 'debug'
import assert from 'assert'
import _ from 'lodash'

import router from './mock/routers'
import models from './models/'

const log = logger('koa-sequelize-resource:test:query')

describe ('query models', function () {

  let server

  before (function () {
    let app = new Koa()

    app
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  beforeEach (function (done) {

    models.loadMockData().then(() => {
      log('reset db done')
      done()
    }).catch(done)  

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
          log(body)
          assert(body.length === 3)
          done()
        })
    })
  })

  describe('ORDER', () => {  
    it('should be 200 and first user is Tom', done => {
      server
        .get('/user?orderby=-name')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let body = res.body
          log(body)
          assert(body[0].name === 'Tom')
          done()
        })
    })

    it('should be 200 and first user is Andy', done => {
      server
        .get('/user?orderby=name')
        .end((err, res) => {
          if (err) throw done(err)
          let body = res.body
          assert(body[0].name === 'Andy')
          done()
        })
    })
  })
})