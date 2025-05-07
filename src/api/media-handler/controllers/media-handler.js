const { createCoreController } = require('@strapi/strapi').factories;
const path = require('path');
const fs = require('fs');
const { PassThrough } = require('stream');

module.exports = createCoreController('api::media-handler.media-handler', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { page = 1, pageSize = 10 } = ctx.query;
      const baseUrl = strapi.config.server.url;

      const query = {
        populate: {
          MediaFile: {
            populate: ['formats']
          },
          device_Name: true,
          createdBy: {
            select: ['firstname', 'lastname', 'username']
          },
          updatedBy: {
            select: ['firstname', 'lastname', 'username']
          },
          campaigns: {
            count: true
          },
          samples: {
            count: true
          }
        },
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      };

      const { results, pagination } = await strapi.service('api::media-handler.media-handler').find(query);

      // Format the response with media URLs
      const formattedResults = results.map(result => {
        // Format MediaFile with complete URLs
        const formattedMediaFile = result.MediaFile.map(file => {
          const formattedFile = {
            ...file,
            url: `${baseUrl}${file.url}`,
          };

          // Add complete URLs to all formats
          if (file.formats) {
            formattedFile.formats = Object.entries(file.formats).reduce((acc, [key, format]) => {
              acc[key] = {
                ...format,
                url: `${baseUrl}${format.url}`
              };
              return acc;
            }, {});
          }

          // Add download URL
          formattedFile.downloadUrl = `${baseUrl}/api/media-handlers/${result.id}/download`;

          return formattedFile;
        });

        return {
          id: result.id,
          Duration: result.Duration,
          MediaName: result.MediaName,
          Device_Id: result.Device_Id,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          publishedAt: result.publishedAt,
          MediaFile: formattedMediaFile,
          campaigns: {
            count: result.campaigns?.count || 0
          },
          samples: {
            count: result.samples?.count || 0
          },
          device_Name: result.device_Name,
          createdBy: result.createdBy ? {
            id: result.createdBy.id,
            firstname: result.createdBy.firstname,
            lastname: result.createdBy.lastname,
            username: result.createdBy.username
          } : null,
          updatedBy: result.updatedBy ? {
            id: result.updatedBy.id,
            firstname: result.updatedBy.firstname,
            lastname: result.updatedBy.lastname,
            username: result.updatedBy.username
          } : null
        };
      });

      return {
        results: formattedResults,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total
        }
      };

    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const baseUrl = strapi.config.server.url;
    
    const mediaItem = await strapi.service('api::media-handler.media-handler').findOne(id, {
      populate: {
        MediaFile: {
          populate: ['formats']
        }
      }
    });

    if (mediaItem && mediaItem.MediaFile) {
      mediaItem.MediaFile = mediaItem.MediaFile.map(file => ({
        ...file,
        url: `${baseUrl}${file.url}`,
        downloadUrl: `${baseUrl}/api/media-handlers/${id}/download`,
        formats: file.formats ? Object.entries(file.formats).reduce((acc, [key, format]) => {
          acc[key] = {
            ...format,
            url: `${baseUrl}${format.url}`
          };
          return acc;
        }, {}) : undefined
      }));
    }

    return mediaItem;
  },

  async customMediaEndpoint(ctx) {
    const { type } = ctx.query;
    const baseUrl = strapi.config.server.url;
    
    const mediaItems = await strapi.service('api::media-handler.media-handler').find({
      filters: { media: { type } },
      populate: {
        MediaFile: {
          populate: ['formats']
        }
      }
    });

    if (mediaItems.results) {
      mediaItems.results = mediaItems.results.map(item => {
        if (item.MediaFile) {
          item.MediaFile = item.MediaFile.map(file => ({
            ...file,
            url: `${baseUrl}${file.url}`,
            downloadUrl: `${baseUrl}/api/media-handlers/${item.id}/download`,
            formats: file.formats ? Object.entries(file.formats).reduce((acc, [key, format]) => {
              acc[key] = {
                ...format,
                url: `${baseUrl}${format.url}`
              };
              return acc;
            }, {}) : undefined
          }));
        }
        return item;
      });
    }

    return mediaItems;
  },


  async downloadMedia(ctx) {
    try {
      const { id } = ctx.params;
  
      // Fetch media handler with the associated media file
      const mediaHandler = await strapi.service('api::media-handler.media-handler').findOne(id, {
        populate: 'MediaFile',
      });
  
      if (!mediaHandler || !mediaHandler.MediaFile || mediaHandler.MediaFile.length === 0) {
        return ctx.notFound('No media files found');
      }
  
      const mediaFile = mediaHandler.MediaFile[0];
  
      // Construct the public URL for the media file
      const baseUrl = strapi.config.server.url;
      const fileUrl = `${baseUrl}${mediaFile.url}`;
  
      // Include Duration from the MediaHandler schema
      const { Duration } = mediaHandler;
      console.log('Media Duration:', Duration);
      // Return a JSON response with the media URL, file details, and duration
      ctx.send({
        success: true,
        media: {
          id: mediaFile.id,
          name: mediaFile.name,
          mime: mediaFile.mime,
          size: mediaFile.size,
          url: fileUrl,
          duration: Duration, // Add the duration here
        },
      });

    } catch (err) {
      console.error('Error in media download:', err);
      ctx.throw(500, 'Internal Server Error');
    }
  }
  
  

}));