'use strict';

import _ from 'lodash'
import debug from 'debug'
import Sequelize from 'sequelize'

import ContentRange from './content-range'

const log = debug('koa-sequelize-resource:resources')

export default class Resource
{
  constructor(model, options) {
    this.model = model

    if (_.isString(options)) {
      options = { idParam: options }
    }

    this.options = {
      idParam: 'id', 
      idColumn: 'id', 
      ...options
    }
  }

  _errorHandler(err, ctx) {
    const e = _.cloneDeep(err)

    if (e.sql) {
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
      }
    } else {
      e.statusCode = 500
    }

    ctx.status = e.statusCode
    ctx.body = e
  }

  // TODO: remove include
  async _getEntity(ctx, include) {
    // Fetch the entity
    return this.model.findOne({
      where: { [this.options.idColumn] : ctx.params[this.options.idParam] },
      include: include
    })
  }

  async _updatedHandler(res, ctx, next) {
    log(`Updated ${this.model.name} ${ctx.state.instance}`);

    ctx.state.instance = res
    await next()
    ctx.status = 200
    ctx.body = ctx.state.instance
  }

  async _createdHandler(res, ctx, next) {
    log(`Created ${this.model.name} ${res}`);

    ctx.state.instance = res
    await next()
    ctx.status = 201
    ctx.body = ctx.state.instance
  }

  getEntity(include) {
    let that = this
    return async (ctx, next) => {
      ctx.state.instance = await that._getEntity(ctx, include)
      log(`Loaded ${that.model.name} ${ctx.state.instance}`)

      await next();
    };
  }

  create() {
    let that = this;

    return async (ctx, next) => {
      await that.model.create(ctx.request.body)
        .then(res => that._createdHandler(res, ctx, next))
        .catch(err => that._errorHandler(err, ctx)) 
    }
  }

  update(options) {
    let that = this;

    return async (ctx, next) => {
      const instance = ctx.state.instance || await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.update(ctx.request.body, options)
        .then(res => that._updatedHandler(res, ctx, next))
        .catch(err => that._errorHandler(err, ctx))
    };
  }

  destroy() {
    let that = this;

    return async (ctx, next) => {
      const instance = ctx.state.instance || await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.destroy()

      log(`Deleted ${that.model.name} ${instance}`)

      ctx.state.instance = instance
      await next()
      ctx.status = 204
    };
  }
  
  show(include) {
    let that = this;

    return async (ctx, next) => {
      // ctx.state.instance = await that._getEntity(ctx, [{ all: true }])
      ctx.state.instance = await that._getEntity(ctx, include)

      if (ctx.state.instance === null) {
        ctx.status = 204

        return
      }

      await next()

      ctx.status = 200;
      ctx.body = ctx.state.instance;
    }
  }

  _buildQuery(ctx) {
    let query = {}

    // parse query 
    if (!_.isEmpty(ctx.request.query)) {
      const originalQuery = _.clone(ctx.request.query)

      if (_.has(originalQuery, 'orderby')) {
        const order = originalQuery.orderby.substr(0, 1) == '-'
                      ? originalQuery.orderby.substr(1) + ' DESC'
                      : originalQuery.orderby

        delete originalQuery.orderby

        query = _.merge(query, { order: order })
      }

      let where = this.model.where && _.isFunction(this.model.where)
                  ? this.model.where(originalQuery)
                  : originalQuery

      if (!_.isEmpty(where)) query = _.merge(query, { where: where })
    }

    return query
  }

  index(options = {}) {
    let that = this;

    return async (ctx, next) => {
      
      let query = that._buildQuery(ctx)
          
      // parse pagination header
      const range = new ContentRange(ctx.header['content-range'])
      const pagination = range.parse()
      
      query = _.merge(query, pagination)

      log('Read collection:', query)

      if (!_.isEmpty(pagination)) {
        if (options.disableCount) {
          ctx.state.instances = await that.model.findAll(query)
          ctx.set('content-range', range.format(ctx.state.instances.length))
        } else {
          const result = await that.model.findAndCount(query)
          ctx.state.instances = result.rows
          ctx.set('content-range', range.format(result.rows.length, result.count))
        }
      } else {
        ctx.state.instances = await that.model.findAll(query)
      }

      await next()

      ctx.status = 200;
      ctx.body = ctx.state.instances
    }
  }

  readAll(options = {}) {
    return this.index(options)
  }

  readOne(include) {
    return this.readOne(include)
  }

  hasOne(name, parentOptions, childOptions) {
    const AssociationResource = require('./association-resource')
    const association = this.model.associations[name]

    if (association === undefined) {
      throw new Error(`Cannot found the associations named "${name}".`)
    }

    const resource = new AssociationResource(this.model, association, parentOptions, childOptions)
    
    return resource
  }

}
