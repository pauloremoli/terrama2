'use strict';

var AbstractRequest = require('./AbstractRequest');
var Promise = require('bluebird');
var Exceptions = require("./Exceptions");
var fs = require('fs');
var Form = require("./Enums").Form;
var UriPattern = require("./Enums").Uri;
var Utils = require("./Utils");

var FileRequest = function(params) {
  AbstractRequest.apply(this, arguments);
};

FileRequest.prototype = Object.create(AbstractRequest.prototype);
FileRequest.prototype.constructor = FileRequest;

FileRequest.prototype.request = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    // TODO: validate remote

    fs.stat(self.params[self.syntax().PATHNAME], function(err, stat) {
      if(err == null) {
        if(stat.isDirectory()) return resolve();
        else return reject(new Exceptions.ConnectionError("Invalid path"));
      } else return reject(new Exceptions.ConnectionError("Invalid path"));
    });
  });
};

FileRequest.fields = function() {
  var properties = {};
  properties[UriPattern.PATHNAME] = {
    title: "Path",
    type: Form.Field.TEXT
  };
  return {
    "name": "FILE",
    properties: properties,
    required: [UriPattern.PATHNAME],
    display: [
      {
        key: UriPattern.PATHNAME,
        type: Form.Field.TEXT,
        htmlClass: 'col-md-12'
      }
    ]
  };
};


module.exports = FileRequest;
