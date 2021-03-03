const { Sequelize, Model, Op } = require("sequelize");
const { sequelize } = require("../../core/db");
const { NotFound } = require("../../core/httpException");

class Type extends Model {
  /**
   * 获取类别列表以构建文档树
   */
  static async getTypeList() {
    const typeList = await Type.findAll({
      attributes: ["id", "pid", "level", "name", "updated_at"],
    });
    return typeList;
  }

  /**
   * 根据 pid 获取对应的类别
   * @param {*} pid 
   */
  static async getTypeListByPid(pid) {
    const list = await Type.findAll({
      attributes: ["id", "level", "name"],
      where: {
        pid
      },
      order: [["updated_at"]],
    });
    return list;
  }

  /**
   * 根据 pid 数组批量删除类别
   * @param {*} list 
   */
  static async delTypeBatch(list) {
    const res = await Type.destroy({
      force: true,
      where: {
        id: {
          [Op.or]: list,
        },
      },
    });
    return res;
  }

  /**
   * 根据子 tid 遍历获取父类别节点
   * @param {*} tid 文章表中 tid
   */
  static async getParentTypeListByTid(tid) {
    const list = [];
    // 1. 根据 tid 先获取当前所属类别信息
    let currType = await Type.findByPk(tid);
    if (!currType) {
      throw new NotFound("类别不存在");
    }
    list.push({
      id: currType.id, 
      name: currType.name
    });
    // 2. 根据所取到的类别信息中的 pid 循环取父节点的名称
    while (currType.pid) {
      currType = await Type.findByPk(currType.pid);
      if (!currType) {
        throw new NotFound("类别不存在");
      }
      list.unshift({
        id: currType.id,
        name: currType.name
      });
    }
    return list;
  }
}

Type.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 顶层为 0
    pid: Sequelize.INTEGER,
    // 从 1 计数
    level: Sequelize.INTEGER,
    name: Sequelize.STRING(50),
  },
  {
    sequelize,
    tableName: "type",
  }
);

module.exports = {
  Type,
};
