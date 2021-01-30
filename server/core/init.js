const Router = require('koa-router')
const requireDirectory = require('require-directory')

// 导入模型，建立模型关系
const { User } = require('../app/models/user')
const { Article } = require('../app/models/article')
const { Tag } = require('../app/models/tag')
const { Type } = require('../app/models/type')

// user <-1--n-> article
User.hasMany(Article, { foreignKey: 'uid' });
// type <-1--n-> article
Type.hasMany(Article, { foreignKey: 'tid' });
// tag  <-m--n-> article，指定关联联系后自动创建关系表
Article.belongsToMany(Tag, { through: 'article_tag', foreignKey: 'aid' });
Tag.belongsToMany(Article, { through: 'article_tag', foreignKey: 'tid' });

// 初始化管理器
class InitManager {
    // 入口方法
    static initCore(app) {
        InitManager.app = app
        InitManager.loadConfig()
        InitManager.initLoadRouters()
    }

    static loadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
        global.config = config
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