'use strict';

import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import request from 'supertest'
import logger from 'debug'
import assert from 'assert'
import _ from 'lodash'

import 'should'

import Resource from '../lib/resource'
import models from './models/'

const debug = logger('koa-sequelize-resource:test:models')

describe ('model routers', function () {

  let server

  before (function () {

    
    let app = new Koa()
      , user = new Resource(models.User)
      , router = Router()
      , bodyparser = BodyParser()
    
    router.get('/user', user.readAll())
    router.get('/user/:id', user.readOne())
    router.post('/user', user.create())
    router.patch('/user/:id', user.update())
    router.delete('/user/:id', user.destroy())

    app
      .use(convert(bodyparser))
      .use(async (ctx, next) => {
        await router.routes()(ctx, next)
      })

    server = request(http.createServer(app.callback()))
  })

  beforeEach (function (done) {

    models.loadMockData().then(() => {
      debug('reset db done')
      done()
    }).catch(done)  

  })

  describe('GET', () => {
    it('read all should 200 and is array', done => {
      debug('get collection')
      server
        .get('/user')
        .expect(200)
        .end((err, res) => {
          if (err) throw done(err)
          let body = res.body
          assert(Array.isArray(body))
          assert(body.length === 4)
          done()
        })
    })

    it('read one should 200 and is object', done => {
      server
        .get('/user/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw new Error(err)
          assert(_.isObject(res.body))
          done()
        })
    })

    it('should 204', done => {
      server
        .get('/user/0')
        .expect(204, done)
    })
  })

  describe('POST', () => {
    it('create should be 201 and encrypt password', done => {
      server
        .post('/user')
        .type('form')
        .send({ name: 'Bill', email: 'bill@who.com', password: '123456'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) throw done(err)
          assert(res.body.password !== '123456')
          done()
        })
    })
    
    it('create duplicated name should be 409', done => {
      server
        .post('/user')
        .type('form')
        .send({ name: 'Donna', email: 'dona@who.com', password: '123456'})
        .expect(409, done)
    })
  })

  describe('PATCH', () => {
    it('update should be 200', done => {
      server
        .patch('/user/1')
        .type('form')
        .send({ name: 'Jobs', email: 'jobs@who.com', password: '123456'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

    it('update duplicated name should be 409', done => {
      server
        .patch('/user/1')
        .type('form')
        .send({ name: 'Donna', email: 'donna@who.com', password: '123456'})
        .expect(409, done)
    })

    it('update not found should be 204', done => {
      server
        .patch('/user/0')
        .type('form')
        .send({ name: 'Donna', email: 'donna@who.com', password: '123456'})
        .expect(204, done)
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