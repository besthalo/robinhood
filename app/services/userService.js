const { user: userModel } = require("../models");
const bcryptjs = require("bcryptjs");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

const { camelToSnake } = require("../utilities/utilities"); 

dayjs.extend(timezone);
dayjs.extend(utc);

const userColumn = [
  "username",
  "password",
  "firstName",
  "lastName",
  "email",
  "phone",
  "role",
  "status",
  "create_datetime",
  "create_by_uid",
  "display_name",
];
async function createNewUser(userObject, create_by) {
  const password_bcrypt = await bcryptjs.hash(userObject.password, 10);
  let currentDateTime = dayjs()
    .tz("Asia/Bangkok")
    .format("YYYY-MM-DD HH:mm:ss");
  // DEFind Params
  userObject["create_datetime"] = currentDateTime;
  userObject["create_by_uid"] = create_by;

  let params = {};
  for (const key of userColumn) {
    if (userObject[key] != undefined) {
      params[camelToSnake(`${key}`)] = userObject[key];
    } else {
      params[camelToSnake(`${key}`)] = null;
    }
  }
  params["password"] = password_bcrypt;
  try {
    let result = await userModel.create(params);
    console.log(result.id);
    return { result: "ok" };
  } catch (error) {

    let firstError = error.errors[0];
    if (firstError.type == "unique violation") {
      return { error: "user is duplicate" };
    }
    return { error: "unknown error" };
  }
}

async function getUserByUsername(username) {
  try {
    let result = await userModel.findOne({ where: { username: username } });
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}

function comparePassword(password, password_db) {
  return new Promise((resolve) => {
    bcryptjs.compare(password, password_db, (err, res) => {
      resolve(res);
    });
  });
}

module.exports = {
  createNewUser,
  getUserByUsername,
  comparePassword,
};
