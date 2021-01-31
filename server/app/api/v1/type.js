const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Type } = require('../../models/type')
const { success } = require('../../lib/helper')
const { NonNegativeIntegerValidator } = require('../../validators/validator')

const router = new Router({
    prefix: '/v1/type'
})

router.get('/list', async (ctx) => {
  const list = await Type.getTypeList();
  success(list);
})

/**
 * 获取某pid对应的type内容
 */
router.get('/list/:pid', async (ctx) => {
  const v = await new NonNegativeIntegerValidator().validate(ctx, {
    id: 'pid'
  })
  const list = await Type.getTypeListByPid(v.get('path.pid'))
  success(list)
})

router.del('/delete/:list', new Auth(9).m, async (ctx) => {
  const res = await Type.delTypeBatch(ctx.params.list.split('-'));
  if (res > 0) {
    success(null, '删除成功');
  }
})

module.exports = router
