const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/user'
})

/**
 * 注册
 * @param {string} password1 密码
 * @param {string} password2 确认密码
 * @param {string} name 昵称
 * @param {number} role 角色（1：管理员，0：普通用户）
 */
router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        password: v.get('body.password1'),
        name: v.get('body.name'),
        role: v.get('body.role')
    }
    await User.create(user);
    success('注册成功');
})

/**
 * 获取用户信息
 */
router.get('/info', new Auth().m, async (ctx) => {
    const user = await User.getUserInfo(ctx.auth.uid)
    ctx.body = {
        name: user.name,
        role: user.dataValues.role
    }
})

module.exports = router