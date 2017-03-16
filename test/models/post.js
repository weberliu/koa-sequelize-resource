'use strict';

import debug from 'debug'

const log = debug('koa-sequelize-resource:test:profile')

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    // userId: DataTypes.INTEGER,
    thread: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  })


  return Post;
};