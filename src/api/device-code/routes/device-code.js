module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/device-code/generate-code',  // Make sure this path is correct
      handler: 'device-code.generateCode',
      config: {
        policies: [],
      },
    },
      {
        method: 'GET',
        path: '/device-code/get-device-details',
        handler: 'device-code.getDeviceDetails',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/device-code/register-device',
        handler: 'device-code.registerDevice',
        config: {
          policies: [],
        },
      },
  ],
};