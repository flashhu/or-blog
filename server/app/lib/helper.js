const { Success } = require('../../core/httpException')

function success(data, msg) {
    throw new Success(data, msg);
}

module.exports = {
    success
}