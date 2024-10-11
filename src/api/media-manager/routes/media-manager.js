module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/media-managers',
        handler: 'media-manager.index', // Ensure this matches the controller method
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/media-managers/upload',
        handler: 'media-manager.create',
        config: {
          auth: false, // Change to true if you require authentication
        },
      },
    ],
  };
  