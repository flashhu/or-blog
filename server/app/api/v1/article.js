const Router = require('koa-router')
const { Article } = require('../../models/article')
const { NotEmptyArticleValidator, PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { success } = require('../../lib/helper')

const router = new Router({
    prefix: '/v1/article'
})

/**
 * 自动保存
 * @param {number} id 文章id，可选，未传则新增
 * @param {string} title
 * @param {string} text
 */
router.post('/save', new Auth(9).m, async (ctx) => {
    const v = await new NotEmptyArticleValidator().validate(ctx)
    const data = {
        uid: ctx.auth.uid,
        title: v.get('body.title'),
        text: v.get('body.text')
    }
    if(v.get('body.id')) {
        // 再编辑
        await Article.updateContent(v.get('body.id'), data);
        success(null, {
            update_time: new Date()
        })
    } else {
        // 新建
        const res = await Article.create(data)
        success({
            id: res.dataValues.id,
            update_time: new Date()
        })
    }
})

/**
 * 获取草稿状态的文章列表(管理员权限)
 */
router.get('/draft/list', new Auth(9).m, async (ctx) => {
    const list = await Article.getDraftList()
    success(list)
})

/**
 * 获取某id对应的文章内容
 * 密钥不明文显示，不传递
 */
router.get('/detail/:id', async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const detail = await Article.getDetail(v.get('path.id'))
    detail.dataValues.secretKey = detail.dataValues.secretKey ? "****": ''
    success(detail)
})

/**
 * 根据 id 删除草稿
 */
router.get('/delete/:id', async (ctx) => {
    await Article.deleteArticle(ctx.params.id)
    success(null, '删除成功');
})

module.exports = router