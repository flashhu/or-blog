const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '参数需要正整数', { min: 1 })
        ]
    }
}

class NonNegativeIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '参数需要非负整数', { min: 0 })
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
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.role = [
            new Rule('isInt', '角色类型不符', { min: 0, max: 1 })
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

class TokenValidator extends LinValidator {
    constructor() {
        super()
        this.name = [
            new Rule('isLength', '昵称长度不符规则', { min: 4, max: 32 })
        ]
        this.password = [
            new Rule('isLength', '密码长度不符规则', { min: 6, max: 32 })
        ]
    }
}

class NotEmptyTokenValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', 'Token不允许为空', { min: 1 })
        ]
    }
}

class NotEmptyArticleValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isOptional'),
            new Rule('isInt', '需要正整数', { min: 1 })
        ]
        this.title = [
            new Rule('isLength', '标题长度不得超过 100 位字符', { min: 1, max: 100 })
        ]
        this.text = [
            new Rule('isOptional'),
            new Rule('isLength', '文章内容不得为空', { min: 1 })
        ]
    }
}

class PostArticleValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要正整数', { min: 1 })
        ]
        this.status = [
            new Rule('matches', 'status 字段取值不符合规则', /^(1|2)$/)
        ]
        this.secretKey = [
            new Rule('isOptional'),
            new Rule('isLength', '密码长度至少为4位', { min: 4 })
        ]
    }
}

module.exports = {
    PositiveIntegerValidator,
    NonNegativeIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyTokenValidator,
    NotEmptyArticleValidator,
    PostArticleValidator
}