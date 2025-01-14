// src/api/media-handler/config/routes/media-handler.js
console.log('Media handler routes loaded');
module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/media-handlers',
        handler: 'media-handler.find',
        config: {
          policies: [],
          auth: false
        }
      },
      {
        method: 'GET',
        path: '/media-handlers/:id',
        handler: 'media-handler.findOne',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/media-handlers/:id/download',
        handler: 'media-handler.downloadMedia',
        config: {
          auth: false, // Set to true if you want to require authentication
        },
      },
      {
        method: 'GET',
        path: '/media/custom',
        handler: 'media-handler.customMediaEndpoint',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  