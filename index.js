var fs = require('fs');
var through = require('through');
var split = require('split');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = function (file, opts) {
    if (!opts) opts = {};
    if (opts.flags === undefined) opts.flags = 'r';
    if (opts.mode === undefined) opts.mode = 0666;
    
    var fa = new FA(opts);
    
    if (opts.fd === undefined) {
        fs.open(file, opts.flags, opts.mode, function (err, fd) {
            if (err) return fa.emit('error', err)
            fa.fd = fd;
            fa.emit('open', fd)
        });
    }
    return fa;
};

function FA (opts) {
    this.offsets = { 0: 0 };
    this._mean = { value: 80, samples: 0 };
    this.buffer = new Buffer(opts.bufsize || 4 * 1024);
}

inherits(FA, EventEmitter);

FA.prototype._read = function (start, end) {
    //fs.read(this.fd, this.buffer, offset, length, position, cb);
};

FA.prototype.get = function (index, cb) {
    this._read(index, index + 1, function (err, xs) {
        if (err) cb(err)
        else cb(null, xs[0])
    });
};

FA.prototype._read = function (start, end, cb) {
    var self = this;
    if (self.fd === undefined) {
        return self.on('open', self._read.bind(self, start, end, cb));
    }
    
    var found = false;
    var lines = null;
    var index = self.offsets[start] === undefined ? 0 : start;
    var offset = self.offsets[start] !== undefined ? self.offsets[start] : 0;
    if (index === start) lines = [''];
    
    fs.read(self.fd, self.buffer, 0, self.buffer.length, offset,
    function (err, bytesRead, buf) {
        if (err) return cb(err);
        
        for (var i = 0; i < bytesRead; i++) {
            if (lines) {
                lines[lines.length-1] += String.fromCharCode(buf[i]);
            }
            if (buf[i] === 0x0a) {
                self.offsets[i] = index ++;
                if (index === start) {
                    lines = [];
                }
                if (index === end) {
                    cb(null, lines);
                    found = true;
                    lines = null;
                    break;
                }
                else if (lines) lines.push('')
            }
        }
        
        if (!found) self._read(index, end, cb);
    });
};

FA.prototype.slice = function (start, end) {
};

FA.prototype.splice = function (start, length) {
};

FA.prototype.shift = function () {
};

FA.prototype.unshift = function () {
};

FA.prototype.push = function () {
};

FA.prototype.pop = function () {
};
