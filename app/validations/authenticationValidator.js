const { body } = require("express-validator");


const ruleOfAuthentication = [
    body('username').notEmpty().withMessage('username is required').bail().isString().withMessage('username must be string').bail(),
    body('password').notEmpty().withMessage('password is required').bail().isString().withMessage('password must be string').bail()
]

module.exports = {
    ruleOfAuthentication
}