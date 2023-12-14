const sequelize = require("sequelize");

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

const _changeLog = require("./changeLog");
const _task = require("./task");
const _taskComment = require("./taskComment");
const _user = require("./user");

dayjs.extend(timezone);
dayjs.extend(utc);

sequelize.DataTypes.DATE.prototype._stringify = function _stringify(
  date,
  options
) {
  return dayjs(date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss.SSS");
};

const DB_NAME = process.env.MYSQL_DATABASE;
const DB_HOST = process.env.MYSQL_HOST;
const DB_USERNAME = process.env.MYSQL_USER;
const DB_PASSWORD = process.env.MYSQL_PASSWORD;

const seq = new sequelize.Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: `${DB_HOST}`,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  logging: process.env.NODE_ENV != "production",
});

const db = {};
db.Sequelize = sequelize.Sequelize;
db.sequelize = seq;

db.user = require("./user")(seq);
db.task = require("./task")(seq);
db.changeLog = require("./changeLog")(seq);
db.comment = require("./taskComment")(seq);

// docker run --name test2 -p 3000:3000 --env DB_NAME=Robinhood --env DB_USERNAME=root --env DB_PASSWORD=S3cret --env DB_HOST=172.19.0.2 nn2
// RELATION DB
db.task.belongsTo(db.user, { foreignKey: "create_by_uid" });
db.changeLog.belongsTo(db.task, { foreignKey: "t_id" });
db.comment.belongsTo(db.user, { foreignKey: "create_by_uid" });
module.exports = db;
