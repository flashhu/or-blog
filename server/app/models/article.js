const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { NotFound } = require('../../core/httpException')

class Article extends Model {
    /**
     * 自动保存时更新文章内容
     * @param {*} id 
     * @param {*} data {title, html, text}
     */
    static async updateContent(id, data) {
        const article = await Article.findByPk(id)
        if (article) {
            await article.update({
                uid: data.uid,
                title: data.title,
                text: data.text,
                html: data.html
            })
        }else {
            throw new NotFound("文章不存在");
        }
    }

    /**
     * 获取草稿箱文章列表
     */
    static async getDraftList() {
        const list = await Article.findAll({
            attributes: ['id', 'title', ['updated_at', 'time']],
            where: {
                status: 0
            },
            order: [['updated_at', 'DESC']]
        })
        return list
    }

    /**
     * 根据文章id获取详情
     * @param {*} id 
     */
    static async getDetail(id) {
        const detail = await Article.findByPk(id)
        if(!detail) {
            throw new NotFound("文章不存在");
        }
        return detail
    }

    /**
     * 根据 id 删除文章
     * @param {*} id 
     */
    static async deleteArticle(id) {
        const detail = await Article.findByPk(id)
        if (!detail) {
            throw new NotFound("文章不存在");
        }
        await Article.destroy({
            // force: false 软删除，插入时间戳标记
            // force: true  物理删除
            force: false,
            where: {
                id
            }
        })
    }
}

Article.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
            const salt = bcrypt.genSaltSync(10)
            const key = bcrypt.hashSync(val, salt)
            this.setDataValue('secretKey', key)
        }
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'article'
})

module.exports = {
    Article
}