var config = {};

config.development = {
  env: 'development',
  url: 'http://0.0.0.0',
  port: process.env.PORT || 8080
};

config.test = {
  env: 'test',
  url: 'http://0.0.0.0',
  port: process.env.PORT || 9000
}

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return config[node_env];
};
