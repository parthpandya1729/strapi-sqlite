const crypto = require('crypto');

module.exports = {
  async generateCode(ctx) {
    try {
      // Generate unique codes
      const newUserCode = generateUniqueCode();
      const newDeviceCode = generateUniqueCode();
      const deviceName = "Your Device Name"; // You can replace this with dynamic data if necessary

      // Log the generated codes for debugging
      console.log('Generated Codes:', { newUserCode, newDeviceCode });

      // Save the generated codes to the database but set IsRegistered as false
      const createdRecord = await strapi.entityService.create('api::device-code.device-code', {
        data: {
          UseCode: newUserCode,           // Match the attribute name exactly
          Device_code: newDeviceCode,      // Match the attribute name exactly
          Device_Name: deviceName,         // Add device name as per your schema
          IsRegistered: false,             // Code is not registered yet
          CreatedAt: new Date(),           // Set created date to now
          UpdatedAt: new Date(),           // Set updated date to now
        },
      });

      ctx.send({
        status: 'success',
        data: {
          user_code: createdRecord.UseCode,
          device_code: createdRecord.Device_code,
        },
      });
    } catch (error) {
      // Handle validation errors
      if (error.name === 'YupValidationError') {
        console.error('Validation Errors:', error.details.errors); // Log the validation errors
      } else {
        console.error('Error generating codes:', error);
      }
      ctx.throw(500, 'Unable to generate codes due to a server error.');
    }
  },

  async getDeviceDetails(ctx) {
    const { user_code, device_code } = ctx.query;
    if (!user_code || !device_code) {
      return ctx.badRequest('Both user_code and device_code are required.');
    }

    const deviceDetails = await strapi.entityService.findOne('api::device-code.device-code', {
      filters: {
        UseCode: user_code,
        Device_code: device_code,
      },
    });

    if (!deviceDetails) {
      return ctx.notFound('Device details not found.');
    }

    ctx.send({ data: deviceDetails });
  },

  // New method for registering devices
  async registerDevice(ctx) {
    const { user_code, device_code } = ctx.request.body;
    if (!user_code || !device_code) {
      return ctx.badRequest('Both user_code and device_code are required.');
    }

    const deviceDetails = await strapi.entityService.findOne('api::device-code.device-code', {
      filters: {
        UseCode: user_code,
        Device_code: device_code,
        IsRegistered: false,
      },
    });

    if (!deviceDetails) {
      return ctx.notFound('Device details not found or already registered.');
    }

    const updatedRecord = await strapi.entityService.update('api::device-code.device-code', deviceDetails.id, {
      data: {
        IsRegistered: true,
        UpdatedAt: new Date(),
      },
    });

    ctx.send({
      status: 'success',
      data: updatedRecord,
    });
  },
};

