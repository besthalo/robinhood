const {DataTypes} = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('task', {
    t_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    create_by_uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    create_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_by_uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    update_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "1=To Do, 2=In Progress, 3=Done\r\n"
    },
    archive: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "0=not,1=archive"
    },
    archive_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'task',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "t_id" },
        ]
      },
      {
        name: "create_by_uid",
        using: "BTREE",
        fields: [
          { name: "create_by_uid" },
        ]
      },
      {
        name: "archive",
        using: "BTREE",
        fields: [
          { name: "archive" },
        ]
      },
      {
        name: "status",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
