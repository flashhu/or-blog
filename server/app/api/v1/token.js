const Router = require('koa-router')
const { TokenValidator, NotEmptyTokenValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { getQiniuToken } = require('../../services/qiniu')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/token'
})

/**
 * 用户登录（不开放注册接口）
 * 上线时，此接口需注释
 * @param {string} name 昵称
 * @param {string} password 密码
 */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const user = await User.verifyAccount(v.get('body.name'), v.get('body.password'))
    const token = generateToken(user.dataValues.id, user.dataValues.role === 1 ? Auth.ADMIN : Auth.USER)
    success({
        token,
        role: user.dataValues.role
    }, '登录成功')
})

/**
 * token验证
 * @param {string} token 
 */
router.post('/verify', async (ctx) => {
    const v = await new NotEmptyTokenValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    success({
        is_valid: result
    })
})

/**
 * 获取七牛 token
 */
router.get('/qiniu', async (ctx) => {
    const token = getQiniuToken()
    success({
        token
    })
})

module.exports = router