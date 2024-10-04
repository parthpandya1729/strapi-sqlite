module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/display/addViaCode', // Existing endpoint
            handler: 'sign-raft.addUserCode', // Existing handler
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/display/getUserDetails', // New endpoint to get user details
            handler: 'sign-raft.getUserDetails',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};