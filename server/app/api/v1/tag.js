const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Tag } = require('../../models/tag')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/tag'
})

/**
 * 获取所有标签列表(管理员权限)
 */
router.get('/list', new Auth(9).m, async (ctx) => {
    const list = await Tag.getTagList()
    success(list)
})

module.exports = router