import Router from '../../src/'
import models from '../models/'

const router = Router(models)

router
  .crud('/user', (resources) => resources.User)
  .crud('user/:uid/posts', (resources) => resources.User.relations('Posts', 'uid'))

export default router
