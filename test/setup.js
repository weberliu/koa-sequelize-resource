import models from './models/'

before('database setup', function (done) {
  models.loadMockData().then(res => {
    done()
  }).catch(done)
})
