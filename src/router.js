import _ from 'lodash'
import Router from 'koa-router'
import debug from 'debug'

import Resource from './resource'

const log = debug('koa-sequelize-resource:router')
const methods = {
  index: 'get',
  show: 'get',
  create: 'post',
  update: 'patch',
  destroy: 'delete',
}

export default function ResourceRouter (models) {
  
  let resources = {}
  for (let k in models) {
    resources[k] = new Resource(models[k])
  }

  const router = Router()

  /**
   * define a router
   * @param  {string} url - url path
   * 
   * @return {Router} this router
   */
  router.define = function define(url) {
    let others = [].slice.call(arguments, 1, -1) 

    const fn = _.last(arguments)
    const routers = fn(resources)


    for (let k in routers) {
      const method = methods[k]

      if (!method) {
        throw new Error(`"k" is not a resource method.`)
      }

      let mw = routers[k]
      let middlewares = (_.isArray(mw)) ? others.concat(mw) : others.concat([mw])

      if (!_.startsWith(url, '/')) url = '/' + url

      log('define routers: ', method, url)
      router[method](url, ...middlewares)
    }

    return router
  }

  /**
   * define create, index, show, update, destroy methods bind to resouce
   * 
   * @param {string} path - url prefix
   * @return {Router} this router
   */
  router.crud = function crud(path) {
    let others = [].slice.call(arguments, 1, -1)
    const fn = _.last(arguments)
    const resource = fn(resources)
    const isAssociation = resource.constructor.name == 'AssociationResource'
    
    if (!_.startsWith(path, '/')) path = '/' + path

    for (let k in methods) {
      let url = (['show', 'update', 'destroy'].indexOf(k) > -1 && (!isAssociation || (isAssociation && resource.isMany))) 
                  ? `${path}/:id`
                  : path
      
      let mw = resource[k]()
      let middlewares = (_.isArray(mw)) ? others.concat(mw) : others.concat([mw])

      log('curd routers: ', methods[k], url)
      router[methods[k]](url, ...middlewares)
    }

    return router
  }

  return router
}