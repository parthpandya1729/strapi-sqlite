// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::device-code.device-code', ({ strapi }) => ({
//   async getCampaignDetails(ctx) {
//     const { deviceId } = ctx.params;

//     try {
//       // Fetch the device with related campaigns (populate the correct fields)
//       const deviceWithCampaigns = await strapi.db.query('api::device-code.device-code').findOne({
//         where: { id: deviceId },
//         populate: {
//           campaigns: {
//             populate: {
//               // Ensure all necessary fields in the campaigns are populated
//               createdBy: true,
//               updatedBy: true,
//               CampaignFile: true
//             }
//           }
//         }
//       });

//       // Log the device data to check if campaigns are linked properly
//       console.log('Device with campaigns:', deviceWithCampaigns);

//       // Check if the device exists
//       if (!deviceWithCampaigns) {
//         return ctx.notFound(`Device with ID ${deviceId} not found`);
//       }

//       // Log the campaigns to verify that they are correctly populated
//       console.log('Campaigns linked to device:', deviceWithCampaigns.campaigns);

//       // Check if campaigns are populated correctly
//       const campaigns = (deviceWithCampaigns.campaigns || []).map(campaign => {
//         // Log each campaign to inspect the structure
//         console.log('Campaign data:', campaign);
//         return {
//           id: campaign.id,
//           CampaignName: campaign.CampaignName,
//           createdAt: campaign.createdAt,
//           updatedAt: campaign.updatedAt,
//           publishedAt: campaign.publishedAt,
//           CampaignFile: { count: campaign.CampaignFile?.length || 0 },
//           device_registrations: { count: campaign.device_registrations?.length || 0 },
//           createdBy: campaign.createdBy ? {
//             id: campaign.createdBy.id,
//             firstname: campaign.createdBy.firstname,
//             lastname: campaign.createdBy.lastname,
//             username: campaign.createdBy.username
//           } : null,
//           updatedBy: campaign.updatedBy ? {
//             id: campaign.updatedBy.id,
//             firstname: campaign.updatedBy.firstname,
//             lastname: campaign.updatedBy.lastname,
//             username: campaign.updatedBy.username
//           } : null
//         };
//       });

//       // Log the final campaigns array
//       console.log('Mapped campaigns:', campaigns);

//       // Prepare response including the device and campaigns
//       return {
//         data: {
//           results: [
//             {
//               id: deviceWithCampaigns.id,
//               Device_name: deviceWithCampaigns.Device_name,
//               createdAt: deviceWithCampaigns.createdAt,
//               updatedAt: deviceWithCampaigns.updatedAt,
//               Device_id: deviceWithCampaigns.Device_id,
//               state: deviceWithCampaigns.state,
//               User_code: deviceWithCampaigns.User_code,
//               Hardware_id: deviceWithCampaigns.Hardware_id,
//               deviceHash: deviceWithCampaigns.deviceHash,
//               publishedAt: deviceWithCampaigns.publishedAt,
//               Campaign: { count: campaigns.length },  // Set the correct campaign count
//               createdBy: deviceWithCampaigns.createdBy || null,
//               updatedBy: deviceWithCampaigns.updatedBy || null
//             }
//           ],
//           campaigns: campaigns,
//           pagination: {
//             page: 1,
//             pageSize: 10,
//             pageCount: 1,
//             total: campaigns.length
//           }
//         }
//       };
      
//     } catch (error) {
//       console.error('Error fetching campaign details:', error);
//       return ctx.throw(500, error.message || 'Internal server error');
//     }
//   }
// }));




'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::campaign.campaign', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Get pagination parameters
      const { page = 1, pageSize = 10 } = ctx.query;
      const start = (page - 1) * pageSize;

      // Find campaigns with populated relations, including schedules
      const entries = await strapi.entityService.findMany('api::campaign.campaign', {
        start,
        limit: pageSize,
        populate: {
          CampaignFile: true,
          schedules: {
            fields: ['StartDate', 'EndDate', 'campaign'],
          },
          createdBy: {
            fields: ['id', 'firstname', 'lastname', 'username']
          },
          updatedBy: {
            fields: ['id', 'firstname', 'lastname', 'username']
          }
        }
      });

      // Get total count
      const count = await strapi.entityService.count('api::campaign.campaign');

      // Format response
      const results = entries.map(entry => ({
        id: entry.id,
        CampaignName: entry.CampaignName,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        publishedAt: entry.publishedAt,
        CampaignFile: {
          count: entry.CampaignFile?.length || 0
        },
        schedules: entry.schedules.map(schedule => ({
          StartDate: schedule.StartDate,
          EndDate: schedule.EndDate
        })),
        createdBy: entry.createdBy ? {
          id: entry.createdBy.id,
          firstname: entry.createdBy.firstname,
          lastname: entry.createdBy.lastname,
          username: entry.createdBy.username
        } : null,
        updatedBy: entry.updatedBy ? {
          id: entry.updatedBy.id,
          firstname: entry.updatedBy.firstname,
          lastname: entry.updatedBy.lastname,
          username: entry.updatedBy.username
        } : null
      }));

      return {
        results,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: Math.ceil(count / pageSize),
          total: count
        }
      };
    } catch (error) {
      console.error('Error in find method:', error);
      return ctx.throw(500, error);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      const entry = await strapi.entityService.findOne('api::campaign.campaign', id, {
        populate: {
          CampaignFile: true,
          schedules: {
            fields: ['StartDate', 'EndDate'],
          },
          createdBy: {
            fields: ['id', 'firstname', 'lastname', 'username']
          },
          updatedBy: {
            fields: ['id', 'firstname', 'lastname', 'username']
          }
        }
      });

      if (!entry) {
        return ctx.notFound('Campaign not found');
      }

      const result = {
        id: entry.id,
        CampaignName: entry.CampaignName,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        publishedAt: entry.publishedAt,
        CampaignFile: {
          count: entry.CampaignFile?.length || 0
        },
        schedules: entry.schedules.map(schedule => ({
          StartDate: schedule.StartDate,
          EndDate: schedule.EndDate
        })),
        createdBy: entry.createdBy ? {
          id: entry.createdBy.id,
          firstname: entry.createdBy.firstname,
          lastname: entry.createdBy.lastname,
          username: entry.createdBy.username
        } : null,
        updatedBy: entry.updatedBy ? {
          id: entry.updatedBy.id,
          firstname: entry.updatedBy.firstname,
          lastname: entry.updatedBy.lastname,
          username: entry.updatedBy.username
        } : null
      };

      return {
        results: [result],
        pagination: {
          page: 1,
          pageSize: 1,
          pageCount: 1,
          total: 1
        }
      };
    } catch (error) {
      console.error('Error in findOne method:', error);
      return ctx.throw(500, error);
    }
  }
}));
