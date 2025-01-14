  'use strict';
  
  const { factories } = require('@strapi/strapi');
  
  module.exports = factories.createCoreController('api::device-activity.device-activity', ({ strapi }) => ({
    async create(ctx) {
      try {
        const { data } = ctx.request.body;
        
        // Validate required fields
        if (!data.deviceId || !data.activityType) {
          return ctx.badRequest('deviceId and activityType are required');
        }
  
        // Add server timestamp if not provided
        if (!data.startTime) {
          data.startTime = new Date();
        }
  
        // Create the activity record
        const entity = await strapi.entityService.create('api::device-activity.device-activity', {
          data: data
        });
  
        return { data: entity };
      } catch (error) {
        return ctx.badRequest('Failed to create activity record', { error: error.message });
      }
    },
  
    // Custom endpoint to get activities by device
    async findByDevice(ctx) {
      const { deviceId } = ctx.params;
      const { start, end } = ctx.query;
  
      try {
        const query = {
          filters: {
            deviceId: {
              $eq: deviceId
            }
          },
          sort: { startTime: 'desc' }
        };
  
        // Add date range filter if provided
        if (start && end) {
          query.filters.startTime = {
            $between: [new Date(start), new Date(end)]
          };
        }
  
        const activities = await strapi.entityService.findMany('api::device-activity.device-activity', query);
        
        return { data: activities };
      } catch (error) {
        return ctx.badRequest('Failed to fetch device activities', { error: error.message });
      }
    }
  }));
  