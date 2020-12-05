const { Sequelize, Model } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../../core/db')
const { NotFound, AuthFailed } = require('../../core/httpException')

class User extends Model {
    static async verifyAccount(name, password) {
        const user = await User.findOne({
            where: {
                name
            }
        })
        if(!user) {
            throw new NotFound("账号不存在")
        }
        // 解码
        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) {
            throw new AuthFailed('密码不正确')
        }
        return user
    }

    static async getUserInfo(id) {
        const user = await User.findByPk(id);
        if(!user) {
            throw new NotFound("账号不存在");
        }
        return user;
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(50),
    password: {
        // 观察者模式
        type: Sequelize.STRING,
        set(val) {
            // 生成盐
            const salt = bcrypt.genSaltSync(10)
            const pwd = bcrypt.hashSync(val, salt)
            this.setDataValue('password', pwd)
        }
    },
    role: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'user'
})

module.exports = {
    User
}