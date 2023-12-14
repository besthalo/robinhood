const taskService = require("../services/taskService");
const changeLogService = require("../services/changeLogService");

async function getTaskList(req, res) {
  let { limit, page } = req.query;
  limit = limit || 10
  page = page || 1
  try {
    let { data, total, error } = await taskService.getCardLists(limit, page);
    // console.log(result);
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
    // console.log(error);
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
    });
  }
}

async function postTask(req, res) {
  let toppicData = req.body;
  let decodeToken = req.decodeToken;
  try {
    let result = await taskService.createCard(toppicData, decodeToken["uid"]);
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

async function cardDetail(req, res) {
  let cardId = req.params.id;
  // GET DETAIL
  let { result, error } = await taskService.getCardDetail(cardId);

  if (error) {
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
    });
  }
  if (!result) {
    return res.status(400).send({
      msgRes: "0400",
      msgDesc: "Bad Request, Card does not exist",
    });
  }

  return res.json({
    msgRes: { msgCode: "0000", msgDesc: "success" },
    data: result,
  });
}

async function cardChangeHistory(req, res) {
  let cardId = req.params.id;
  try {
    let { data, error } = await changeLogService.getList(cardId);
    return res.status(200).send({
      msgRes: {
        msgCode: "0000",
        msgDesc: "Success",
      },
      data,
    });
  } catch (error) {
    return res.status(500).send({
      msgRes: {
        msgCode: "0500",
        msgDesc: "Internal Server Error",
      },
      errorDetail: { error },
    });
  }
}

async function putCard(req, res) {
  let toppicData = req.body;
  let cardId = req.params.id;
  let decodeToken = req.decodeToken;
  try {
    // GET DETAIL
    let { result: resultOldCard, error } = await taskService.getCardDetail(
      cardId
    );

    if (error) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Internal Server Error",
        },
      });
    }
    if (!resultOldCard) {
      return res.status(400).send({
        msgRes: "0400",
        msgDesc: "Bad Request, Card does not exist",
      });
    }

    if (resultOldCard.archive_status == 1) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Card is Archive",
        },
      });
    }

    //buildChangeLo
    const changeLog = {
      t_id: cardId,
      old_title: resultOldCard.title,
      new_title: toppicData.title,
      old_detail: resultOldCard.detail,
      new_detail: toppicData.detail,
      old_status: resultOldCard.status,
      new_status: toppicData.status,
      change_by_uid: decodeToken["uid"],
    };

    let updateData = Object.assign({}, resultOldCard, toppicData);
    let { result, error: errorUpdate } = await taskService.updateCard(
      updateData,
      cardId,
      decodeToken["uid"]
    );
    if (errorUpdate) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0002",
          msgDesc: "Update Card Error",
        },
        errorDetail: { errorUpdate },
      });
    }
    if (result) {
      taskService.saveChangeLog(changeLog).then(({ result, error }) => {
        // TODO will continue like application log or send to kafka for process again
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

async function patchCard(req, res) {
  let cardId = req.params.id;
  let decodeToken = req.decodeToken;
  try {
    // GET DETAIL
    let { result: resultOldCard, error } = await taskService.getCardDetail(
      cardId
    );

    if (error) {
      return res.status(500).send({
        msgRes: {
          msgCode: "0500",
          msgDesc: "Internal Server Error",
        },
      });
    }
    if (!resultOldCard) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Card does not exist",
        },
      });
    }

    if (resultOldCard.archive_status == 1) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0400",
          msgDesc: "Bad Request, Card Already Archive",
        },
      });
    }

    const patchData = {
      t_id: cardId,
      archive: 1,
    };
    let { result, error: errorUpdate } = await taskService.archiveCard(
      patchData,
      cardId,
      decodeToken["uid"]
    );
    if (errorUpdate) {
      return res.status(400).send({
        msgRes: {
          msgCode: "0002",
          msgDesc: "Update Card Error",
        },
        errorDetail: { errorUpdate },
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
  getTaskList,
  postTask,
  putCard,
  cardDetail,
  patchCard,
  cardChangeHistory,
};
