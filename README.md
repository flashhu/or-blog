# 博客系统

## 实现

**前端：React + Mobx**

> Don't repeat yourself !
>
> 单一职责 | 高内聚，低耦合

* 路由守卫
* 错误边界
* axios拦截器

**后端：Koa + Sequelize**

* 双令牌
* 全局异常处理中间件
* 参数校验
* 权限分级：管理员，游客

## 功能

> 定位：个人在线文档管理中心

* 首页
  * 文章列表 
    * 管理员可以编辑文章，将文章设为私密/加密
    * 输入加密暗号后，可免登录查看文章
* 归档
  * 依据时间，仿Github贡献年历，点击快速查看某天活动
  * 依据主题，仿语雀知识库，文档树
  * 依据标签，快速筛选文章列表
* 创作中心
  * 管理员可见该入口
  * 在线 markdown 编辑器
  * 文件上传后读取内容再编辑
* 系统
  * 搜索
