const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class RelationshipType extends Model {

}

RelationshipType.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 文章编号
    aid: Sequelize.INTEGER,
    // 类别编号（组织文档树）
    tid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'relationship_type'
})

module.exports = {
    RelationshipType
}