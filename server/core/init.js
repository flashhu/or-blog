const Router = require('koa-router')
const requireDirectory = require('require-directory')

// 初始化管理器
class InitManager {
    // 入口方法
    static initCore(app) {
        InitManager.app = app
        InitManager.initLoadRouters()
    }

    // 自动注册路由
    static initLoadRouters() {
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            // 模块需要为 Router
            if(obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }
}

module.exports = InitManager