'use strict';

import http from 'http'
import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import request from 'supertest'
import debug from 'debug'
import assert from 'assert'
import _ from 'lodash'

import models from './models/'
import router from './mock/association-routers'

const log = debug('koa-sequelize-resource:test:crud')

describe ('crud', function () {

  let server

  before (function () {
    let app = new Koa()
      , bodyparser = BodyParser()

    app
      .use(convert(bodyparser))
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

  describe('resources', () => {
    describe('GET', () => {
      it('should be 200', done => {
        server
          .get('/user')
          .expect(200, done)
      })
    })

    describe('POST', () => {
      it('create should be 201', done => {
        server
          .post('/user')
          .type('form')
          .send({ name: 'Bill', email: 'bill@who.com', password: '123456'})
          .expect(201, done)
      })
    })

    describe('PATCH', () => {
      it('update should be 200', done => {
        server
          .patch('/user/1')
          .type('form')
          .send({ name: 'Bill', email: 'bill@who.com', password: '123456'})
          .expect(200, done)
      })
    })

    describe('DELETE', () => {
      it('destroy should be 204', done => {
        server
          .delete('/user/1')
          .expect(204, done)
      })
    })
  })

  describe('association resources', () => {
    describe('GET', () => {
      it('should be 200', done => {
        server
          .get('/user/1/posts')
          .expect(200, done)
      })
    })

    describe('POST', () => {
      it('create should be 201', done => {
        server
          .post('/user/1/posts')
          .type('form')
          .send({ thread: 'New post', content: 'new content'})
          .expect(201, done)
      })
    })

    describe('PATCH', () => {
      it('update should be 200', done => {
        server
          .patch('/user/1/posts/1')
          .type('form')
          .send({ thread: 'New post', content: 'new content'})
          .expect(200, done)
      })
    })

    describe('DELETE', () => {
      it('destroy should be 204', done => {
        server
          .delete('/user/1/posts/1')
          .expect(204, done)
      })
    })
  })
})