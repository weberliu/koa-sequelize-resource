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
    show: resources.User.hasOne('Profile', 'uid').show(),
    create: resources.User.hasOne('Profile', 'uid').create(),
    update: resources.User.hasOne('Profile', 'uid').update(),
    destroy: resources.User.hasOne('Profile', 'uid').destroy(),
  }))

  .define('user/:uid/posts', (resources) => ({
    index: resources.User.hasOne('Posts', 'uid').index(),
    create: resources.User.hasOne('Posts', 'uid').create(),
  }))

  .define('user/:uid/posts/:id', (resources) => ({
    update: resources.User.hasOne('Posts', 'uid').update(),
    destroy: resources.User.hasOne('Posts', 'uid').destroy(),
  }))

  .crud('/posts', (resources) => resources.Post)

export default router
