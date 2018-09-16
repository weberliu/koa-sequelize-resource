import _ from 'lodash'
import debuger from 'debug'

const debug = debuger('ksr:resources')

export default class Resource {
  constructor (model, options) {
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

  _errorHandler (err, ctx) {
    const e = { statusCode: 500 }

    if (err.sql) {
      const { code, errno, sqlMessage } = err.original
      switch (code) {
        case 'ER_NO_DEFAULT_FOR_FIELD':
          e.statusCode = 400
          break
        case 'ER_DUP_ENTRY':
          e.statusCode = 409
          break
        default:
          e.statusCode = 500
      }
      e.errorno = errno
      e.errmessage = sqlMessage
    }

    ctx.status = e.statusCode
    ctx.body = e
  }

  // TODO: remove include
  async _getEntity (ctx, include) {
    // Fetch the entity
    return this.model.findOne({
      where: { [this.options.idColumn]: ctx.params[this.options.idParam] },
      include: include
    })
  }

  async _updatedHandler (res, ctx, next) {
    debug(`Updated ${this.model.name} ${ctx.state.instance}`)

    ctx.state.instance = res
    await next()
    ctx.status = 200
    ctx.body = ctx.state.instance
  }

  async _createdHandler (res, ctx, next) {
    debug(`Created ${this.model.name} ${res}`)

    ctx.state.instance = res
    await next()
    ctx.status = 201
    ctx.body = ctx.state.instance
  }

  _buildQuery (ctx) {
    let query, sortedBy, pagination

    if (!_.isEmpty(ctx.request.query)) {
      const originalQuery = _.clone(ctx.request.query)

      // parse ordering
      if (_.has(originalQuery, 'sort')) {
        sortedBy = originalQuery.sort
          .split(',')
          .map(f => (f.substr(0, 1) === '-' ? [f.substr(1), 'DESC'] : f))

        debug('order by %o', sortedBy)
        delete originalQuery.sort

        query = _.merge(query, { order: sortedBy })
      }

      // parse pagination
      if (_.has(originalQuery, 'limit')) {
        const { limit, offset } = originalQuery
        pagination = { limit: parseInt(limit, 10), offset: parseInt(offset, 10) || 0 }

        query = _.merge(query, pagination)
        delete originalQuery.limit
        delete originalQuery.offset
      }

      // parse query string
      let where = this.model.filter && _.isFunction(this.model.filter)
        ? this.model.filter(originalQuery)
        : originalQuery

      if (!_.isEmpty(where)) query = _.merge(query, { where })
    }

    return { query, sortedBy, pagination }
  }

  _buildPagination (disableCount, count, pagination) {
    pagination = _.merge(pagination, { pageCount: 0, totalCount: 0 })

    if (!disableCount) {
      pagination.totalCount = count
      pagination.pageCount = Math.ceil(count / pagination.limit)
      pagination.currentPage = Math.ceil(pagination.offset / pagination.limit) + 1
    }

    let nextOffset = pagination.offset + pagination.limit
    pagination.nextOffset = (pagination.totalCount > nextOffset) ? nextOffset : 0
    pagination.prevOffset = _.max([0, pagination.limit - pagination.offset])

    return pagination
  }

  getEntity (include) {
    let that = this
    return async (ctx, next) => {
      ctx.state.instance = await that._getEntity(ctx, include)
      debug(`Loaded model: ${that.model.name}`)

      await next()
    }
  }

  create () {
    let that = this

    return async (ctx, next) => {
      await that.model.create(ctx.request.body)
        .then(res => that._createdHandler(res, ctx, next))
        .catch(err => that._errorHandler(err, ctx))
    }
  }

  update (options) {
    let that = this

    return async (ctx, next) => {
      const instance = ctx.state.instance || await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.update(ctx.request.body, options)
        .then(res => that._updatedHandler(res, ctx, next))
        .catch(err => that._errorHandler(err, ctx))
    }
  }

  destroy () {
    let that = this

    return async (ctx, next) => {
      const instance = ctx.state.instance || await that._getEntity(ctx, [])

      if (instance === null) {
        ctx.status = 204
        return
      }

      await instance.destroy()

      debug(`Deleted ${that.model.name} ${instance}`)

      ctx.state.instance = instance
      await next()
      ctx.status = 204
    }
  }

  item (include) {
    let that = this

    return async (ctx, next) => {
      ctx.state.instance = await that._getEntity(ctx, include)
      await next()

      ctx.status = (ctx.state.instance === null) ? 204 : 200
      ctx.body = ctx.state.instance
    }
  }

  all (options = {}) {
    let that = this

    return async (ctx, next) => {
      let { query, pagination, sortedBy } = this._buildQuery(ctx)

      debug('Read collection:', query)
      ctx.state.instances = await that.model.findAll(query)

      if (!_.isEmpty(pagination)) {
        let count = await that.model.count(query)
        pagination = this._buildPagination(options.disableCount, count, pagination)
      }

      await next()

      ctx.status = 200
      ctx.body = {
        items: ctx.state.instances,
        metadata: { pagination, sortedBy }
      }
    }
  }

  readAll (options = {}) {
    return this.all(options)
  }

  readOne (include) {
    return this.readOne(include)
  }

  relations (name, parentOptions, childOptions) {

    const association = this.model.associations[name]

    if (association === undefined) {
      throw new Error(`Cannot found the associations named "${name}".`)
    }

    return new AssociationResource(this.model, association, parentOptions, childOptions)
  }
}

const AssociationResource = require('./association-resource')
