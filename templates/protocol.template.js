var Types = {{ type_json }}
var TypeSizes = {{ type_sizes_json }}

{% for type in types -%}
var TYPE_{{ type }} = {{ loop.index0 }};
{% endfor %}

function Message(){
}

var protocols = {{ protocols_json }}

protocols.forEach(function(protocol, index){
    // message.send_login
    var protocol_name = protocol[0];
    var protocol_sym = protocol_name.toLowerCase().replace('-', '_');
    var fields = protocol[1];

    Message.prototype['send_' + protocol_sym] = function(msg) {
      // send Protocol index
      this._queue.push([Buffer.prototype.writeUInt16BE, [index]]);

      // send fields
      for(var i=0;i<fields.length;i++) {
        var field = fields[i];
        var field_name = field[0];
        var field_type = field[1];
        this._prepare(field_type, msg[field_name]);
      }
    }
});

Message.prototype.write = function() {
  var buffer = new Buffer(this.size);
  var q = this._queue;
  for(var i = 0; i < q.length; i++) {
    var v = q[i];
    v[0].apply(buffer, v[1]);
  }
  return buffer;
}

// TODO: string[][], $ref[]
Message.prototype._prepare = function(field_type, value) {
  var type = field_type[0] & 0xFF;
  var isArray = field_type[1];
  if(isArray) {
    // assert(Array.isArray(value))
    var arrLen = field_type[2];
    if(!arrLen) {
      arrLen = value.length;
      this._pendingLen(arrLen);
    }
    for(var i=0; i< arrLen; i++) {
      var v = value[i] || '';
      this._pending(type, v);
    }
  } else {
    this._pending(type, v);
  }
}

Message.prototype._pendingLen(len) {
  {% if max255 -%}
  this._queue.push([Buffer.prototype.writeUInt8, [len]]);
  this.size += 1;
  {% else %}
  this._queue.push([Buffer.prototype.writeUInt16BE, [len]]);
  this.size += 2;
  {% endif %}
}

Message.prototype._pending = function(type, value) {
  switch(type) {
  case {{ types.index('uint8') }}:
    this._queue.push([Buffer.prototype.writeUInt8, [value]]);
    this.size += 1;
    return;
  case {{ types.index('uint16') }}:
    this._queue.push([Buffer.prototype.writeUInt16BE, [value]]);
    this.size += 2;
    return;
  case {{ types.index('uint32') }}:
    this._queue.push([Buffer.prototype.writeUInt32BE, [value]]);
    this.size += 4;
    return;
  case {{ types.index('uint64') }}:
    //TODO
    return;
  case {{ types.index('utf8') }}:
    var len = Buffer.byteLength(value, 'utf8');
    this._pendingLen(len);
    this._queue.push([Buffer.prototype.write, [value, 0, len, 'utf8']]);
    this.size += len;
    return;
  case {{ types.index('ascii') }}:
    var len = Buffer.byteLength(value, 'ascii');
    this._pendingLen(len);
    this._queue.push([Buffer.prototype.write, [value, 0, len, 'ascii']]);
    this.size += len;
    return;
  }
}

function listen(stream) {
  var len = undefined
    , recieved = 0
    , buffer = undefined;

  function reset() {
    len = undefined;
    recieved = 0;
    buffer = undefined;
  }

  stream.on('data', function recv(data) {
      /*
       * use xfer TLV
      var dataLen = data.length;
      if(len === undefined) {
        len = data.readInt16BE();
        if(len <= dataLen) {
          emit(data.slice(0, len));
          reset();
          if(dataLen > len)
            return recv(data.slice(len));
          return;
        } else {
          buffer = new Buffer(len);
        }
      }

      var end = len - recieved;
      if(end>dataLen) {
        end = dataLen;
      }
      data.copy(buffer, recieved, 0, end);
      recieved += end;

      if(recieved === len) {
        emit(buffer);
        reset();
        recv(buffer.slice(end));
      }
      */
  });

}
