module.exports = {
    '0 * * * *': async () => {
      const currentTime = new Date();
  
      // Fetch all device preferences
      const preferences = await strapi.entityService.findMany('api::device-preference.device-preference');
  
      preferences.forEach(async (preference) => {
        const { start_time, end_time, device } = preference;
        const isActive = currentTime >= new Date(start_time) && currentTime <= new Date(end_time);
  
        // Update device state based on the current time
        await strapi.entityService.update('api::device-code.device-code', device.id, {
          data: {
            is_active: isActive,
          },
        });
      });
    },
  };
  