const qiniu = require('qiniu')

const mac = new qiniu.auth.digest.Mac(global.config.qiniu.accessKey, global.config.qiniu.secretKey);
const bucket = 'or-blog';

const getQiniuToken = () => {
    const options = {
        scope: `${bucket}`,
        expires: 7200
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    return putPolicy.uploadToken(mac);
}

module.exports = { getQiniuToken }