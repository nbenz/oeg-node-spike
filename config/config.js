var config = {};

config.development = {
  env: 'development',
  url: '0.0.0.0',
  port: process.env.PORT || 8080,
  jwtSecret: 'OEG-game-so-fun'
};

config.test = {
  env: 'test',
  url: '0.0.0.0',
  port: process.env.PORT || 9000,
  jwtSecret: 'SpecialTestSecretJustForTesting'
}

module.exports = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return config[node_env];
};
