const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class RelationshipTag extends Model {

}

RelationshipTag.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 文章编号
    aid: Sequelize.INTEGER,
    // 标签编号
    tid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'relationship_tag'
})

module.exports = {
    RelationshipTag
}