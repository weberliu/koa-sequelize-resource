module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    thread: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })

  return Post
}
