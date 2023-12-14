// import controller
const {
  getTaskList,
  postTask,
  cardDetail,
  putCard,
  patchCard,
  cardChangeHistory,
} = require("./controllers/taskList.controller");
const { authentication } = require("./controllers/authorize.controller");

// import validator
const { validateMiddleware } = require("./validations/validationHandle");
const {
  ruleOfAuthentication,
} = require("./validations/authenticationValidator");

const {
  ruleOfPostTask,
  ruleOfPutTask,
  ruleOfGetTask,
  ruleOfPatchTask,
} = require("./validations/taskValidator");

const { createUser } = require("./controllers/user.controller");
const { ruleOfCreateUser } = require("./validations/userValidator");

const {
  validateJWTToken: jwtValidate,
} = require("./middlewares/authorization");
const { ruleOfPostComment } = require("./validations/commentValidate");
const {
  postComment,
  putComment,
  getComment,
} = require("./controllers/comment.controller");

module.exports = (app) => {
  app.post("/auth", ruleOfAuthentication, validateMiddleware, authentication);

  app.use(jwtValidate);

  app.post("/user", ruleOfCreateUser, validateMiddleware, createUser);
  app.get("/cards", ruleOfGetTask, validateMiddleware, getTaskList);
  app.post("/card", ruleOfPostTask, validateMiddleware, postTask);
  app.put("/card/:id", ruleOfPutTask, validateMiddleware, putCard);
  app.get("/card/:id", cardDetail);

  //use patch for archive only
  app.patch("/card/:id", patchCard);

  app.get("/card/:id/history", cardChangeHistory);

  //Comment
  app.get("/card/:id/comment", getComment);

  app.post(
    "/card/:id/comment",
    ruleOfPostComment,
    validateMiddleware,
    postComment
  );

  app.put(
    "/card/:id/comment/:comment_id",
    ruleOfPostComment,
    validateMiddleware,
    putComment
  );

  app.use("*", (req, res) => {
    res.status(404).send({
      code: 404,
      message: "Not Found",
      path: req.originalUrl,
      method: req.method,
    });
  });
};
