module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/api/device-activities/device/:deviceId',
        handler: 'api::device-activity.device-activity.findByDevice',
        config: {
          auth: false // Adjust based on your authentication requirements
        }
      }
    ]
  };