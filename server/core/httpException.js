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
        this.msg = msg || '操作成功'
    }
}

/**
 * 资源未找到 404
 */
class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 404
        this.errorCode = errorCode || 10000
        this.msg = msg || '资源未找到'
    }
}

/**
 * 未被授权 401
 */
class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 401
        this.errorCode = errorCode || 10004
        this.msg = msg || '授权失败'
    }
}

/**
 * 禁止访问 403
 */
class Forbbiden extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 403
        this.errorCode = errorCode || 10006
        this.msg = msg || '禁止访问'
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden,
}