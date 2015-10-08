var app = require('express')();
var http = require('http').Server(app);
var config = require('../config/config');

app.get('/', function(req, res) {
  res.send('<h1>Change this to index.html in config</h1>');
});

module.exports.listen = function() {
  http.listen(config.port, function() {
    console.log('Server listening on port ' + config.port);
  });
};
