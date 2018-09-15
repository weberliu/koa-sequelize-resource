
module.exports = function (sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
    // userId: DataTypes.INTEGER,
    avatar: DataTypes.STRING
  }, {
    indexes: [{
      type: 'unique',
      /* Name is important for unique index */
      name: 'user_userid_unique',
      fields: ['userId']
    }]
  })

  return Profile
}
