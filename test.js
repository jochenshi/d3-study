const crypto = require('crypto');

const cipher = crypto.createCipher('aes192', 'password');

let encrypted = cipher.update('some clear text', 'string', 'hex');



console.log(cipher.final('hex'))

console.log(encrypted);