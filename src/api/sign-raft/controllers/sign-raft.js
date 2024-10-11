module.exports = {
    async addUserCode(ctx) {
        try {
            const { user_code } = ctx.request.body; // Extract user_code from the request body

            // Validate input
            if (!user_code) {
                return ctx.send({
                    success: false,
                    message: "user_code is required.",
                });
            }

            // Save user_code to the database
            const signRaftEntry = await strapi.entityService.create('api::sign-raft.sign-raft', {
                data: {
                    user_code, // Save the user code
                },
            });

            // Respond with a success message
            ctx.send({
                html: null,
                buttons: "",
                fieldActions: "",
                dialogTitle: null,
                callBack: null,
                autoSubmit: null,
                success: true,
                message: "User code added successfully.",
                clockUpdate: null,
                login: null,
                id: signRaftEntry.id, // Return the ID of the created entry
                extra: [],
                data: [],
            });
        } catch (error) {
            console.error('Error in addUserCode:', error);
            ctx.send({
                success: false,
                message: 'An error occurred while adding the user code.',
            });
        }
    },

    async getUserDetails(ctx) {
        try {
            const { user_code } = ctx.query; // Get user_code from query parameters

            // Validate input
            if (!user_code) {
                return ctx.send({
                    success: false,
                    message: "user_code is required.",
                });
            }

            // Fetch user details based on user_code
            const userDetails = await strapi.entityService.findMany('api::sign-raft.sign-raft', {
                filters: { user_code }, // Query to find matching user code
                populate: '*', // Adjust as necessary to include related fields
            });

            // If no details found
            if (!userDetails.length) {
                return ctx.send({
                    success: false,
                    message: 'No details found for the provided user code.',
                });
            }

            // Respond with user details
            const user = userDetails[0]; // Get the first matching record
            ctx.send({
                success: true,
                data: {
                    displayname: user.displayname,
                    display_type: user.display_type,
                    status: user.status,
                    authorised: user.authorised,
                    loggedIn: user.loggedIn,
                },
            });
        } catch (error) {
            console.error('Error in getUserDetails:', error);
            ctx.send({
                success: false,
                message: 'An error occurred while retrieving user details.',
            });
        }
    },
};