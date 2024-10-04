const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::media-manager.media-manager', ({ strapi }) => ({
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
          name: file.name,
          size: file.size / 1024, // Size in KB
          type: file.type || file.mime, // mime type (image/jpeg, video/mp4, etc.)
          thumbnail: file.mime.startsWith('image') ? file.url : null, // Handle image thumbnails
          owner: user ? user.id : null,
          status: 'completed',
        },
      };

      // Create a media manager entry in the database
      const createdEntry = await strapi.service('api::media-manager.media-manager').create(mediaData);

      // Prepare response to include file metadata
      const response = {
        id: createdEntry.id,
        name: file.name,
        size: file.size / 1024, // Size in KB
        type: file.type || file.mime,
        thumbnail: file.mime.startsWith('image') ? file.url : null,
        status: 'completed',
        url: file.url || `/uploads/${file.name}`, // Assuming Strapi saves the file under `/uploads/`
      };

      return ctx.send({ data: response });
    } else {
      return ctx.badRequest('No file uploaded');
    }
  },
}));
