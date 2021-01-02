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
 * @param {string} html
 * @param {string} text
 */
router.post('/save', new Auth(9).m, async (ctx) => {
    const v = await new NotEmptyArticleValidator().validate(ctx)
    if(v.get('body.id')) {
        // 再编辑
        const article = {
            title: v.get('body.title'),
            text: v.get('body.text'),
            html: v.get('body.html')
        }
        await Article.updateContent(v.get('body.id'), article);
        ctx.body = {
            success: 1
        }
    } else {
        // 新建
        const article = {
            title: v.get('body.title'),
            text: v.get('body.text'),
            html: v.get('body.html')
        }
        const res = await Article.create(article)
        ctx.body = {
            success: 1,
            id: res.dataValues.id
        }
    }
})

/**
 * 获取草稿状态的文章列表(管理员权限)
 */
router.get('/draft/list', new Auth(9).m, async (ctx) => {
    const list = await Article.getDraftList()
    ctx.body = list
})

/**
 * 获取某id对应的文章内容
 * 密钥不明文显示，不传递
 */
router.get('/detail/:id', async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const detail = await Article.getDetail(v.get('path.id'))
    detail.dataValues.secretKey = detail.dataValues.secretKey ? "****": ''
    ctx.body = detail
})

/**
 * 根据 id 删除草稿
 */
router.get('/delete/:id', async (ctx) => {
    await Article.deleteArticle(ctx.params.id)
    success('删除成功');
})

module.exports = router