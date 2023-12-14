const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "task_comment",
    {
      tc_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      t_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      create_by_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      create_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
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
      delete_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "task_comment",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "tc_id" }],
        },
        {
          name: "task_id",
          using: "BTREE",
          fields: [{ name: "t_id" }],
        },
        {
          name: "create_by_uid",
          using: "BTREE",
          fields: [{ name: "create_by_uid" }],
        },
      ],
    }
  );
};
