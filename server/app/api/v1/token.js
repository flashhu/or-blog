const Router = require('koa-router')
const { TokenValidator, NotEmptyTokenValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { getQiniuToken } = require('../../services/qiniu')

const router = new Router({
    prefix: '/v1/token'
})

/**
 * 用户登录（未开放注册接口，统一设为管理员权限）
 * @param {string} name 昵称
 * @param {string} password 密码
 */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const user = await User.verifyAccount(v.get('body.name'), v.get('body.password'))
    const token = generateToken(user.dataValues.id, user.dataValues.role === 1 ? Auth.ADMIN : Auth.USER)
    ctx.body = {
        token,
        role: user.dataValues.role
    }
})

/**
 * token验证
 * @param {string} token 
 */
router.post('/verify', async (ctx) => {
    const v = await new NotEmptyTokenValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid: result
    }
})

/**
 * 获取七牛 token
 */
router.get('/qiniu', async (ctx) => {
    const token = getQiniuToken()
    ctx.body = {
        token
    }
})

module.exports = router