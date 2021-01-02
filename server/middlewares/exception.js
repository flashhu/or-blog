const { HttpException } = require('../core/httpException')

// 全局异常处理函数
const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        if (error instanceof HttpException) {
            // 已知异常
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.code
        } else {
            console.log(error);
            // 未知异常
            ctx.body = {
                msg: '系统异常，请稍后重试！',
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError