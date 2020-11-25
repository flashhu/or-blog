const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/user'
})

/**
 * 注册
 * @param {string} password1 密码
 * @param {string} password2 确认密码
 * @param {string} name 昵称
 */
router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        password: v.get('body.password1'),
        name: v.get('body.name')
    }
    await User.create(user);
    success('注册成功');
})

module.exports = router