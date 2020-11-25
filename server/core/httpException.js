/**
 * http异常
 */
class HttpException extends Error {
    constructor(msg = '请求异常', errorCode = 10000, code = 400) {
        super()
        this.code = code
        this.errorCode = errorCode
        this.msg = msg
    }
}

/**
 * 参数异常 400
 */
class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 400
        this.errorCode = errorCode || 10000
        this.msg = msg || '参数错误'
    }
}


/**
 * 成功操作 200
 */
class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 200
        this.errorCode = errorCode || 0
        this.msg = msg || 'success'
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success
}