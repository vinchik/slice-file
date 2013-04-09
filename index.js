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
    this._read(index, index + 1, cb);
};

FA.prototype._read = function (start, end, cb) {
    var self = this;
    if (self.fd === undefined) {
        return self.on('open', self._read.bind(self, start, end, cb));
    }
    
    var found = false;
    var line = null;
    var index = self.offsets[start] === undefined ? 0 : start;
    var offset = self.offsets[start] !== undefined ? self.offsets[start] : 0;
    if (index === start) line = '';
    
    fs.read(self.fd, self.buffer, 0, self.buffer.length, offset,
    function (err, bytesRead, buf) {
        if (err) return cb(err);
        
        for (var i = 0; i < bytesRead; i++) {
            if (index >= start) line += String.fromCharCode(buf[i]);
            
            if (buf[i] === 0x0a) {
                self.offsets[i] = index ++;
                if (index === start) {
                    line = '';
                }
                else if (index > start) {
                    cb(null, line);
                }
                
                if (index === end) {
                    found = true;
                    line = null;
                    break;
                }
            }
        }
        
        if (!found) self._read(index, end, cb);
    });
};

FA.prototype.slice = function (start, end, cb) {
    if (typeof end === 'function') {
        cb = end;
        end = undefined;
    }
    if (cb) {
    }
    
    var tr = through();
    return tr;
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
