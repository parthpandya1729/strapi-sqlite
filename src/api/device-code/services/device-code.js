'use strict';

/**
 * device-code service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::device-code.device-code');
