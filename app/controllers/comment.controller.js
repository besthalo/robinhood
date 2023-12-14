const commentService = require("../services/commentService");

async function postComment(req, res) {
  let cardId = req.params.id;
  let commentBody = req.body;
  let decodeToken = req.decodeToken;
  try {
    let { error, result } = await commentService.createComment(
      commentBody,
      cardId,
      decodeToken["uid"]
    );

    if (error) {
      throw error;
    }
    return res.status(200).send({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
      data: {
        cardId: result.id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error,
      },
    });
  }
}

async function putComment(req, res) {
  let cardId = req.params.id;
  let commentId = req.params.comment_id;
  let commentBody = req.body;
  let decodeToken = req.decodeToken;
  try {
    let { result: resultOldComment, error: errorGetOldComment } =
      await commentService.getCommentDetail(commentId, cardId);

    if (errorGetOldComment) {
      return res.status(500).send({
        msgRes: {
          msgCode: "0500",
          msgDesc: "Internal Server Error",
        },
        errorDetail: {
          error: errorGetOldComment,
        },
      });
    }
    if (!resultOldComment) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, comment does not exist",
        },
      });
    }

    if (resultOldComment.is_delete == 1) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, comment was deleted",
        },
      });
    }
    // check is same comment user id

    if (decodeToken["uid"] != resultOldComment["create_by_uid"]) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request,  Not same user ",
        },
      });
    }

    let { error } = await commentService.updateComment(
      commentBody,
      cardId,
      commentId
    );

    if (error) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Internal Server Error (Database)",
        },
        errorDetail: {
          error,
        },
      });
    }
    return res.status(200).send({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
    });
  } catch (error) {
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error,
      },
    });
  }
}

async function getComment(req, res) {
  let cardId = req.params.id;
  let limit = req.query.limit || 10;
  let page = req.query.page || 1;
  try {
    let { data, total, error } = await commentService.getCommentList(
      cardId,
      limit,
      page
    );

    if (error) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Can not get comment list ",
        },
      });
      // wil send error detail to application log or console.error(error)
    }
    let totalPage = total > 0 ? Math.ceil(total / limit) : 0;

    return res.json({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
      pages: {
        totalPage: total > 0 ? (totalPage == 0 ? 1 : totalPage) : 0,
        totalRows: total > 0 ? total : 0,
      },
      cardLists: data,
    });
  } catch (error) {
    return res.status(500).json({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error,
      },
    });
    // wil send error detail to application log or console.error(error)
  }
}

async function deleteComment(req, res) {
  let cardId = req.params.id;
  let commentId = req.params.comment_id;
  let decodeToken = req.decodeToken;
  try {
    let { result: resultOldComment, error: errorGetOldComment } =
      await commentService.getCommentDetail(commentId, cardId);

    if (errorGetOldComment) {
      return res.status(500).send({
        msgRes: {
          msgCode: "0500",
          msgDesc: "Internal Server Error",
        },
        errorDetail: {
          error: errorGetOldComment,
        },
      });
    }
    if (!resultOldComment) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, comment does not exist",
        },
      });
    }
    // check is same comment user id

    if (decodeToken["uid"] != resultOldComment["create_by_uid"]) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Not same user ",
        },
      });
    }

    let { error } = await commentService.deleteComment(cardId, commentId);

    if (error) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Internal Server Error (Database)",
        },
        errorDetail: {
          error,
        },
      });
    }
    return res.status(200).send({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
    });
  } catch (error) {
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
      errorDetail: {
        error,
      },
    });
  }
}

module.exports = {
  postComment,
  putComment,
  getComment,
  deleteComment,
};
