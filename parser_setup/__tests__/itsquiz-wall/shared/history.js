/*
    eslint
        import/no-commonjs: 0
*/

if (process.env.BROWSER) {
    const { createHistory } = require('history');

    module.exports = createHistory();
}
