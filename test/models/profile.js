'use strict';

import debug from 'debug'
import _ from 'lodash'

const log = debug('koa-sequelize-resource:test:profile')

module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
    userId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
  }, {
    indexes: [{
      type: 'unique',
      /* Name is important for unique index */
      name: 'user_userid_unique',
      fields: ['userId']
    }],
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  })


  return Profile;
};