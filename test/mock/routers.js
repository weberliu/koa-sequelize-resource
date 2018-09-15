import Router from '../../src/'
import models from '../models/'

const router = Router(models)

router
  // .define('user', (resources) => ({
  //   all: resources.User.all(),
  //   create: resources.User.create(),
  // }))

  // .define('user/:id', (resources) => ({
  //   item: resources.User.item(),
  //   update: resources.User.update(),
  //   destroy: resources.User.destroy(),
  // }))

  // .define('user/:uid/profile', (resources) => ({
  //   item: resources.User.relations('Profile', 'uid').item(),
  //   create: resources.User.relations('Profile', 'uid').create(),
  //   update: resources.User.relations('Profile', 'uid').update(),
  //   destroy: resources.User.relations('Profile', 'uid').destroy(),
  // }))

  // .define('user/:uid/posts', (resources) => ({
  //   all: resources.User.relations('Posts', 'uid').all(),
  //   create: resources.User.relations('Posts', 'uid').create(),
  // }))

  // .define('user/:uid/posts/:id', (resources) => ({
  //   update: resources.User.relations('Posts', 'uid').update(),
  //   destroy: resources.User.relations('Posts', 'uid').destroy(),
  // }))

  // .crud('/posts', (resources) => resources.Post)

export default router
