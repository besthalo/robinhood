const { task: taskModel, changeLog: changeLogModel } = require("../models");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(timezone);
dayjs.extend(utc);

const { Op, Sequelize } = require("sequelize");

function buildQueryObject(query) {
  let queryObject = {};
  let queryObject2 = [];
  for (const data of query) {
    let { field, operation, value } = data;
    switch (operation) {
      case "EQ":
        queryObject[field] = {
          [Op.eq]: value,
        };
        queryObject2.push({
          [field]: {
            [Op.eq]: value,
          },
        });
        break;
      case "GT":
        queryObject[field] = {
          [Op.gt]: value,
        };
        queryObject2.push({
          [field]: {
            [Op.gt]: value,
          },
        });
        break;
      case "GTE":
        queryObject[field] = {
          [Op.gte]: value,
        };
        queryObject2.push({
          [field]: {
            [Op.gte]: value,
          },
        });
        break;
      case "LT":
        queryObject[field] = {
          [Op.lt]: value,
        };
        queryObject2.push({
          [field]: {
            [Op.lt]: value,
          },
        });
        break;
      case "LTE":
        queryObject[field] = {
          [Op.lte]: value,
        };
        queryObject2.push({
          [field]: {
            [Op.lte]: value,
          },
        });
        break;
      case "LIKE":
        queryObject[field] = {
          [Op.like]: "%" + value + "%",
        };
        queryObject2.push({
          [field]: {
            [Op.like]: "%" + value + "%",
          },
        });
        break;
      case "IN":
        queryObject[field] = {
          [Op.in]: value.split(","),
        };
        queryObject2.push({
          [field]: {
            [Op.in]: value.split(","),
          },
        });
      default:
        break;
    }
    // queryObject[data.field];
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

function buildOrderObject(orders) {
  let defaultOrder = [["create_datetime", "asc"]];

  if (orders && orders.length > 0) {
    defaultOrder = [];
    for (const order of orders) {
      let { field, sort } = order;

      defaultOrder.push([field, sort]);
    }
  }

  return defaultOrder;
}

async function createCard(cardData, create_by) {
  cardData["create_by_uid"] = create_by;
  cardData["create_datetime"] = dayjs().utc().format();
  cardData["status"] = 1;
  cardData["archive"] = 0;

  try {
    let result = await taskModel.create(cardData);
    console.log(result.t_id);
    // log.setResponse({ result }).setMessage("success").send(1);
    return { result: "ok", id: result.t_id };
  } catch (error) {
    return { error };
  }
}

async function updateCard(cardData, cardId, update_by) {
  cardData["update_by_uid"] = update_by;
  cardData["update_datetime"] = dayjs().utc().format();
  try {
    let result = await taskModel.update(cardData, { where: { t_id: cardId } });
    // console.log(result.t_id);
    // log.setResponse({ result }).setMessage("success").send(1);
    return { result: "ok" };
  } catch (error) {
    return { error };
  }
}

async function archiveCard(cardData, cardId, update_by) {
  cardData["archive_datetime"] = dayjs().utc().format();
  try {
    let result = await taskModel.update(cardData, { where: { t_id: cardId } });
    // console.log(result.t_id);
    // log.setResponse({ result }).setMessage("success").send(1);
    return { result: "ok" };
  } catch (error) {
    return { error };
  }
}


async function saveChangeLog(changeDetail) {
  changeDetail["change_datetime"] = dayjs().utc().format();
  try {
    let result = await changeLogModel.create(changeDetail);
    console.log(result.change_id);
    return { result: "ok", id: result.change_id };
  } catch (error) {
    return { error };
  }
}

async function getCardLists(limit = 10, page = 1) {
  let query = [
    {
      field: "archive",
      operation: "EQ",
      value: 0,
    },
  ];
  let queryObject = buildQueryObject(query);
  let paginationObject = buildPagingObject(limit, page);

  try {
    let { count, rows: result } = await taskModel.findAndCountAll({
      where: {
        [Op.and]: queryObject,
      },
      limit: paginationObject.limit,
      offset: paginationObject.offset,
      order: [["create_datetime", "asc"]],
      include: {
        association: "user",
        attributes: [],
      },
      attributes: [
        "t_id",
        "title",
        "detail",
        "status",
        "create_by_uid",
        [Sequelize.col("user.display_name"), "display_name"],
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

async function getCardDetail(cardId) {
  try {
    let result = await taskModel.findOne({
      where: { t_id: cardId },
      include: {
        association: "user",
        attributes: [],
      },
      attributes: [
        "t_id",
        "title",
        "detail",
        "status",
        "create_by_uid",
        [Sequelize.col("user.display_name"), "user_display_name"],
        [Sequelize.col("user.email"), "user_email"],
        "create_datetime",
        ["archive", "archive_status"],
      ],
      raw: true,
    });
    console.log(result);
    return { result, error: null };
  } catch (error) {
    // console.log(error)
    return { result: null, error };
  }
}

module.exports = {
  createCard,
  updateCard,
  getCardLists,
  getCardDetail,
  saveChangeLog,
  archiveCard
};
