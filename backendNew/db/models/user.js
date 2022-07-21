'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, firstName, lastName, email } = this;
      return { id, firstName, lastName, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }
    static associate(models) {
      User.hasMany(
        models.Spot,
        { foreignKey: "ownerId" }
      )
      User.hasMany(
        models.Review,
        { foreignKey: "userId" }
      )
      User.hasMany(
        models.Booking,
        { foreignKey: "userId" }
      )
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      isNotEmail(value) {
        if (Validator.isEmail(value)) {
          throw new Error("Cannot be an email.");
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      isNotEmail(value) {
        if (Validator.isEmail(value)) {
          throw new Error("Cannot be an email.");
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          len: [3, 256]
        }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
