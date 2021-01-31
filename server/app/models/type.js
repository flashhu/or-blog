const { Sequelize, Model, Op } = require("sequelize");
const { sequelize } = require("../../core/db");

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
