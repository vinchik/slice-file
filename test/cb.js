var test = require('tap').test;
var lf = require('../');

test('slice callback', function (t) {
    var file = __dirname + '/data/lines.txt';
    lf(file).slice(4,5, function (err, lines) {
        if (err) t.fail(err)
        else t.deepEqual(lines, [ 'five', 'six' ])
    });
});
