import Router from '../../src/'
import models from '../models/'

const router = Router(models)

router
  .define('user', (resources) => ({
    index: resources.User.index(),
    show: resources.User.show(),
    create: resources.User.create(),
    update: resources.User.update(),
    destroy: resources.User.destroy(),
  }))

  .define('user/:uid/profile', (resources) => ({
    show: resources.User.hasOne('Profile', 'uid').show(),
    create: resources.User.hasOne('Profile', 'uid').create(),
    update: resources.User.hasOne('Profile', 'uid').update(),
    destroy: resources.User.hasOne('Profile', 'uid').destroy(),
  }))

  .define('user/:id/posts', (resources) => ({
    index: resources.User.hasOne('Posts').index(),
  }))

export default router
