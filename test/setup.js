'use strict';

import logger from 'debug'
import models from './models/'

const debug = logger('koa-sequelize-resource:test:setup')

before ('database setup', function (done) {

  let sequelize = models.sequelize

  models.loadMockData().then(res => {
    debug(res);
    done()
  }).catch(done)

})