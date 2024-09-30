module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/generate-code',
            handler: 'device-code.generateCode',
            config: {
                auth: false, // Set to true if you require authentication
            },
        },
        {
            method: 'GET',
            path: '/get-device-details',
            handler: 'device-code.getDeviceDetails',
            config: {
                auth: false, // Set to true if you require authentication
            },
        },
    ],
};
