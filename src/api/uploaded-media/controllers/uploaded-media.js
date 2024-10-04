'use strict';

const formatFileSize = (sizeInBytes) => {
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  return (
    (sizeInBytes / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
};

module.exports = {
  async upload(ctx) {
    try {
      const uploadedFiles = ctx.request.files.files; // Adjust if needed
      
      if (!uploadedFiles) {
        return ctx.badRequest('No file uploaded');
      }

      const uploadService = strapi.plugins.upload.services.upload;
      const uploadedFile = await uploadService.upload({
        data: {},
        files: uploadedFiles,
      });

      // Format the response
      const response = uploadedFile.map(file => ({
        id: file.id,
        name: file.name,
        size: formatFileSize(file.size), // Convert to human-readable format
        type: file.mime,
        url: file.url,
        thumbnail: file.formats?.thumbnail?.url || file.url,
        customWidth: file.width || null,
        customHeight: file.height || null,
        owner: ctx.state.user ? ctx.state.user.id : null,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }));

      return ctx.send(response);
    } catch (error) {
      return ctx.internalServerError(`Couldn't upload the file: ${error.message}`);
    }
  },
};
