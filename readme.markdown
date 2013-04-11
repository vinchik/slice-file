# line-file

stream file slices by line numbers

# example

## positive slice

``` js
var lf = require('line-file');
var words = lf('/usr/share/dict/words');
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
var lf = require('line-file');
var xs = lf('/usr/share/dict/words');
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
var lf = require('line-file')
```

## var xs = lf(filename, opts)

## xs.slice(i, j)

Return a readable stream
