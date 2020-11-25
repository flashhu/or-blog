const Router = require('koa-router')
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/token'
})

/**
 * 用户登录
 * @param {string} name 昵称
 * @param {string} password 密码
 */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    const user = await User.verifyAccount(v.get('body.name'), v.get('body.password'))
    const token = generateToken(user.dataValues.id, Auth.ADMIN)
    ctx.body = {
        token
    }
})

/**
 * token验证
 * @param {string} token 
 */
router.post('/verify', async (ctx) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid: result
    }
})

module.exports = router