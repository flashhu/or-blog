const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要正整数', { min: 1 })
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.password1 = [
            // 限定长度 包含特殊字符
            new Rule('isLength', '密码长度需为6~32位', { min: 6, max: 32 }),
            new Rule('matches', '密码必需包含大小写字母和数字', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,32}$/)
        ]
        this.password2 = this.password1
        this.name = [
            new Rule('isLength', '昵称长度需为4~32位', { min: 4, max: 32 })
        ]
    }

    // 校验密码一致
    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两次密码不一致')
        }
    }

    // 校验昵称唯一
    async validateName(vals) {
        const name = vals.body.name
        const user = await User.findOne({
            where: {
                name
            }
        })
        if (user) {
            throw new Error('昵称已存在')
        }
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator
}