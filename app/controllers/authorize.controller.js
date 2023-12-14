const userService = require("../services/userService");
const authService = require("../services/authenticationService");

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

async function authentication(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // GET USER =

  const resultUser = await userService.getUserByUsername(username);

  if (resultUser.error) {
    return res.status(400).send({
      msgRes: {
        msgCode: "0001",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error:resultUser.error,
      },
    });
  }

  if (!resultUser.result) {
    return res.status(400).send({
      msgRes: {
        msgCode: "0400",
        msgDesc: "Username Or Password is invalid",
      },
    });
  }

  const user = resultUser.result;

  if (user.is_delete == 1) {
    return res.json({
      msgRes: {
        msgCode: "0401",
        msgDesc: "Authentication Failed",
      },
      errorDetail: {
        msgDesc: "User was deleted",
      },
    });
  }

  if (user.status == 0) {
    return res.json({
      msgRes: {
        msgCode: "0401",
        msgDesc: "Authentication Failed",
      },
      errorDetail: {
        msgDesc: "User is Inactive",
      },
    });
  }

  let compared = await userService.comparePassword(password, user.password); // compare password
  if (compared) {
    let timeNow = dayjs().tz("Asia/Bangkok");
    const expireIn = 24;
    let JWT = await authService.signTokenSecretKey(user, timeNow, expireIn);
    // TODO GET Configuration

    // console.log(configuration)
    return res
      .json({
        msgRes: {
          msgCode: "0000",
          msgDesc: "Success",
        },
        userInfo: {
          token: JWT.token,
          expire_at: JWT.exp,
          role: user.role,
          username: user.username,
        },
      })
  } else {
    return res
      .send({
        msgRes: {
          msgCode: "0401",
          msgDesc: "Authentication Failed",
        },
        errorDetail: {
          msgDesc: "Username or Password is invalid",
        },
      })
  }
}

module.exports = {
  authentication,
};
