var fileArray = require('../');
var s = fileArray('/usr/share/dict/words');

s.slice(70000).pipe(process.stdout);
