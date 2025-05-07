'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/schedules',
      handler: 'schedule.find',
      config: {
        policies: [], // Add any policies here if required
        middlewares: [], // Add any middlewares here if required
      },
    },
    {
      method: 'GET',
      path: '/schedules/:id',
      handler: 'schedule.findOne',
      config: {
        policies: [], // Add any policies here if required
        middlewares: [], // Add any middlewares here if required
      },
    },
    
  ],
};
