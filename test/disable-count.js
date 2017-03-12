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

const debug = logger('koa-sequelize-resource:test:disable-count')

describe ('diable count', function () {

  let server

  before (function () {
    let app = new Koa()
      , user = new Resource(models.User)
      , router = Router()
    
    router.get('/user', user.readAll({
      disableCount: true,
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
        .expect(200, done)
    })
  })
})