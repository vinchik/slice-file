var fs = require('fs');
var through = require('through');
var split = require('split');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var nextTick = typeof setImmediate === 'function'
    ? setImmediate
    : process.nextTick
;

module.exports = function (file, opts) {
    if (!opts) opts = {};
    if (opts.flags === undefined) opts.flags = 'r';
    if (opts.mode === undefined) opts.mode = 0666;
    
    var fa = new FA(file, opts);
    
    if (opts.fd === undefined) {
        fs.open(file, opts.flags, opts.mode, function (err, fd) {
            if (err) return fa.emit('error', err)
            fa.fd = fd;
            fa.emit('open', fd)
        });
    }
    return fa;
};

function FA (file, opts) {
    this.file = file;
    this.offsets = { 0: 0 };
    this.bufsize = opts.bufsize || 4 * 1024;
}

inherits(FA, EventEmitter);

FA.prototype._read = function (start, end, cb) {
    var self = this;
    if (self.fd === undefined) {
        return self.on('open', self._read.bind(self, start, end, cb));
    }
    if (start < 0) return self._readReverse(start, end, cb);
    
    var found = false;
    var line = null;
    
    var index = 0, offset = 0;
    for (var i = start; i > 0; i--) {
        if (self.offsets[i] !== undefined) {
            index = i;
            offset = self.offsets[i];
            break;
        }
    }
    
    if (index === start) line = [];
    
    var buffer = new Buffer(self.bufsize);
    fs.read(self.fd, buffer, 0, buffer.length, offset,
    function (err, bytesRead, buf) {
        if (err) return cb(err);
        if (bytesRead === 0) return cb(null, null);
        
        for (var i = 0; i < bytesRead; i++) {
            if (index >= start) line.push(buf[i]);
            
            if (buf[i] === 0x0a) {
                self.offsets[++index] = offset + i + 1;
                
                if (index === start) {
                    line = [];
                }
                else if (index > start) {
                    cb(null, Buffer(line));
                    line = [];
                }
                
                if (index === end) {
                    found = true;
                    line = null;
                    cb(null, null);
                    break;
                }
            }
        }
        
        if (!found) self._read(Math.max(start, index), end, cb);
    });
};

FA.prototype._readReverse = function (start, end, cb) {
    var self = this;
    if (self.fd === undefined) {
        return self.once('open', self._readReverse.bind(self, start, end, cb));
    }
    if (self.stat === undefined) {
        fs.stat(self.file, function (err, stat) {
            if (err) return cb(err);
            self.stat = stat;
            self.emit('stat', stat);
        });
        return self.once('stat', function () {
            self._readReverse(start, end, cb)
        });
    }
    
    var found = false;
    
    if (end === 0) return nextTick(function () {
        cb(null, null);
    });
    if (end === undefined) end = 0;
    var index = 0, offset = self.stat.size;
    
    for (var i = end; i < 0; i++) {
        if (self.offsets[i] !== undefined) {
            index = i;
            offset = self.offsets[i];
            break;
        }
    }
    var buffer = new Buffer(self.bufsize);
    offset = Math.max(0, offset - buffer.length);
    
    var lines = null;
    if (index === end) lines = [];
    
    (function _read () {
        fs.read(self.fd, buffer, 0, buffer.length, offset,
        function (err, bytesRead, buf) {
            if (err) return cb(err);
            if (bytesRead === 0) {
                lines.forEach(function (xs) {
                    cb(null, Buffer(xs));
                });
                return cb(null, null);
            }
            
            for (var i = bytesRead - 1; i >= 0; i--) {
                if (buf[i] === 0x0a) {
                    self.offsets[--index] = offset + i;
                    
                    if (index === end) {
                        lines = [];
                    }
                    else if (index === start - 1) {
                        found = true;
                        lines.forEach(function (xs) {
                            cb(null, Buffer(xs));
                        });
                        cb(null, null);
                        lines = null;
                        break;
                    }
                    else if (index < end) {
                        lines.unshift([]);
                    }
                }
                
                if (index < end) {
                    if (!lines[0]) lines[0] = [];
                    lines[0].unshift(buf[i]);
                }
            }
            
            if (!found) {
                offset -= bytesRead;
                _read();
            }
        });
    })();
};

FA.prototype.slice = function (start, end, cb) {
    var res;
    if (typeof start === 'function') {
        cb = start;
        start = 0;
        end = undefined;
    }
    if (typeof end === 'function') {
        cb = end;
        end = undefined;
    }
    if (typeof cb === 'function') res = [];
    
    var tr = through();
    this._read(start, end, function (err, line) {
        if (err) return tr.emit('error', err);
        else tr.queue(line)
        
        if (cb && line === null) cb(null, res)
        else if (cb) res.push(line)
    });
    return tr;
};
