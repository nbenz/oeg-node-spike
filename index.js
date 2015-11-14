var server = require('./libs/server'),
  io = require('./libs/socket').listen(server),
  config = require('./config/config')();


server.listen(config.port, function() {
  console.log('Starting server in ' + config.env + ' on ' + config.url + ':' + config.port);
});
