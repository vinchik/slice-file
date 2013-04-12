var test = require('tap').test;
var sf = require('../');
var fs = require('fs');
var through = require('through');

var file = __dirname + '/data/follow.txt';
var initSrc = [ 'one', 'two', 'three', 'four', 'five', 'six', '' ].join('\n');
fs.writeFileSync(file, initSrc);

test(function (t) {
    t.plan(4);
    
    var xs = sf(file);
    var res = [];
    xs.follow(-3).pipe(through(function (line) {
        res.push(String(line));
        if (res.length === 3) {
            t.deepEqual(res, [ 'four', 'five', 'six' ]);
            fs.appendFile(file, [ 'seven', 'eight', 'nine', '' ].join('\n'));
        }
        else if (res.length === 6) {
            t.deepEqual(res, [
                'four', 'five', 'six',
                'seven', 'eight', 'nine'
            ]);
            fs.appendFile(file, [ 'ten', 'eleven' ].join('\n'));
        }
        else if (res.length === 7) {
            t.deepEqual(res, [
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten'
            ]);
            fs.appendFile(file, '\n');
        }
        else if (res.length === 8) {
            t.deepEqual(res, [
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten', 'eleven'
            ]);
            xs.close();
        }
    }));
});
