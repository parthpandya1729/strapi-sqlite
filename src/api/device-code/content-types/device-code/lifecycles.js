// module.exports = {
//     // Runs before creating a new entry
//     async beforeCreate(event) {
//       const { data } = event.params;
//       const { userCode, deviceCode } = data;
  
//       console.log('Checking if codes exist before creating:', { userCode, deviceCode });
  
//       // Find matching codes in the database
//       const matchingCode = await strapi.entityService.findMany('api::device-code.device-code', {
//         filters: {
//           UseCode: userCode,
//           Device_code: deviceCode,
//         },
//       });
  
//       // If matching codes exist, throw an error
//       if (matchingCode.length > 0) {
//         console.log('Matching codes found, cannot create a new entry.');
//         throw new Error('Code already exists. Please update the existing entry instead.');
//       } else {
//         console.log('No matching codes found, proceeding to create a new entry.');
//         // If no matching codes found, the entry can be created
//         data.status = 'registered'; // Set status as 'registered'
//       }
//     },
  
//     // Runs before updating an existing entry
//     async beforeUpdate(event) {
//       const { data } = event.params;
//       const { userCode, deviceCode } = data;
  
//       console.log('Checking if codes exist before updating:', { userCode, deviceCode });
  
//       // Verify if the codes exist in the database
//       const matchingCode = await strapi.entityService.findMany('api::device-code.device-code', {
//         filters: {
//           UseCode: userCode,
//           Device_code: deviceCode,
//         },
//       });
  
//       // If no matching codes found, throw an error
//       if (matchingCode.length === 0) {
//         console.log('No matching codes found for update, throwing error.');
//         throw new Error('Enter valid code to update.');
//       } else {
//         console.log('Matching code found, proceeding to update.');
//         data.status = 'registered'; // Ensure status is set to 'registered' on update
//       }
//     },
//   };
  