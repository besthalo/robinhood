const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "change_log",
    {
      change_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      t_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      old_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      new_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      old_detail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      new_detail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      old_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      new_status: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      change_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      change_by_uid: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "change_log",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "change_id" }],
        },
        {
          name: "t_id",
          using: "BTREE",
          fields: [{ name: "t_id" }],
        },
      ],
    }
  );
};
