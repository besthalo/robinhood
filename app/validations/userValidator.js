const { body } = require("express-validator");

const checkTypeNumber = (value) => {
  if (typeof value != "number") {
    throw new Error("Not number");
  }
  return true;
};

const ruleOfCreateUser = [
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .bail()
    .isString()
    .withMessage("username must be a string")
    .bail()
    .matches(/^[a-zA-Z0-9.]+$/)
    .withMessage("username must only a-z,A-Z,0-9 and dot('.')")
    .bail()
    .isLength({ min: 4, max: 20 })
    .withMessage("username must be between 4-20 characters.")
    .bail()
    .customSanitizer((v) => v.toLowerCase()),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be a string")
    .bail()
    .isLength({ max: 20 })
    .withMessage("password must not exceed 20 characters.")
    .bail(),
  body("display_name")
    .notEmpty()
    .withMessage("display_name is required")
    .bail()
    .isString()
    .withMessage("display_name must be a string")
    .bail()
    .isLength({ max: 20 })
    .withMessage("display_name must not exceed 20 characters.")
    .bail(),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isString()
    .withMessage("email must be a string")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .isLength({ max: 255 })
    .withMessage("email must not exceed 255 characters.")
    .bail(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .custom(checkTypeNumber)
    .withMessage("Status is invalid")
    .bail()
    .isIn([0, 1])
    .withMessage("Invalid Status")
    .bail(),
];

module.exports = {
  ruleOfCreateUser,
};
