var fileArray = require('../');
var s = fileArray('/usr/share/dict/words');
s.slice(-10).pipe(process.stdout);
