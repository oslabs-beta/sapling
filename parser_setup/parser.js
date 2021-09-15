var parser = require('@babel/parser');
var path = require('path');
var fs = require('fs');
//console.log(fs.readFileSync("__tests__/test_0/index.js", 'utf-8'));
fs.writeFileSync('parser-output.json', JSON.stringify(parser.parse(fs.readFileSync("__tests__/test_0/index.js", 'utf-8'), {
    sourceType: 'module',
    plugins: [
        'jsx'
    ]
})));
