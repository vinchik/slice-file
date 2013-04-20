var test = require('tap').test;
var sf = require('../');
var fs = require('fs');
var through = require('through');

var file = __dirname + '/data/write.txt';
var ws = fs.createWriteStream(file, { flags: 'w' });

test(function (t) {
    t.plan(1);
    
    var lines = [];
    var xs = sf(file);
    
    xs.follow(-3).pipe(through(write, end));
    ws.write('one\n');
    ws.write('two\n');
    ws.write('three\n');
    ws.end();
    
    function write (line) {
        lines.push(line);
        if (lines.length === 3) xs.close();
    }
    
    function end () {
        t.deepEqual(lines, [ 'one\n', 'two\n', 'three\n' ]);
    }
});
