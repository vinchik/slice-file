var lf = require('../');
var words = lf('/usr/share/dict/words');
words.slice(22398,22408).pipe(process.stdout);
