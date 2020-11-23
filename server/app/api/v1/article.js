const Router = require('koa-router')
const { ParameterException } = require('../../../core/httpException')

const router = new Router({
    prefix: '/v1/article'
})

router.get('/list', (ctx, next) => {
    const body = ctx.request.body;
    console.log(body);

    const error = new ParameterException()
    throw error
})

module.exports = router