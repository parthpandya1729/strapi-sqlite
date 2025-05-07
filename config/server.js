
// module.exports = ({ env }) => ({
//   host: env('HOST', '192.168.1.37'), // Your IP address
//   port: env.int('PORT', 1337),        // The port the server will run on
//   app: {
//     keys: env.array('APP_KEYS', ['key1', 'key2']), // Correctly set the array of keys
//   },
//   url: env('PUBLIC_URL', 'http://192.168.1.37:1337'),
// });


module.exports = ({ env }) => ({
  host: env('HOST', '192.168.2.100'), // Your server's local IP address
  port: env.int('PORT', 1337),        // The port to serve the application
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']), // Required for session and app security
  },
  url: env('PUBLIC_URL', 'http://192.168.2.100:1337'), // Publicly accessible URL
});



