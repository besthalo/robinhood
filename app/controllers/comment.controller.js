const commentService = require("../services/commentService");
const taskService = require("../services/taskService");

async function checkCardStatus(cardId) {
  // GET DETAIL
  let { result: resultCard, error: errorCard } =
    await taskService.getCardDetail(cardId);

  if (errorCard) {
    return {
      error: {
        msgRes: {
          msgCode: "0500",
          msgDesc: "Internal Server Error",
        },
      },
    };
    // wil send error detail to application log or console.error(error)
  }
  if (!resultCard) {
    return {
      error: {
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Card does not exist",
        },
      },
    };
  }

  if (resultCard.archive_status == 1) {
    return {
      error: {
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Card was archive",
        },
      },
    };
  }
  return { error: null };
}

async function postComment(req, res) {
  let cardId = req.params.id;
  let commentBody = req.body;
  let decodeToken = req.decodeToken;
  try {
    let { error: errorCard } = await checkCardStatus(cardId);
    if (errorCard) {
      return res.status(400).send(errorCard);
    }

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
    let { error: errorCard } = await checkCardStatus(cardId);
    if (errorCard) {
      return res.status(400).send(errorCard);
    }
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
    // GET DETAIL
    let { error: errorCard } = await checkCardStatus(cardId);
    if (errorCard) {
      return res.status(400).send(errorCard);
    }
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
    let { error: errorCard } = await checkCardStatus(cardId);
    if (errorCard) {
      return res.status(400).send(errorCard);
    }
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
