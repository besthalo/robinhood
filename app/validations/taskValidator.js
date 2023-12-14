const { body, query, check } = require("express-validator");

const ruleOfPostTask = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("title can not exceed 255 character"),
  body("detail").notEmpty().withMessage("detail is required").bail(),
];

const ruleOfPutTask = ruleOfPostTask.concat([
  body("status").isIn([1, 2, 3]).withMessage("status is invalid"),
]);

const ruleOfGetTask = [
  check("page")
    .default(1)
    .if(query("page").not().isEmpty())
    .isInt()
    .withMessage("page must be integer")
    .bail()
    .toInt(),
  check("limit")
    .default(10)
    .if(query("limit").not().isEmpty())
    .isInt()
    .withMessage("limit must be integer")
    .bail()
    .toInt(),
];

module.exports = {
  ruleOfPostTask,
  ruleOfGetTask,
  ruleOfPutTask,
};
