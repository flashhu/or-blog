module.exports = {
    env: 'dev',
    // env: 'prod',
    database: {
        dbName: 'blog_db',
        host: 'rm-bp1booh30eg441m31fo.mysql.rds.aliyuncs.com',
        port: 3306,
        user: 'blog_user',
        password: 'blog===='
    },
    security: {
        secretKey: "'dY!Ar#B7(GqCfrf!kgup4T[-", // 最好用随机字符串
        expiresIn: 60 * 60 * 24 * 30 // 令牌过期时间
    }
}