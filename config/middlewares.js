// module.exports = [
//   "strapi::errors",
//   "strapi::security",
//   "strapi::cors",
//   "strapi::poweredBy",
//   "strapi::logger",
//   "strapi::query",
//   "strapi::body",
//   'strapi::session',
//   "strapi::favicon",
//   "strapi::public",
// ];


module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: [
        'http://localhost:1337', // Localhost for development
        'http://192.168.2.100:1337', // Your device or server IP
        'http://YOUR_ANDROID_DEVICE_IP_OR_DOMAIN', // Replace with your Android app's IP or domain
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session", // Ensure this is included
  "strapi::favicon",
  "strapi::public",
];


