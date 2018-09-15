import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import _ from 'lodash'
import debuger from 'debug'
import config from '../config'
import mock from '../mock/data'

const basename = path.basename(module.filename)
const models = {}

const debug = debuger('ksr:test:database')

const sequelize = new Sequelize(`mysql://${config}/koa_sequelize_resource#UTF8`, {
  logging: false,
  define: {
    timestamps: true,
    paranoid: true
  }
})

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file))
    // var k = _.lowerFirst(models.name)

    models[model.name] = model
  })

Object
  .keys(models)
  .forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })

const reset = () => {
  return sequelize.sync({
    logging: debug,
    force: true
  })
}

const loadMockData = () => {
  let models = sequelize.models
  let promises = []

  return sequelize
    .sync({
      // logging: debug,
      force: true
    })
    .then(() => {
      Object.keys(models).forEach(key => {
        let data = mock[key]
        let model = models[key]

        if (data && Array.isArray(data)) {
          debug('create ' + key)
          promises.push(model.bulkCreate(data))
        }
      })

      return Promise.all(promises).then(() => mock)
    })
    .catch(err => debug(err.message))
}

export {
  sequelize, reset, loadMockData, models as default
}
