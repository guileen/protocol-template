var UINT8    = Buffer.prototype.writeUInt8
  , UINT16BE = Buffer.prototype.writeUInt16BE
  , UINT32BE = Buffer.prototype.writeUInt32BE
  , UINT64BE = Buffer.prototype.writeUInt64BE
  , INT8     = Buffer.prototype.writeInt8
  , INT16    = Buffer.prototype.writeInt16
  , INT32    = Buffer.prototype.writeInt32
  , INT64    = Buffer.prototype.writeInt64
  , ASCII    = function (value) {
      var len = Buffer.byteLength(value, 'ascii');
      this.write(value, 0, len, 'ascii');
    }
  , UTF8     = function (value) {
      var len = Buffer.byteLength(value, 'utf8');
      this.write(value, 0, len, 'utf8');
    }

function BufferBuilder() {
  this.length = 0;
  this.values =[];
}

BufferBuilder.prototype = {
  appendInt8 : function(int8) {
    this.length ++;
    this.values.push([INT8, int8]);
  }
, appendInt16 : function(int16) {
    this.length += 2;
    this.values.push([INT16BE, int16]);
  }
, appendInt32 : function(int32) {
    this.length += 4;
    this.values.push([INT32BE, int32]);
  }
  appendUInt8 : function(uint8) {
    this.length ++;
    this.values.push([UINT8, uint8]);
  }
, appendUInt16 : function(uint16) {
    this.length += 2;
    this.values.push([UINT16BE, uint16]);
  }
, appendUInt32 : function(uint32) {
    this.length += 4;
    this.values.push([UINT32BE, uint32]);
  }
, appendAscii : function(ascii) {
    this.length += Buffer.byteLength(ascii, 'ascii');
    this.values.push([ASCII, ascii]);
  }
, appendUtf8 : function(utf8) {
    this.length += Buffer.byteLength(utf8, 'utf8');
    this.values.push([UTF8, utf8]);
  }
, insertInt8 : function(value, position) {
    this.length ++;
    this.values.slice(position, 0, [INT8, value]);
  }
, insertInt16 : function(value, position) {
    this.length += 2;
    this.values.slice(position, 0, [INT16, value]);
  }
, insertInt32 : function(value, position) {
    this.length += 4;
    this.values.slice(position, 0, [INT32, value]);
  }
, insertUInt8 : function(value, position) {
    this.length ++;
    this.values.slice(position, 0, [UINT8, value]);
  }
, insertUInt16 : function(value, position) {
    this.length += 2;
    this.values.slice(position, 0, [UINT16, value]);
  }
, insertUInt32 : function(value, position) {
    this.length += 4;
    this.values.slice(position, 0, [UINT32, value]);
  }
, insertAscii : function(value, position) {
    this.length ++;
    this.values.slice(position, 0, [ASCII, value]);
  }
, insertUtf8 : function(value, position) {
    this.length ++;
    this.values.slice(position, 0, [UTF8, value]);
  }
, toBuffer : function() {
    Buffer buffer = new Buffer(this.length);
    var len = this.values.length;
    for(var i = 0; i < len; i++) {
      var v = this.values[i];
      v[0].apply(buffer, v[1]);
    }
    return buffer;
  }
}
