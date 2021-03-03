const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Tag } = require('../../models/tag')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/tag'
})

/**
 * 获取所有标签列表
 */
router.get('/list', async (ctx) => {
    const list = await Tag.getTagList()
    success(list)
})

module.exports = router