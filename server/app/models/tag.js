const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Tag extends Model {
    /**
     * 获取 Tag 列表
     */
    static async getTagList() {
        const list = await Tag.findAll({
            attributes: ['id', 'name'],
            order: [['created_at', 'DESC']]
        })
        return list
    }
}

Tag.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(50)
}, {
    sequelize,
    tableName: 'tag'
})

module.exports = {
    Tag
}