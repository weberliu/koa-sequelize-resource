import _ from 'lodash'
import inflection from 'inflection'

import Resource from './resource'
import debuger from 'debug'

const debug = debuger('ksr:associations')

export default class AssociationResource extends Resource {
  constructor (parent, association, parentOptions, childOptions) {
    super(association.target || null, childOptions)

    this.alias = association.as
    this.associationType = association.associationType
    this.isMany = this.associationType === 'HasMany' || this.associationType === 'BelongsToMany'
    this.parent = new Resource(parent, parentOptions)

    const capitalize = inflection.capitalize(this.alias)

    this.setMethod = 'set' + capitalize
    this.getMethod = (this.isMany)
      ? 'get' + inflection.pluralize(capitalize)
      : 'get' + capitalize

    this.addMethod = 'add' + capitalize
  }

  _fetchParent () {
    const that = this
    return async (ctx, next) => {
      if (!ctx.state.instance) {
        ctx.status = 204
        return true
      } else {
        ctx.state.parent = ctx.state.instance

        if (that.isMany) {
          ctx.state.collection = ctx.state.parent[that.getMethod]
        }

        await next()
      }
    }
  }

  all (options = {}) {
    const that = this

    return [
      that.parent.getEntity(),
      that._fetchParent(),

      async (ctx, next) => {
        let { query, sortedBy, pagination } = that._buildQuery(ctx)

        debug('Association query: ', query)

        ctx.state.instances = await ctx.state.parent[that.getMethod](query)

        if (!_.isEmpty(pagination)) {
          const countMethod = 'count' + inflection.capitalize(that.alias)
          const count = options && options.disableCount
            ? ctx.state.instances.length
            : await ctx.state.parent[countMethod](query)

          pagination = this._buildPagination(options.disableCount, count, pagination)
        }

        await next()

        ctx.body = {
          items: ctx.state.instances,
          metadata: { pagination, sortedBy }
        }
      }
    ]
  }

  item () {
    return [
      this.parent.getEntity({model: this.model, as: this.alias}),
      this._fetchParent(),

      async (ctx, next) => {
        ctx.state.instance = ctx.state.parent[this.alias]

        await next()

        ctx.status = 200
        ctx.body = ctx.state.instance
      }
    ]
  }

  create () {
    const that = this

    return [
      that.parent.getEntity({model: that.model, as: that.alias}),
      that._fetchParent(),

      async (ctx, next) => {
        const newInstance = that.model.build(ctx.request.body)
        const promise = that.isMany
          ? ctx.state.parent[that.addMethod](newInstance)
          : ctx.state.parent[that.setMethod](newInstance)

        await promise
          .then(res => that._createdHandler(res, ctx, next))
          .catch(err => that._errorHandler(err, ctx))
      }
    ]
  }

  update () {
    const that = this

    const updateOne = async (ctx, next) => {
      const newInstance = that.model.build(ctx.request.body)
      await ctx.state.parent[that.setMethod](newInstance)
        .then(res => that._updatedHandler(res, ctx, next))
        .catch(err => that._errorHandler(err, ctx))
    }

    let fn = [
      that.parent.getEntity({model: that.model, as: that.alias}),
      that._fetchParent()
    ]

    if (that.isMany) {
      fn.push(that._fetchOne())
      fn.push(super.update())
    } else {
      fn.push(updateOne)
    }

    return fn
  }

  destroy () {
    const that = this

    let fn = [
      this.parent.getEntity({model: this.model, as: this.alias}),
      this._fetchParent()
    ]

    const destoryOne = async (ctx, next) => {
      ctx.state.instance = ctx.state.parent[this.alias]

      await ctx.state.instance.destroy()
      await next()

      ctx.status = 204
    }

    if (this.isMany) {
      fn.push(that._fetchOne())
      fn.push(super.destroy())
    } else {
      fn.push(destoryOne)
    }

    return fn
  }

  _fetchOne () {
    const that = this

    return async (ctx, next) => {
      const fn = 'get' + inflection.capitalize(that.alias)
      const instances = await ctx.state.parent[fn]({where: {[that.options.idColumn]: ctx.params[that.options.idParam]}})

      if (instances.length > 0) {
        ctx.state.instance = instances[0]
        await next()
      } else {
        ctx.status = 204
      }
    }
  }
}
