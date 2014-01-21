var RedisStore = require('connect-redis');
var url = require('url');
var envVariables = ['REDIS_SESSION_URI', 'REDIS_URI', 'REDIS_SESSION_URL', 'REDIS_URL', 'REDISTOGO_URL', 'OPENREDIS_URL'];
var fallback = 'redis://localhost:6379'

module.exports = function(connect){
  var store = RedisStore(connect);

  function KrakenRedisStore (options) {
    if(!options) {
      options = {};
    } else if(typeof options === 'string') {
      options = { url: options };
    }
    if(!options.host) {
      var redisUrl = options.url;
      if(!redisUrl) {
        for(var i = 0; i < envVariables.length; i++) {
          if(redisUrl = process.env[envVariables[i]]) {
            break;
          }
        }
      }
      var config = url.parse(redisUrl || fallback);
      options.host = config.hostname;
      if(config.port) {
        options.port = config.port;
      }
      if(config.path && config.path !== '/') {
        options.db = config.path.replace(/^\//, '');
      }
      if(config.auth) {
        options.pass = config.auth.split(":")[1];
      }
    }
    store.call(this, options);
  }
  KrakenRedisStore.prototype = store.prototype;
  return KrakenRedisStore;
};
