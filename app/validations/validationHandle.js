
const { validationResult } = require("express-validator");
const fs = require("fs");

const errorFormat = ({ msg }) => msg;

const validateMiddleware = (req, res, next) => {
  // Validate the request using express-validator
  const errors = validationResult(req).formatWith(errorFormat);

  // Check if there are any validation errors
  if (!errors.isEmpty()) {
    let firstError = errors.array()[0];
    return res
      .status(400)
      .json({
        msgRes: {
          msgCode: 400,
          msgDesc: `Bad Request, ${firstError}`,
        },
      })
  }

  // If there are no errors, proceed to the next middleware
  next();
};

module.exports = {
  validateMiddleware,
};
