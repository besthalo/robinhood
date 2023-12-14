const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "user",
    {
      uid: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "username",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "0=inactive,1=inactive",
      },
      create_by_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      create_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      update_by_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      update_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_delete: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "1=deleted,0 or null is not delete",
      },
      delete_by_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      delete_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "uid" }],
        },
        {
          name: "username",
          unique: true,
          using: "BTREE",
          fields: [{ name: "username" }],
        },
        {
          name: "status",
          using: "BTREE",
          fields: [{ name: "status" }],
        },
        {
          name: "role",
          using: "BTREE",
          fields: [{ name: "role" }],
        },
        {
          name: "is_delete",
          using: "BTREE",
          fields: [{ name: "is_delete" }],
        },
        {
          name: "gender",
          using: "BTREE",
          fields: [{ name: "gender" }],
        },
        {
          name: "email",
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    }
  );
};
