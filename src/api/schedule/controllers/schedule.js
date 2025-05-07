// const { createCoreController } = require('@strapi/strapi').factories;
// const moment = require('moment-timezone'); // Install this package

// module.exports = createCoreController('api::schedule.schedule', ({ strapi }) => ({
//   async find(ctx) {
//     const schedules = await strapi.entityService.findMany('api::schedule.schedule', {
//       populate: {
//         device_registration: true,
//         createdBy: true,
//         updatedBy: true,
//       },
//     });

//     // Adjust time to the desired timezone
//     schedules.forEach(schedule => {
//       schedule.StartDate = moment(schedule.StartDate).tz("Asia/Kolkata").format();
//       schedule.EndDate = moment(schedule.EndDate).tz("Asia/Kolkata").format();
//     });

//     return this.transformResponse(schedules);
//   },

//   async findOne(ctx) {
//     const { id } = ctx.params;

//     const schedule = await strapi.entityService.findOne('api::schedule.schedule', id, {
//       populate: {
//         device_registration: true,
//         createdBy: true,
//         updatedBy: true,
//       },
//     });

//     if (schedule) {
//       // Adjust time to the desired timezone
//       schedule.StartDate = moment(schedule.StartDate).tz("Asia/Kolkata").format();
//       schedule.EndDate = moment(schedule.EndDate).tz("Asia/Kolkata").format();
//     }

//     return this.transformResponse(schedule);
//   },
// }));




// relation with device registration collection

const { createCoreController } = require('@strapi/strapi').factories;
const moment = require('moment-timezone');

module.exports = createCoreController('api::schedule.schedule', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx.request;

    const schedules = await strapi.entityService.findMany('api::schedule.schedule', {
      populate: {
        device_registration: {
          fields: ['id', 'Device_name', 'Device_id', 'Hardware_id', 'state']
        },
        createdBy: true,
        updatedBy: true,
        ...query,
      },
    });

    // Adjust time to the desired timezone
    schedules.forEach(schedule => {
      if (schedule.StartDate) {
        schedule.StartDate = moment(schedule.StartDate).tz("Asia/Kolkata").format();
      }
      if (schedule.EndDate) {
        schedule.EndDate = moment(schedule.EndDate).tz("Asia/Kolkata").format();
      }
    });

    return this.transformResponse(schedules);
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const schedule = await strapi.entityService.findOne('api::schedule.schedule', id, {
      populate: {
        device_registration: {
          fields: ['id', 'Device_name', 'Device_id', 'Hardware_id', 'state']
        },
        createdBy: true,
        updatedBy: true,
      },
    });

    if (schedule) {
      // Adjust time to the desired timezone
      if (schedule.StartDate) {
        schedule.StartDate = moment(schedule.StartDate).tz("Asia/Kolkata").format();
      }
      if (schedule.EndDate) {
        schedule.EndDate = moment(schedule.EndDate).tz("Asia/Kolkata").format();
      }
    }

    return this.transformResponse(schedule);
  },
}));