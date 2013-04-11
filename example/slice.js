var fileArray = require('../');
var xs = fileArray('/usr/share/dict/words');

xs.slice(5000,5020).pipe(process.stdout);
