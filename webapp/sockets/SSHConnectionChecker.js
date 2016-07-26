"use strict";

/**
 * Socket responsible for checking the ssh connection with a given host.
 * @class SSHConnectionChecker
 *
 * @author Jean Souza [jean.souza@funcate.org.br]
 *
 * @property {object} memberSockets - Sockets object.
 * @property {object} memberSSHDispatcher - Ssh class.
 * @property {fs} fs - NodeJS FS module
 */
var SSHConnectionChecker = function(io) {

  // Sockets object
  var memberSockets = io.sockets;
  // Ssh class
  var memberSSHDispatcher = require("../core/SSHDispatcher");

  var fs = require('fs');

  // Socket connection event
  memberSockets.on('connection', function(client) {

    // Ssh connection request event
    client.on('testSSHConnectionRequest', function(json) {
      var returnObject = {
        error: false,
        message: ""
      };

      var isLocal = json.isLocal;
      var pathToBinary = json.pathToBinary || "";

      // TODO: local validation (pathToBinary)
      if (isLocal) {

        try {
          // Query the entry
          var stats = fs.lstatSync(pathToBinary);

          // Is it a file?
          if (stats.isFile())
            returnObject.message = "Success";
          else
            throw new Error("Invalid service executable");
        }
        catch (e) {
          returnObject.error = true;
          var message = "";
          switch (e.code) {
            case "ENOENT":
              message = "No such file \""+ pathToBinary +"\" in directory";
              break;
            default:
              message = e.toString();
          }
          returnObject.message = message;
        } finally {
          client.emit('testSSHConnectionResponse', returnObject);
          return;
        }
      }

      var serviceInstance = {
        host: json.host,
        sshPort: json.port,
        sshUser: json.username
      };

      var ssh = new memberSSHDispatcher();

      ssh.connect(serviceInstance).then(function() {
        ssh.disconnect();

        returnObject.message = "Success";

        client.emit('testSSHConnectionResponse', returnObject);
      }).catch(function(err) {
        returnObject.error = true;
        returnObject.message = err.toString();

        client.emit('testSSHConnectionResponse', returnObject);
      });
    });
  });
};

module.exports = SSHConnectionChecker;
