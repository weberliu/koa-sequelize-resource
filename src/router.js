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
   * @path  String            url path
   * @fn    Array|Function    middlewares
   * 
   * @return Object
   */
  router.define = (url, fn) => {
    const routers = fn(resources)

    for (let k in routers) {
      const method = methods[k]
      let middlewares = routers[k]

      if (!_.isArray(middlewares)) { 
        middlewares = [middlewares]
      }

      if (!_.startsWith(url, '/')) url = '/' + url

      log('define routers: ', method, url)
      router[method](url, ...middlewares)
    }

    return router
  }

  router.crud = (path, fn) => {
    const resource = fn(resources)
    const isAssociation = resource.constructor.name == 'AssociationResource'
    
    if (!_.startsWith(path, '/')) path = '/' + path

    for (let k in methods) {
      let url = (['show', 'update', 'destroy'].indexOf(k) > -1 && (!isAssociation || (isAssociation && resource.isMany))) 
                  ? `${path}/:id`
                  : path
      
      let middlewares = resource[k]()

      if (!_.isArray(middlewares)) middlewares = [middlewares]
      
      log('curd routers: ', methods[k], url)
      router[methods[k]](url, ...middlewares)
    }

    return router
  }

  return router
}