const { task: taskModel, changeLog: changeLogModel } = require("../models");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

async function getList(taskId) {
  try {
    let result = await changeLogModel.findAll({
      where: { t_id: taskId },
      order: [["change_datetime", "asc"]],
      raw: true,
    });
    let data = [];
    for (const tmpData of result) {
      data.push(tmpData);
    }
    return { error: null, data: data };
  } catch (error) {
    return { error, data: [], total: 0 };
  }
}

module.exports = {
  getList,
};
