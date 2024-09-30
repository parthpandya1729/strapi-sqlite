// src/api/device-code/controllers/device-code.js

const crypto = require('crypto');

module.exports = {
    /**
     * Generates unique user and device codes.
     */
    async generateCode(ctx) {
        try {
            // Generate unique codes
            const newUserCode = generateUniqueCode();
            const newDeviceCode = generateUniqueCode();

            // Optionally, save the generated codes to your database
            // await strapi.entityService.create('api::device-code.device-code', {
            //     data: { UseCode: newUserCode, DeviceCode: newDeviceCode },
            // });

            ctx.send({
                status: 'success',
                data: {
                    user_code: newUserCode,
                    device_code: newDeviceCode,
                },
            });
        } catch (error) {
            console.error('Error generating codes:', error); // More descriptive error logging
            ctx.throw(500, 'Unable to generate codes due to a server error.');
        }
    },

    /**
     * Retrieves device details based on user and device codes.
     */
    async getDeviceDetails(ctx) {
        try {
            const { user_code, device_code } = ctx.query;

            // Validate input
            if (!user_code || !device_code) {
                return ctx.send({
                    status: 'error',
                    message: 'Both user_code and device_code are required.',
                });
            }

            // Fetch device details based on the codes
            const deviceDetails = await strapi.entityService.findMany('api::device-code.device-code', {
                filters: { UseCode: user_code, DeviceCode: device_code }, // Ensure these field names match your database
                populate: '*',
            });
            
            console.log('User Code:', user_code);
            console.log('Device Code:', device_code);

            // If no device found
            if (!deviceDetails.length) {
                return ctx.send({
                    status: 'error',
                    message: 'No device found for the provided codes.',
                });
            }

            // Extract the first device details (assuming unique codes)
            const device = deviceDetails[0];

            // Return the response in the desired format
            ctx.send({
                status: 'success',
                data: {
                    user_id: device.user_id, // Adjust these fields based on your schema
                    username: device.username,
                    device_id: device.device_id,
                    device_name: device.device_name,
                    device_type: device.device_type,
                    device_os: device.device_os,
                    device_token: device.device_token,
                },
            });
        } catch (error) {
            console.error('Error retrieving device details:', error); // More descriptive error logging
            ctx.throw(500, 'Unable to retrieve device details due to a server error.');
        }
    },
};

/**
 * Generates a unique code.
 * @returns {string} A random string of 6 characters.
 */
function generateUniqueCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a random hex string and converts to uppercase
}
