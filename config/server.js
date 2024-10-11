module.exports = ({ env }) => ({
  host: env('HOST', '192.168.1.104'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ["key1", "key2"])
  },
  url: env('PUBLIC_URL', 'http://192.168.1.104:1337'),
});
