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
import router from './mock/routers'

const log = debug('koa-sequelize-resource:router')

describe ('has one', function () {

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

    it('read one should 200 and is object', done => {
      server
        .get('/user/1/profile')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          log(res.body)
          assert(_.isObject(res.body))
          done()
        })
    })

    it('should 204', done => {
      server
        .get('/user/2/profile')
        .expect(204, done)
    })
  })

  describe('POST', () => {
    it('create should be 201', done => {
      server
        .post('/user/2/profile')
        .type('form')
        .send({ avatar: 'http://avatar.com/tom.png'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          log(err, res)
          if (err) throw done(err)
          // assert(res.body.password !== '123456')
          done()
        })
    })

    it('create should be 201', done => {
      server
        .post('/user/1/profile')
        .type('form')
        .send({ avatar: 'http://avatar.com/tom.png'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          log(err, res)
          if (err) throw done(err)
          // assert(res.body.password !== '123456')
          done()
        })
    })
    
  //   it('create duplicated name should be 409', done => {
  //     server
  //       .post('/user')
  //       .type('form')
  //       .send({ name: 'Donna', email: 'dona@who.com', password: '123456'})
  //       .expect(409, done)
  //   })
  })

  describe('PATCH', () => {
    it('update should be 200', done => {
      server
        .patch('/user/1/profile')
        .type('form')
        .send({ avatar: 'http://avatar.com/updated.png'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('update empty should be 200', done => {
      server
        .patch('/user/2/profile')
        .type('form')
        .send({ avatar: 'http://avatar.com/tom.png'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('update not found should be 204', done => {
      server
        .patch('/user/0/profile')
        .type('form')
        .send({ avatar: 'http://avatar.com/tom.png'})
        .expect(204, done)
    })
  })

  describe('DELETE', () => {
    it('destroy should be 204', done => {
      server
        .delete('/user/1/profile')
        .expect(204, done)
    })
  })
})