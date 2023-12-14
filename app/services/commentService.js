const { comment: commentModel } = require("../models");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

const { Op, Sequelize } = require("sequelize");

function buildQueryObject(query) {
  // let queryObject = {};
  let queryObject2 = [];
  for (const data of query) {
    let { field, operation, value } = data;
    switch (operation) {
      case "NE":
        // queryObject[field] = {
        //   [Op.ne]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.ne]: value,
          },
        });
        break;
      case "EQ":
        // queryObject[field] = {
        //   [Op.eq]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.eq]: value,
          },
        });
        break;
      case "GT":
        // queryObject[field] = {
        //   [Op.gt]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.gt]: value,
          },
        });
        break;
      case "GTE":
        // queryObject[field] = {
        //   [Op.gte]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.gte]: value,
          },
        });
        break;
      case "LT":
        // queryObject[field] = {
        //   [Op.lt]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.lt]: value,
          },
        });
        break;
      case "LTE":
        // queryObject[field] = {
        //   [Op.lte]: value,
        // };
        queryObject2.push({
          [field]: {
            [Op.lte]: value,
          },
        });
        break;
      case "LIKE":
        // queryObject[field] = {
        //   [Op.like]: "%" + value + "%",
        // };
        queryObject2.push({
          [field]: {
            [Op.like]: "%" + value + "%",
          },
        });
        break;
      case "IN":
        // queryObject[field] = {
        //   [Op.in]: value.split(","),
        // };
        queryObject2.push({
          [field]: {
            [Op.in]: value.split(","),
          },
        });
      default:
        break;
    }
  }
  return queryObject2;
}

function buildPagingObject(limit, offset) {
  limit = limit || 10;
  offset = offset || 1;
  let defaults = {
    limit: limit,
    offset: (offset - 1) * limit,
  };

  return defaults;
}

async function createComment(comment, task_id, create_by) {
  comment["create_datetime"] = dayjs().utc().format();
  comment["create_by_uid"] = create_by;
  comment["t_id"] = task_id;

  try {
    let result = await commentModel.create(comment);
    return { result: "ok", id: result.tc_id };
  } catch (error) {
    return { error };
  }
}

async function getCommentDetail(commentId, cardId) {
  try {
    let result = await commentModel.findOne({
      where: { tc_id: commentId, t_id: cardId },
      include: {
        association: "user",
        attributes: [],
      },
      attributes: [
        "tc_id",
        "t_id",
        "comment",
        "create_by_uid",
        [Sequelize.col("user.display_name"), "user_display_name"],
        "create_datetime",
        "is_delete",
      ],
      raw: true,
    });
    // console.log(result);
    return { result, error: null };
  } catch (error) {
    // console.log(error)
    return { result: null, error };
  }
}

async function updateComment(comment, cardId, commentId) {
  comment["update_datetime"] = dayjs().utc().format();
  try {
    let _ = await commentModel.update(comment, {
      where: { tc_id: commentId, t_id:cardId },
    });
    return { result: "ok" };
  } catch (error) {
    return { error };
  }
}

async function getCommentList(cardId, limit = 10, page = 1) {
  let query = [
    {
      field: "t_id",
      operation: "EQ",
      value: cardId,
    },
    {
      field: "is_delete",
      operation: "EQ",
      value: "0",
    },
  ];
  let queryObject = buildQueryObject(query);
  let paginationObject = buildPagingObject(limit, page);

  try {
    let { count, rows: result } = await commentModel.findAndCountAll({
      where: {
        [Op.and]: queryObject,
      },
      limit: paginationObject.limit,
      offset: paginationObject.offset,
      order: [["create_datetime", "desc"]],
      include: {
        association: "user",
        attributes: [],
      },
      attributes: [
        "tc_id",
        "t_id",
        "comment",
        "create_by_uid",
        [Sequelize.col("user.display_name"), "user_display_name"],
        "create_datetime",
      ],
      raw: true,
    });

    let data = [];
    for (const tmpData of result) {
      data.push(tmpData);
    }
    return { error: null, data: data, total: count };
  } catch (error) {
    return { error, data: [], total: 0 };
  }
}

async function deleteComment(cardId, commentId) {
  let updateData = {
    is_delete: 1,
    delete_datetime: dayjs().utc().format(),
  };
  // comment["update_datetime"] = dayjs().utc().format();
  try {
    let _ = await commentModel.update(updateData, {
      where: { tc_id: commentId, t_id: cardId },
    });
    return { result: "ok" };
  } catch (error) {
    return { error };
  }
}
module.exports = {
  createComment,
  updateComment,
  getCommentDetail,
  getCommentList,
  deleteComment,
};
