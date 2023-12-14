const { body, query, check } = require("express-validator");

const ruleOfPostComment = [
  body("comment").notEmpty().withMessage("comment is required").bail(),
];

const ruleOfGetListComment = [
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
  ruleOfGetListComment,
  ruleOfPostComment,
};
