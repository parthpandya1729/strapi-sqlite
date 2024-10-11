// src/api/media-handler/controllers/media-handler.js

const { createCoreController } = require('@strapi/strapi').factories;
const fs = require('fs');
const path = require('path');

module.exports = createCoreController('api::media-handler.media-handler', ({ strapi }) => ({
  async find(ctx) {
    // Populate the media field
    ctx.query = {
      ...ctx.query,
      populate: 'media',  // This ensures that the 'media' field is included in the response
    };
  
    // Use the core controller's 'find' method to fetch the data, including the media field
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const mediaItem = await strapi.service('api::media-handler.media-handler').findOne(id, ctx.query);
    return mediaItem;
  },

  async customMediaEndpoint(ctx) {
    const { type } = ctx.query;
    const mediaItems = await strapi.service('api::media-handler.media-handler').find({
      filters: { media: { type } },
    });
    return mediaItems;
  },

  async downloadMedia(ctx) {
    const { id } = ctx.params;
    console.log('Requested media ID:', id);
  
    try {
      const mediaItem = await strapi.entityService.findOne('api::media-handler.media-handler', id, {
        populate: ['media'],  // Populate the 'media' field
      });
      console.log('Fetched Media Item:', JSON.stringify(mediaItem, null, 2));
  
      if (!mediaItem) {
        console.log('Media item not found in database');
        return ctx.notFound('Media item not found');
      }
  
      if (!mediaItem.media || !mediaItem.media.url) {
        console.log('Media item found, but no associated media file');
        return ctx.badRequest('Media file not found for this item');
      }
  
      // Construct the file URL for downloading
      const fileUrl = `${strapi.config.get('server.url')}${mediaItem.media.url}`;
      
      // Redirect to the file to trigger download
      ctx.redirect(fileUrl);
      console.log('ccccc',fileUrl)
  
      // Alternatively, return the media metadata
      return ctx.send({
        url: fileUrl,
        name: mediaItem.media.name,
        mime: mediaItem.media.mime,
        size: mediaItem.media.size,
      });
    } catch (error) {
      console.error('Error fetching media:', error);
      return ctx.internalServerError('An error occurred while fetching the media');
    }
  }
  
}));
``