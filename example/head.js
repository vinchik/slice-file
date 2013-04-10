var fileArray = require('../');
var s = fileArray('/usr/share/dict/words');

s.get(0, function (err, line) {
    console.log('line 0: ' + String(line).trim());
});

s.get(100, function (err, line) {
    console.log('line 100: ' + String(line).trim());
});

setTimeout(function () {
    s.slice(99164, 99171).pipe(process.stdout);
}, 100);
