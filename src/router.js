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
  router.define = (path, fn) => {
    const routers = fn(resources)

    for (let k in routers) {
      const method = methods[k]
      let middlewares = routers[k]

      if (!_.isArray(middlewares)) { 
        middlewares = [middlewares]
      }

      if (path.substr(0, 1) !== '/') path = '/' + path
      const paths = path.split('/').slice(1)
      
      let url
      if (paths.length  == 1) {
        url = _.includes(['show', 'update', 'destroy'], k) ? path + '/:id' : path
      } else {
        paths.forEach((p, i) => {
          if (p.substr(0, 1) == ':') {
            // TODO: get parent instance
            // TODO: cannot be 'id'
          }
        })

        url = path 
      }
      
      router[methods[k]](url, ...middlewares)
    }

    return router
  }

  return router
}