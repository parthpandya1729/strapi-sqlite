'use strict';

/**
 * sign-raft service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sign-raft.sign-raft');
