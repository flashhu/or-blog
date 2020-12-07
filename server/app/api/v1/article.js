const Router = require('koa-router')
const { Article } = require('../../models/article')
const { NotEmptyArticleValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')

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
 * 获取草稿状态的文章列表
 */
router.get('/draft/list', new Auth(9).m, async (ctx) => {
    const list = await Article.getDraftList()
    ctx.body = list
})

module.exports = router