module.exports = {
  routes: [
        {
          method: 'POST',
          path: '/device-code/generate-code',
          handler: 'device-code.generateCode',
          config: {
            policies: [], // Change based on your permissions
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
        path: '/device-code/register',
        handler: 'device-code.registerDevice',
      },
      {
        method: 'POST',
        path: '/device-code/verify',
        handler: 'device-code.verifyDevice',
      },
      // {
      //   method: 'POST',
      //   path: '/api/device-codes/validate',
      //   handler: 'device-code.validateRegistration',
      //   config: {
      //     policies: [],
      //     middlewares: []
      //   }
      // },
      {
        method: 'GET',
        path: '/device-code/:deviceId/campaigns',
        handler: 'device-code.getDeviceCampaigns',
        config: {
          policies: [],
          auth: false
        }
      },
  ],
};
