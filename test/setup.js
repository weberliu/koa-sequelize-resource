import { loadMockData } from './models/'

before('database setup', function (done) {
  loadMockData().then(res => {
    done()
  }).catch(done)
})
