const { Type } = require('../../models/type');
const { success } = require('../../lib/helper');
const { Auth } = require('../../../middlewares/auth')

const Router = require('koa-router');

const router = new Router({
  prefix: '/v1/type',
})

router.get('/list', async (ctx) => {
  const list = await Type.getTypeList();
  success(list);
})

router.del('/delete/:list', new Auth(9).m, async (ctx) => {
  const res = await Type.delTypeBatch(ctx.params.list.split('-'));
  if(res > 0){
    success(null, '删除成功');
  }
})
 
module.exports = router;
