import Router from '../../src/'
import models from '../models/'

const router = Router(models)

router
  .define('user', (resources) => ({
    index: resources.User.index(),
    create: resources.User.create(),
  }))

  .define('user/:id', (resources) => ({
    show: resources.User.show(),
    update: resources.User.update(),
    destroy: resources.User.destroy(),
  }))

  .define('user/:uid/profile', (resources) => ({
    show: resources.User.relations('Profile', 'uid').show(),
    create: resources.User.relations('Profile', 'uid').create(),
    update: resources.User.relations('Profile', 'uid').update(),
    destroy: resources.User.relations('Profile', 'uid').destroy(),
  }))

  .define('user/:uid/posts', (resources) => ({
    index: resources.User.relations('Posts', 'uid').index(),
    create: resources.User.relations('Posts', 'uid').create(),
  }))

  .define('user/:uid/posts/:id', (resources) => ({
    update: resources.User.relations('Posts', 'uid').update(),
    destroy: resources.User.relations('Posts', 'uid').destroy(),
  }))

  .crud('/posts', (resources) => resources.Post)

export default router
