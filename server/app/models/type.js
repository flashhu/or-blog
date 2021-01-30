const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Type extends Model {

}

Type.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 顶层为 0
    pid: Sequelize.INTEGER,
    // 从 1 计数
    level: Sequelize.INTEGER,
    name: Sequelize.STRING(50)
}, {
    sequelize,
    tableName: 'type'
})

module.exports = {
    Type
}