import bcrypt from 'bcrypt-nodejs'
import _ from 'lodash'

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      email: {
        type: DataTypes.STRING
      }
    },
    {
      freezeTableName: true,
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
      }
    })

  User.associate = function (models) {
    // associations can be defined here
    models.User.hasOne(models.Profile, {
      constraints: false,
      foreignKey: 'userId'
    })

    models.User.hasMany(models.Post, {
      constraints: false,
      foreignKey: 'userId'
    })
  }

  User.filter = query => {
    if (_.has(query, 'name')) {
      query.name = { '$like': `%${query.name}%` }
    }
    return query
  }

  return User
}
