var fileArray = require('../');
var xs = fileArray('/usr/share/dict/words');

xs.slice(7).pipe(process.stdout);
