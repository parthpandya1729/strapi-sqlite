module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
      if (ctx.request.method === 'POST' && ctx.request.path.endsWith('/validate')) {
        const { userCode, deviceCode } = ctx.request.body;
  
        if (!userCode || !deviceCode) {
          return ctx.badRequest('Both userCode and deviceCode are required.');
        }
  
        try {
          const existingDevice = await strapi.db.query('api::device-code.device-code').findMany({
            where: {
              $and: [
                { UseCode: userCode },
                { Device_code: deviceCode }
              ]
            }
          });
  
          if (existingDevice.length > 0) {
            ctx.response.body = {
              status: 'success',
              message: 'Valid device code',
              data: {
                isRegistered: existingDevice[0].IsRegistered,
                deviceId: existingDevice[0].id
              }
            };
            return;
          } else {
            ctx.response.body = {
              status: 'error',
              message: 'Invalid credentials'
            };
            return;
          }
        } catch (err) {
          return ctx.badRequest('Error validating device code');
        }
      }
      await next();
    };
  };