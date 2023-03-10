const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.json")[process.env.NODE_ENV];

let sequelize = null;
module.exports.connect = () => {

  if (sequelize === null) {
    sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: process.env.NODE_ENV === "test" ? false : console.log,
    });
  }

  sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database not conected", err);
  });

  const db = {
    users: require("../models/user")(sequelize, DataTypes),
    roles: require("../models/role")(sequelize, DataTypes),
    SEQUELIZE: Sequelize,
  };

  return db;
};