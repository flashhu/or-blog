const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Tag extends Model {

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
    tableName: 'bm_tag'
})

module.exports = {
    Tag
}