var lf = require('../');
var xs = lf('/usr/share/dict/words');
xs.slice(-10).pipe(process.stdout);
