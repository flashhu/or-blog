const { Sequelize, Model, Op, gt } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../../core/db");
const { NotFound } = require("../../core/httpException");
const { Tag } = require('./tag');
const { Type } = require('./type');
class Article extends Model {
  /**
   * 自动保存时更新文章内容, 文章状态调整为草稿
   * @param {*} id 文章 id
   * @param {*} data {title, html, text}
   */
  static async updateContent(id, data) {
    const article = await Article.findByPk(id);
    if (article) {
      await article.update({
        uid: data.uid,
        title: data.title,
        text: data.text,
        html: data.html,
        status: 0
      });
    } else {
      throw new NotFound("文章不存在");
    }
  }

  /**
   * 发布文章
   * @param {array} newTags 新增 tag ['']
   * @param {object} newTypes 逐级新增 type {pid, level, child: ['']}
   * @param {array} oldTags 已有 tag [id]
   * @param {number} id 文章 id
   * @param {object} data {status, secretKey}
   */
  static async postArticle(newTags, newTypes, oldTags, id, data) {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new NotFound("文章不存在");
    }
    // * sequelize.transaction + 回调函数
    // * {transaction: t}
    sequelize.transaction(async t => {
      // 1. 新增 Tag
      const newTagPk = []
      for (let item of newTags) {
        const newTag = await Tag.create({ name: item }, { transaction: t });
        newTagPk.push(newTag.id);
      }
      // 2. 新增 Type
      let pid = newTypes.pid;
      let level = newTypes.level;
      for(let item of newTypes.child) {
        const newType = await Type.create({
          pid,
          level,
          name: item
        }, { transaction: t });
        pid = newType.id;
        level ++;
      }
      // 3. tags 新增关系表记录
      await article.setTags([...oldTags, ...newTagPk], { transaction: t });
      // 4. 更新 article 表
      await article.update({
        tid: pid || null,
        secretKey: data.secretKey,
        status: data.status
      }, { transaction: t });
    })
  }

  /**
   * 获取草稿箱文章列表
   */
  static async getDraftList() {
    const list = await Article.findAll({
      attributes: ["id", "title", ["updated_at", "time"]],
      where: {
        status: 0,
      },
      order: [["updated_at", "DESC"]],
    });
    return list;
  }

  /**
   * 根据文章id获取详情
   * @param {*} id
   */
  static async getDetail(id) {
    const detail = await Article.findByPk(id);
    if (!detail) {
      throw new NotFound("文章不存在");
    }
    return detail;
  }

  /**
   * 根据 id 删除文章
   * @param {*} id
   */
  static async deleteArticle(id) {
    const detail = await Article.findByPk(id);
    if (!detail) {
      throw new NotFound("文章不存在");
    }
    await Article.destroy({
      // force: false 软删除，插入时间戳标记
      // force: true  物理删除
      force: false,
      where: {
        id,
      },
    });
  }

  /**
   * 获取公开文章列表
   */
  static async getArticleListPublic() {
    const list = await Article.findAll({
      attributes: ["id", "title", "tid", "status", "text", "secretKey", ["updated_at", "time"]],
      where: {
        status: 2,
      },
      order: [["updated_at", "DESC"]],
    });
    return list;
  }

  /**
   * 获取所有文章
   */
  static async getArticleListAll() {
    const list = await Article.findAll({
      attributes: ["id", "title", "tid", "status", ["updated_at", "time"]],
      order: [["updated_at"]],
    });
    return list;
  }

  /**
   * 获取所有已发布文章
   */
  static async getArticleListAllPost() {
    const list = await Article.findAll({
      attributes: ["id", "title", "tid", "status", "text", "secretKey", ["updated_at", "time"]],
      where: {
        status: {
          [Op.gt]: 0
        }
      },
      order: [["updated_at", "DESC"]],
    });
    return list;
  }

  /**
   * 根据id列表一次性删除多篇文章
   * @param {}} list
   */

  static async deleteArticleBatch(list) {
    const res = await Article.destroy({
      where: {
        id: {
          [Op.or]: list,
        },
      },
    });
    console.log("res ", res);
    return res;
  }
  
  /**
   * 重命名文章标题
   * @param {*} info {id, newTitle}
   */
  static async renameArticle(info) {
    const res = await Article.update(
      {
        title: info.newTitle,
      },
      {
        where: {
          id: info.id,
        },
      }
    );
    return res;
  }
}

Article.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 文章只有一作者
    uid: Sequelize.INTEGER,
    // 所属文章类别（组织文档树）
    tid: Sequelize.INTEGER,
    title: Sequelize.STRING(100),
    text: Sequelize.TEXT,
    // 加密口令
    secretKey: {
      type: Sequelize.STRING,
      set(val) {
        // 生成盐
        if(val) {
          const salt = bcrypt.genSaltSync(10);
          const key = bcrypt.hashSync(val, salt);
          this.setDataValue("secretKey", key);
        }
      },
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "article",
  }
);

module.exports = {
  Article,
};
