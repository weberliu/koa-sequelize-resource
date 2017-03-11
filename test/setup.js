'use strict';

import models from './models/'

before ('database setup', function (done) {

  let sequelize = models.sequelize

  models.loadMockData().then(res => {
    done()
  }).catch(done)

})