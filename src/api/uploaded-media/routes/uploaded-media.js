module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/media/upload',
      handler: 'uploaded-media.upload', // Make sure this matches the controller method
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
