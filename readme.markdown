# slice-file

stream file slices by line numbers

# example

## positive slice

``` js
var sf = require('slice-file');
var words = sf('/usr/share/dict/words');
words.slice(22398,22408).pipe(process.stdout);
```

```
beep
beep's
beeped
beeper
beeper's
beepers
beeping
beeps
beer
beer's
```

## tail

``` js
var sf = require('slice-file');
var xs = sf('/usr/share/dict/words');
xs.slice(-10).pipe(process.stdout);
```

```
élan's
émigré
émigré's
émigrés
épée
épée's
épées
étude
étude's
études
```

# methods

``` js
var sf = require('slice-file')
```

## var xs = sf(filename, opts={})

Create a line-file instance `xs` from a `filename` and some options `opts`.

These `opts` are passed to `fs.open()`:

* `opts.flags` - string flags to open the file with, default `"r"`
* `opts.mode` - mask to open the file with, default `0666`

If you already have a file descriptor open you can pass `opts.fd` to skip
calling `fs.open()`.

Use `opts.bufsize` to set how much data to read in each chunk. Default 4096.

## var stream = xs.slice(i, j, cb)

Return a readable stream that emits each line between line numbers `[i,j)`
exactly like `Array.prototype.slice()`. Each line data buffer includes a
trailing `"\n"` except for the last line if there is no trailing newline before
the EOF.

Just like `Array.prototype.slice()`, `i` and `j` may be negative.

If `cb(err, lines)` is given, the lines will be buffered into `lines`.

# install

With [npm](https://npmjs.org) do:


```
npm install line-file
```

# license

MIT
