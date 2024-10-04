const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::media-manager.media-manager', ({ strapi }) => ({
  async index(ctx) {
    // Fetch all media manager entries
    const mediaEntries = await strapi.service('api::media-manager.media-manager').find();
    return ctx.send({ results: mediaEntries });
  },

  async create(ctx) {
    const { files } = ctx.request;
    const user = ctx.state.user;

    // Ensure a file is uploaded
    if (files && files.file) {
      const file = files.file;

      // Prepare media data to be saved
      const mediaData = {
        data: {
          file: file,
          name: file.name, // Set the file name
          size: file.size, // Set the file size (in bytes)
          type: file.type || file.mime, // Set the MIME type
          thumbnail: file.mime.startsWith('image') ? file.url : null, // Set thumbnail if applicable
          owner: user ? user.id : null,
          status: 'completed',
        },
      };

      try {
        // Create a media manager entry in the database
        const createdEntry = await strapi.service('api::media-manager.media-manager').create(mediaData);

        // Prepare response to include file metadata
        const response = {
          id: createdEntry.id,
          name: file.name,
          size: file.size, // Size in bytes
          type: file.type || file.mime,
          thumbnail: file.mime.startsWith('image') ? file.url : null,
          status: 'completed',
          url: file.url || `/uploads/${file.name}`,
        };

        return ctx.send({ data: response });
      } catch (error) {
        console.error('Error creating media entry:', error); // Log the error
        return ctx.internalServerError('Could not create media entry');
      }
    } else {
      return ctx.badRequest('No file uploaded');
    }
  },
}));
