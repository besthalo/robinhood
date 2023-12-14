const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const path = require("path");
const dayjs = require("dayjs");
// const keyPath = path.join(__dirname, "../configs/");
// let privateKey = fs.readFileSync(keyPath + "jwtRS256.key");
let SecretKEY = `NtXNSh2Rnp0Ak0CMdPBQPnav95bfR6NyrO0XNKsYo49RVDYNe4UPfXSngU1mTdIUVK56jMzCmN7XCrrZIJxH2QH3ec4alQ238CCLDcXEApi6AhNchwG6xtt9xtMScspD`;
// const config = process.env;

const verifyTokenMiddleware = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      msgRes: {
        msgCode: "403",
        msgDesc: "A token is required for authentication",
      },
    });
  }
  try {
    const decoded = verifyToken(token, req.body);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      msgRes: {
        msgCode: "401",
        msgDesc: "Invalid Token",
      },
      errData: {
        errMsg: err.name,
      },
    });
  }
  return next();
};

const verifyToken = (token) => {
  try {
    token = removeBearer(token);
    let headers_token = token.split(".")[0];
    let headersJWT = Buffer.from(headers_token, "base64").toString("utf8");
    let headersJWT_JSON = JSON.parse(headersJWT);
    let decoded;
    if (headersJWT_JSON.alg == "RS256") {
      // Verify with privateKEY
      // decoded = jwt.verify(token, privateKey);
    } else if (headersJWT_JSON.alg == "HS256") {
      decoded = jwt.verify(token, SecretKEY);
      // verify with SecretKEY
    } else {
      throw new Error("Not support This JWT");
    }
    // decoded = jwt.verify(token, privateKey);
    // let

    return decoded;
  } catch (err) {
    throw err;
  }
  // return next();
};

const signTokenSecretKey = (user, timeNow, expireIn = 24) => {
  //   let SecretKEY = `${data.channel}${data.channel.length}${data.APP_NO1}${data.APP_NO1.length}${data.transactionDateTime}${data.transactionUnixTime}`;

  let exp = dayjs(timeNow.valueOf()).add(expireIn, "hour");
  let users = user.dataValues;
  return new Promise((resolve) => {
    let JWT = jwt.sign(
      {
        uid: users.uid,
        email: users.email,
        phone: users.phone,
        display_name: users.display_name,
        exp: exp.unix(),
        iat: timeNow.unix(),
        time_stamp: timeNow.valueOf(),
      },
      SecretKEY
    );
    // return;
    resolve({ token: JWT, exp: exp.unix() });
  });
};

function removeBearer(text) {
  if (
    (text[0] === "b" || text[0] === "B") &&
    text.substring(1, 7) === "earer "
  ) {
    return text.substring(7);
  }
  return text;
}

module.exports = {
  removeBearer,
  verifyToken,
  verifyTokenMiddleware,
  signTokenSecretKey,
};
