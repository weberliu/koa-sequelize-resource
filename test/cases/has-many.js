'use strict';

import http from 'http'
import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import request from 'supertest'
import debug from 'debug'
import assert from 'assert'
import _ from 'lodash'

import models from '../models/'
import router from '../mock/routers'

const log = debug('koa-sequelize-resource:test:hasmany')

describe ('has many', function () {

  let server

  before (function () {
    let app = new Koa()
      , bodyparser = BodyParser()

    app
      .use(convert(bodyparser))
      .use(convert(router.routes()))
      .use(convert(router.allowedMethods()))

    server = request(http.createServer(app.callback()))
  })

  beforeEach (function (done) {

    models.loadMockData().then(() => {
      log('reset db done')
      done()
    }).catch(done)  

  })

  describe('GET', () => {

    describe('get all posts', () => {
      it('shoud 200 and length is 3', done => {
        server
          .get('/user/1/posts')
          .expect(200)
          .end((err, res) => {
            if (err) throw new Error(err)
            assert(res.body.length == 3)
            done()
          })
      })
    })

    describe('all posts and order by id', () => {
      it('shoud 200', done => {
        server
          .get('/user/1/posts?orderby=-id')
          .expect(200)
          .end((err, res) => {
            if (err) throw new Error(err)
            assert(res.body[0].id > res.body[1].id)
            done()
          })
      })
    })

    describe('all post by keywords', () => {
      it('query string shoud 200 and length is 2', done => {
        server
          .get('/user/1/posts?thread=Post1')
          .expect(200)
          .end((err, res) => {
            if (err) throw new Error(err)
            assert(res.body.length == 1)
            assert(res.body[0].userId == 1)
            done()
          })
      })
    })

    describe('all posts by range', () => {
      it('shoud 200 and length is 2', done => {
        server
          .get('/user/1/posts')
          .set('content-range', 'items 2-3/2')
          .expect('content-range', 'items 2-3/3')
          .expect(206, done)
      })
    })

    it('should 204', done => {
      server
        .get('/user/0/posts')
        .expect(204, done)
    })
  })

  describe('POST', () => {
    it('create should be 201', done => {
      server
        .post('/user/4/posts')
        .type('form')
        .send({ thread: 'Post newest', content: 'Post content' })
        .expect(201)
        .end((err, res) => {
          if (err) throw done(err)
          done()
        })
    })
  })

  describe('PATCH', () => {
    it('update should be 200', done => {
      server
        .patch('/user/1/posts/1')
        .type('form')
        .send({ thread: 'Post updated'})
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          assert(res.body.userId == 1)
          done()
        })
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