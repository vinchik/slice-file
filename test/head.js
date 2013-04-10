var test = require('tap').test;
var tie = require('../');
var through = require('through');
var fs = require('fs');
var wordFile = __dirname + '/data/words';

test('first ten', function (t) {
    t.plan(11);
    
    var xs = tie(wordFile);
    var res = [];
    
    xs.slice(0,10).pipe(through(write, end));
    
    function write (line) {
        t.ok(Buffer.isBuffer(line));
        res.push(String(line));
    }
    
    function end () {
        t.deepEqual(res, [
            "A\n",
            "A's\n",
            "AA's\n",
            "AB's\n",
            "ABM's\n",
            "AC's\n",
            "ACTH's\n",
            "AI's\n",
            "AIDS's\n",
            "AM's\n"
        ]);
    }
});

test('positive slices', function (t) {
    var lines = fs.readFileSync(wordFile, 'utf8').split('\n');
    lines.pop();
    
    var xs = tie(wordFile);
    
    var slices = [
        [ 10, 20 ],
        [ 100, 150 ],
        [ 2000, 4000 ],
        [ 3000, 3100 ],
        [ 240, 245 ],
        [ 500, 580 ],
        [ 2200, 2400 ],
        [ 2200, 2400 ],
        [ 10200, 10240 ]
    ];
    t.plan(slices.length);
    
    (function shift () {
        if (slices.length === 0) return;
        var n = slices.shift();
        console.log('n=' + n);
        var res = [];
        
        xs.slice(n[0], n[1]).pipe(through(write, end));
        
        function write (line) {
            res.push(String(line).trim());
        }
        
        function end () {
            t.deepEqual(res, lines.slice(n[0], n[1]));
            shift();
        }
    })();
});
