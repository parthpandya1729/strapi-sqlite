const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::device-preference.device-preference', ({ strapi }) => ({
  // Custom method to transform times to local timezone
  transformTimesToLocalTimezone(data) {
    const convertToIST = (utcTime) => {
      if (!utcTime) return null;

      const date = new Date(utcTime);

      // Create a new date object in IST (UTC+5:30)
      const dateInIST = new Date(date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true
      }));

      // Format the date as "MM/DD/YYYY, HH:mm A"
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      return dateInIST.toLocaleString('en-IN', options);
    };

    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        attributes: {
          ...item.attributes,
          Start_time: convertToIST(item.attributes.Start_time),
          End_time: convertToIST(item.attributes.End_time)
        }
      }));
    }

    return {
      ...data,
      attributes: {
        ...data.attributes,
        Start_time: convertToIST(data.attributes.Start_time),
        End_time: convertToIST(data.attributes.End_time)
      }
    };
  },

  // Override find method to convert times and include device registration
  async find(ctx) {
    try {
      // Log the incoming request context for debugging
      strapi.log.info('Incoming request to find device preferences:', ctx.request.query);

      // Call the original find method, populate the device_registration relation
      const result = await strapi.entityService.findMany('api::device-preference.device-preference', {
        populate: {
          device_registration: true
        }
      });

      // Log the result of the find query
      strapi.log.info('Find result:', result);

      if (!result || result.length === 0) {
        strapi.log.warn('No device preferences found.');
      }

      // Transform times and return the result
      const transformedResult = {
        ...result,
        data: this.transformTimesToLocalTimezone(result.data)
      };

      return transformedResult;
    } catch (error) {
      strapi.log.error('Error in finding device preferences:', error);
      return ctx.internalServerError('Failed to retrieve device preferences');
    }
  },

  // Override findOne method to convert times and include device registration
  async findOne(ctx) {
    try {
      strapi.log.info('Incoming request to findOne device preference:', ctx.params);

      // Call the original findOne method, populate the device_registration relation
      const result = await strapi.entityService.findOne('api::device-preference.device-preference', ctx.params.id, {
        populate: {
          device_registration: true
        }
      });

      // Log the result of the findOne query
      strapi.log.info('FindOne result:', result);

      if (!result) {
        strapi.log.warn(`Device preference with ID ${ctx.params.id} not found.`);
      }

      // Transform times and return the result
      return this.transformTimesToLocalTimezone(result);
    } catch (error) {
      strapi.log.error('Error in finding device preference:', error);
      return ctx.internalServerError('Failed to retrieve device preference');
    }
  },

  async findByDevice(ctx) {
    try {
      const { deviceId } = ctx.params;
  
      if (!deviceId) {
        return ctx.badRequest('Device ID is required');
      }
  
      // Use Strapi's query engine to find device preferences
      const devicePreferences = await strapi.db.query('api::device-preference.device-preference').findMany({
        where: { 
          device_registration: deviceId 
        },
        populate: {
          device_registration: true,
          createdBy: true,
          updatedBy: true
        }
      });
  
      if (!devicePreferences || devicePreferences.length === 0) {
        return ctx.response.send({
          results: [],
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 0,
          },
        });
      }
  
      // Format the response
      const response = {
        results: devicePreferences.map(preference => ({
          id: preference.id,
          Start_time: preference.Start_time,
          End_time: preference.End_time,
          createdAt: preference.createdAt,
          updatedAt: preference.updatedAt,
          publishedAt: preference.publishedAt,
          device_registration: preference.device_registration ? {
            id: preference.device_registration.id,
            Device_name: preference.device_registration.Device_name,
            createdAt: preference.device_registration.createdAt,
            updatedAt: preference.device_registration.updatedAt,
            state: preference.device_registration.state,
            User_code: preference.device_registration.User_code,
            publishedAt: preference.device_registration.publishedAt,
            Device_id: preference.device_registration.Device_id,
            Hardware_id: preference.device_registration.Hardware_id,
            deviceHash: preference.device_registration.deviceHash,
          } : null,
          createdBy: preference.createdBy ? {
            id: preference.createdBy.id,
            firstname: preference.createdBy.firstname,
            lastname: preference.createdBy.lastname,
            username: preference.createdBy.username
          } : null,
          updatedBy: preference.updatedBy ? {
            id: preference.updatedBy.id,
            firstname: preference.updatedBy.firstname,
            lastname: preference.updatedBy.lastname,
            username: preference.updatedBy.username
          } : null
        })),
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: Math.ceil(devicePreferences.length / 10),
          total: devicePreferences.length,
        },
      };
  
      return ctx.response.send(response);
    } catch (error) {
      strapi.log.error('Error retrieving device preferences:', error);
      return ctx.response.status(500).send({ error: 'Failed to retrieve device preferences' });
    }
  }

}));
