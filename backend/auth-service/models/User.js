const { DataTypes } = require("sequelize");
const sequelize = require("../services/sequelizeService");
const { ROLES } = require("../config/constants");
const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ROLES.USER,
    },
  },
  { timestamps: true, paranoid: true }
);

module.exports = User;
