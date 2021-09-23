/*
    eslint
        import/no-commonjs: 0
        import/no-unresolved: 0
*/

if (process.env.BROWSER) {
    module.exports = window.__CONFIG__;
} else {
    const confme    = require('confme');
    const path      = require('path');

    const config    = confme(path.join(__dirname, '../etc/client-config.json'));

    module.exports  = config;
}
