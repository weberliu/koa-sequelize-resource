'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var models    = {};

import logger from 'debug'

const debug = logger('koa-sequelize-resource:test:database')

const sequelize = new Sequelize('mysql://root:123456@localhost:32775/koa_sequelize_resource#UTF8', {
  logging: debug,
  define: {
    timestamps: true,
    paranoid: true
  }
})

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
})

const reset = () => {
  return sequelize.sync({
    logging : debug,
    force   : true
  })

}

import mock from '../mock/data'

const loadMockData = () => {
  let models   = sequelize.models
    , promises = []

  return sequelize.sync({

    logging : debug,
    force   : true

  }).then(() => {
    Object.keys(models).forEach(key => {
      let data  = mock[key]
        , model = models[key]

      if (data && Array.isArray(data)) {
        promises.push(model.bulkCreate(data))
      }
    })

    return Promise.all(promises).then(() => mock)
  })
  .catch(err => debug(err))
}

module.exports = {
  sequelize, reset, loadMockData, ...models,
}