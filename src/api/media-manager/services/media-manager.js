'use strict';

/**
 * media-manager service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::media-manager.media-manager');
