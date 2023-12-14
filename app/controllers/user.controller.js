const userService = require("../services/userService");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);


// CREATE USER
async function createUser(req, res) {
  let userObject = req.body;
  let decodeToken = req["decodeToken"];

  // TODO CHANGE Logic new User
  // GET USER DETAIL
  try {
    let { result: resultUser, err } = await userService.getUserByUsername(
      userObject.username
    );
    if(err) throw err
    if (resultUser) {
      if (resultUser.is_delete != "1") {
        return res.status(400).send({
          msgRes: {
            msgCode: "0400",
            msgDesc: "Bad Request, User is Duplicate",
          },
        });
      }
    }
  } catch (error) {
    // console.log(error)
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
    });
    // wil send error detail to application log or console.error(error)
  }
  let { error, _ } = await userService.createNewUser(
    userObject,
    decodeToken?.uid || null
  );
  if (error) {
    res.send({
      msgRes: {
        msgCode: "0001",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error,
      },
    });
  } else {
    res.send({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
    });
  }
}


module.exports = {
  createUser,
};
