const fs = require('fs');

const ensureDir = p => !fs.existsSync(p) && fs.mkdirSync(p);

module.exports = ensureDir;
