const crypto = require('crypto');

module.exports = {
    async generateCode(ctx) {
        try {
            const newUserCode = generateUniqueCode();
            const newDeviceCode = generateUniqueCode();
    
            console.log('Generated User Code:', newUserCode);
            console.log('Generated Device Code:', newDeviceCode);

            // Extract device information from the request
            const userAgent = ctx.request.headers['user-agent'] || '';
            const deviceToken = ctx.request.headers['device-token'] || generateUniqueCode(); // Fallback to a generated token if not provided

            const deviceCodeEntry = await strapi.entityService.create('api::device-code.device-code', {
                data: {
                    UseCode: newUserCode,
                    Device_code: newDeviceCode,
                    User_ID: ctx.state.user ? ctx.state.user.id : 'anonymous',
                    Device_Name: userAgent,
                    Device_Type: getDeviceType(userAgent),
                    Device_OS: getDeviceOS(userAgent),
                    Device_Token: deviceToken,
                },
            });
    
            ctx.send({
                status: 'success',
                data: {
                    use_code: deviceCodeEntry.UseCode,
                    device_code: deviceCodeEntry.Device_code,
                },
            });
        } catch (error) {
            console.error('Error generating or saving codes:', error);
    
            if (error.name === 'ValidationError') {
                console.error('Validation Errors:', error.details.errors);
                ctx.send({ 
                    status: 'error', 
                    message: 'Validation error occurred.',
                    errors: error.details.errors 
                }, 400);
            } else {
                ctx.throw(500, 'Unable to generate or save codes due to a server error.');
            }
        }
    },

    async getDeviceDetails(ctx) {
        try {
            const { user_code, device_code } = ctx.query;

            if (!user_code || !device_code) {
                return ctx.send({
                    status: 'error',
                    message: 'Both user_code and device_code are required.',
                });
            }

            const deviceCodeEntry = await strapi.entityService.findMany('api::device-code.device-code', {
                filters: { UseCode: user_code, Device_code: device_code },
                populate: '*',
            });

            if (!deviceCodeEntry.length) {
                return ctx.send({
                    status: 'error',
                    message: 'No entry found for the provided codes.',
                });
            }

            const deviceInfo = deviceCodeEntry[0];

            ctx.send({
                status: 'success',
                data: {
                    User_ID: deviceInfo.User_ID,
                    Device_Name: deviceInfo.Device_Name,
                    Device_Type: deviceInfo.Device_Type,
                    Device_OS: deviceInfo.Device_OS,
                    Device_Token: deviceInfo.Device_Token,
                },
            });
        } catch (error) {
            console.error('Error retrieving device details:', error);
            ctx.throw(500, 'Unable to retrieve device details due to a server error.');
        }
    },
};

function generateUniqueCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function getDeviceType(userAgent) {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
}

function getDeviceOS(userAgent) {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
}