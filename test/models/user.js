'use strict';

import bcrypt from 'bcrypt'
import debug from 'debug'

const log = debug('rest-router')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
    }
  }, {
    indexes: [{
      type: 'unique',
      /* Name is important for unique index */
      name: 'user_name_unique',
      fields: ['name']
    }],
    hooks: {
      beforeValidate: (user, options) => {
        if (!user.salt) {
          user.salt = bcrypt.genSaltSync(10)
        }
      },
      afterValidate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, user.salt)
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  })


  return User;
};