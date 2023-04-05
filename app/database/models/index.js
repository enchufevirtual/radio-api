const { Admin, AdminSchema} = require("./admin.model.js");
const { User, UserSchema } = require("./user.model.js");
const { Social, SocialSchema } = require("./social.model.js");

const setupModels = (sequelize) => {
  Admin.init(AdminSchema, Admin.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  Social.init(SocialSchema, Social.config(sequelize));

  Admin.associate(sequelize.models);
  User.associate(sequelize.models);
  Social.associate(sequelize.models);
}

module.exports = { setupModels }