module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/device-code/generate',  // Endpoint to generate codes
        handler: 'device-code.generateCode',  // Links to the generateCode method
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/device-code/get-device-details',  // Endpoint to retrieve device details
        handler: 'device-code.getDeviceDetails',  // Links to the getDeviceDetails method
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };