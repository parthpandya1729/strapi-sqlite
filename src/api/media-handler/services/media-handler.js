'use strict';

/**
 * media-handler service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::media-handler.media-handler');
