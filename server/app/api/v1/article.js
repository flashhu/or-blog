const Router = require('koa-router')
const { Article } = require('../../models/article')
const { NotEmptyArticleValidator, PositiveIntegerValidator, PostArticleValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { success } = require('../../lib/helper')
const { isNumber, parseInt } = require('lodash')

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
        success({
            update_time: new Date()
        }, null)
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
 * 发布文章
 * @param {number} id 文章id，可选，未传则新增
 * @param {number} status 状态
 * @param {string} secretKey 密码
 * @param {array} tag 标签 [1, 2, 'test']
 * @param {array} type 类型 {pid, level, child: ['test']}
 */
router.post('/post', new Auth(9).m, async (ctx) => {
    const v = await new PostArticleValidator().validate(ctx)
    const newTags = [], oldTags = [];
    for (tag of v.get('body.tag')) {
        if(isNumber(tag)) {
            oldTags.push(parseInt(tag));
        } else {
            newTags.push(tag);
        }
    }
    await Article.postArticle(
        newTags, 
        v.get('body.type'), 
        oldTags, 
        parseInt(v.get('body.id')), 
        { status: v.get('body.status'), secretKey: v.get('body.secretKey') }
    );
    success(null, '发布成功');
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
router.delete('/delete/:id', new Auth(9).m, async (ctx) => {
    await Article.deleteArticle(ctx.params.id)
    success(null, '删除成功');
})

/**
 * 返回公开文章列表
 * 加密则内容密码均以"****"代替
 */
router.get('/list/public', async (ctx) => {
    let list = await Article.getArticleListPublic();
    list.map(v => {
        if(v.secretKey) {
            v.dataValues.secretKey = '****';
            v.text = '****';
        }
        return v;
    })
    success(list);
})

/**
 * 返回所有文章，需要管理员权限
 */
router.get('/list/all', new Auth(9).m,  async (ctx) => {
    const list = await Article.getArticleListAll();
    success(list);
})

/**
 * 返回所有已发布文章（公开/私密），需要管理员权限
 */
router.get('/list/allPost', new Auth(9).m, async (ctx) => {
    let list = await Article.getArticleListAllPost();
    list.map(v => {
        if (v.secretKey) {
            v.dataValues.secretKey = '****';
        }
        return v;
    })
    success(list);
})

/**
 * 批量删除文章
 */
router.delete('/delete/batch/:list', new Auth(9).m, async (ctx) => {
    await Article.deleteArticleBatch(ctx.params.list.split('-'));
    success(null, '删除成功');
})

/**
 * 重命名文章标题
 */
router.put('/rename', new Auth(9).m, async (ctx) => {
    await Article.renameArticle(ctx.request.body);
    success(null, '修改成功');
})


/**
 * 返回所有，需要管理员权限
 */
router.get('/list/secret', new Auth(9).m, async (ctx) => {
    const list = await Article.getArticleList(1);
    success(list);
})

module.exports = router