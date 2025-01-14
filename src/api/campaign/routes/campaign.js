// // src/api/campaign/routes/campaign.js
// module.exports = {
//   routes: [
//     {
//       method: 'GET',
//       path: '/campaigns/:id',
//       handler: 'campaign.findOne',
//     },
//     {
//       method: 'GET',
//       path: '/device-code/:deviceId/campaigns',
//       handler: 'campaign.getCampaignDetails',
//       config: {
//         policies: [],
//         auth: false
//       }
//      },
//   ],
// };


// src/api/campaign/routes/campaign.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/campaigns',
      handler: 'campaign.find',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/campaigns/:id',
      handler: 'campaign.findOne',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};