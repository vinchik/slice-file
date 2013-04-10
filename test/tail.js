var test = require('tap').test;
var tie = require('../');
var through = require('through');
var wordFile = __dirname + '/data/words';

test('short tail', function (t) {
    t.plan(11);
    t.on('end', function () {
        console.log('end');
    });
    
    var xs = tie(wordFile);
    var res = [];
    
    xs.slice(-10).pipe(through(write, end));
    
    function write (line) {
        t.ok(Buffer.isBuffer(line));
        res.push(String(line));
    }
    
    function end () {
        t.deepEqual(res, [
            "élan's\n",
            "émigré\n",
            "émigré's\n",
            "émigrés\n",
            "épée\n",
            "épée's\n",
            "épées\n",
            "étude\n",
            "étude's\n",
            "études\n",
        ]);
    }
});
