'use strict';

import _ from 'lodash'
import logger from 'debug'
import Sequelize from 'sequelize'

const debug = logger('koa-sequelize-resource')

export default class Resouce
{
  constructor(model, options) {
    debug(model)
    if (!model instanceof Sequelize.Model) {
      throw new Error(`${model} is not instance of Sequelize model.`)
    }

    this.model = model;
    this.options = {idColumn: 'id', ...options}
  }

  _handleError(err, ctx) {
    const e = _.cloneDeep(err)

    delete e.parent
    delete e.original
    delete e.sql

    e.code = err.original.code
    
    switch(e.code) {
      case 'ER_NO_DEFAULT_FOR_FIELD':
        e.statusCode = 400
        break
      case 'ER_DUP_ENTRY':
        e.statusCode = 409
        break
      default:
        e.statusCode = 500
        throw e
    }

    ctx.status = e.statusCode
    ctx.body = e
  }

  async _getEntity(ctx, include) {
    // Fetch the entity
    return this.model.findOne({
      where: { [this.options.idColumn]: ctx.params[this.options.idColumn] },
      include
    });
  }

  getEntity(include) {
    let that = this

    return async (ctx, next) => {
      ctx.state.instance = await that._getEntity(ctx, include)
      debug(`Loaded ${that.model.name} ${ctx.state.instance}`)

      await next();
    };
  }

  create() {
    let that = this;

    return async (ctx, next) => {
      await that.model.create(ctx.request.body)
        .then(async (instance) => {
          debug(`Created ${that.model.name} ${instance}`)
          
          ctx.state.instance = instance
          await next()
          ctx.status = 201;
          ctx.body = ctx.state.instance;
        })
        .catch(err => that._handleError(err, ctx)) 
    }
  }

  readOne() {
    let that = this;

    return async (ctx, next) => {
      ctx.state.instance = await that._getEntity(ctx, [{ all: true }]);

      if (ctx.state.instance === null) {
        ctx.status = 204

        return
      }

      await next()

      ctx.status = 200;
      ctx.body = ctx.state.instance;
    };
  }

  readAll(options) {
    let that = this;

    return async (ctx, next) => {
      debug('Read collection')
      ctx.state.instances = await that.model.findAll(_.merge(ctx.state.where, options))
      
      await next()
      ctx.status = 200;
      ctx.body = ctx.state.instances
    }
  }

  update(options) {
    let that = this;

    return async (ctx, next) => {
      const instance = await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.update(ctx.request.body, options)
        .then(async res => {
          debug(`Updated ${that.model.name} ${instance}`);

          ctx.state.instance = res
          await next()
          ctx.status = 200
          ctx.body = ctx.state.instance
        })
        .catch(err => that._handleError(err, ctx))
    };
  }

  destroy() {
    let that = this;

    return async (ctx, next) => {
      const instance = await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.destroy()

      debug(`Deleted ${that.model.name} ${instance}`)

      ctx.state.instance = instance
      await next()
      ctx.status = 204
    };
  }
}
