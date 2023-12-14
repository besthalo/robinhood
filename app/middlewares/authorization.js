const {verifyToken} = require("../services/authenticationService");
const dayjs = require("dayjs");

const validateJWTToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .send({
        msgRes: {
          msgCode: "0401",
          msgDesc: "Authorization is Required",
        },
      })
  }
  // let token = req.headers.authorization;
  let decodeToken;
  try {
    decodeToken = await verifyToken(token);
  } catch (error) {
    // console.log(error)
    let msgDesc = "Authorization is Invalid";
    if (error.name == "TokenExpiredError") {
      msgDesc = "Authorization Expired";
    } else if (error.name == "JsonWebTokenError") {
      msgDesc = "Authorization is invalid";
    } else if (error.name == "SyntaxError") {
      msgDesc = "Authorization is invalid format";
    }

    return res
      .status(401)
      .send({
        msgRes: {
          msgCode: "0401",
          msgDesc: msgDesc,
        },
      })
  }
  req["decodeToken"] = decodeToken;
  next();
};

module.exports = {
  validateJWTToken,
};
