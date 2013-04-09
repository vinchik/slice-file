var fileArray = require('../');
var s = fileArray('/usr/share/dict/words');
s.slice(99104, 99108).pipe(process.stdout);
