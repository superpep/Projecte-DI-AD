const crypto = require('crypto');

module.exports = function md5Encrypt(encryptString){
    var hasher =  crypto.createHash("md5");
    hasher.update(encryptString);
    encryptString= hasher.digest('hex');
    return encryptString;

}