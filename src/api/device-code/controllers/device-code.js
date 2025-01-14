const crypto = require('crypto');


const generateDeviceHash = (deviceInfo) => {
  const str = `${deviceInfo.Hardware_id}|${deviceInfo.manufacturer}|${deviceInfo.model}|${deviceInfo.brand}`;
  return crypto.createHash('sha256').update(str).digest('hex');
};

module.exports = {
// Updated generateCode controller

async generateCode(ctx) {
  try {
    // Step 1: Retrieve and normalize device information from the request
    const deviceInfo = ctx.request.body;
    console.log('Received device info:', deviceInfo);

    const normalizedDeviceInfo = {
      Hardware_id: deviceInfo.hardwareId,
      deviceName: deviceInfo.deviceName || 'Unknown',
      manufacturer: deviceInfo.manufacturer || 'Unknown',
      model: deviceInfo.model || 'Unknown',
      systemVersion: deviceInfo.systemVersion || 'Unknown',
      brand: deviceInfo.brand || 'Unknown'
    };

    if (!normalizedDeviceInfo.Hardware_id) {
      return ctx.badRequest('Hardware ID is required');
    }

    // Step 2: Generate device hash using the normalized device information
    const deviceHash = generateDeviceHash(normalizedDeviceInfo);
    console.log('Generated device hash:', deviceHash);

    // Step 3: Check for an existing device with this Hardware_id
    const existingDevices = await strapi.entityService.findMany('api::device-code.device-code', {
      filters: { Hardware_id: normalizedDeviceInfo.Hardware_id },
    });

    console.log('Existing devices found:', existingDevices);

    if (existingDevices && existingDevices.length > 0) {
      return ctx.send({
        status: 'error',
        message: 'Device already registered',
        deviceHash: deviceHash,
        registeredAt: existingDevices[0].createdAt
      });
    }

    // Step 4: Prepare the data to save in the database
    // Note: User_code is initially blank and will be set when device is published
    const deviceData = {
      User_code: '',  // Initially blank
      deviceHash: deviceHash,
      deviceName: normalizedDeviceInfo.deviceName || 'Unknown',  // Ensure a fallback
      manufacturer: normalizedDeviceInfo.manufacturer || 'Unknown',
      model: normalizedDeviceInfo.model || 'Unknown',
      osVersion: normalizedDeviceInfo.systemVersion || 'Unknown',
      brand: normalizedDeviceInfo.brand || 'Unknown',
      Hardware_id: normalizedDeviceInfo.Hardware_id,
      isRegistered: false,  // Initially not registered
      lastSeen: new Date(),
      publishedAt: null  // Initially not published
    };
    
    console.log('Creating device record with data:', deviceData);
    
    const createdRecord = await strapi.entityService.create('api::device-code.device-code', {
      data: deviceData
    });
    
    console.log('Created record:', createdRecord);
    

    return ctx.send({ 
      status: 'success', 
      data: { 
        deviceName: normalizedDeviceInfo.deviceName, 
        deviceHash: deviceHash, 
        device: { 
          id: createdRecord.id, 
          name: normalizedDeviceInfo.deviceName 
        } 
      } 
    });

  } catch (error) {
    console.error('Error in generateCode:', error);
    return ctx.send({
      status: 'error',
      message: error.message || 'Server error while generating device code'
    }, 500);
  }
},

// Add a lifecycle hook to handle device registration when published
async beforeUpdate(event) {
  const { data, where } = event.params;
  
  // Check if the device is being published
  if (data.publishedAt && !where.publishedAt) {
    // Generate user code only when device is being published
    const userCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Update the data to include user code and set registration status
    event.params.data = {
      ...data,
      User_code: userCode,
      isRegistered: true
    };
  }
},

  // Add a helper method to validate registration
  async validateRegistration(ctx) {
    try {
      const { userCode, deviceHash } = ctx.request.body;
  
      if (!userCode || !deviceHash) {
        return ctx.badRequest('User code and device hash are required');
      }
  
      const device = await strapi.entityService.findMany('api::device-code.device-code', {
        filters: { 
          user_code: userCode,
          device_hash: deviceHash
        },
      });
  
      if (!device || device.length === 0) {
        return ctx.notFound('Registration not found');
      }
  
      return ctx.send({
        status: 'success',
        data: {
          isRegistered: device[0].is_registered,
          registeredAt: device[0].createdAt
        }
      });
  
    } catch (error) {
      console.error('Error in validateRegistration:', error);
      return ctx.send({
        status: 'error',
        message: error.message || 'Server error while validating registration'
      }, 500);
    }
  },

async getDeviceDetails(ctx) {
  try {
    const { deviceId } = ctx.params; // Assuming you need a device ID
    const device = await strapi.entityService.findOne('api::device-code.device-code', deviceId);

    if (!device) {
      return ctx.notFound('Device not found');
    }

    ctx.send({
      status: 'success',
      data: device,
    });
  } catch (error) {
    console.error('Error retrieving device details:', error);
    return ctx.throw(500, 'Failed to retrieve device details');
  }
},



async registerDevice(ctx) {
  try {
    const { hardwareId, deviceName, manufacturer, model, systemVersion, brand } = ctx.request.body;

    // Check if the device already exists
    const existingDevice = await strapi.services.device.findOne({ hardwareId });
    if (existingDevice) {
      return ctx.badRequest('Device already registered');
    }

    // Create new device record
    const newDevice = await strapi.services.device.create({
      name: deviceName,
      hardwareId,
      manufacturer,
      model,
      systemVersion,
      brand,
    });

    return ctx.send({ status: 'success', device: newDevice });
  } catch (error) {
    console.error(error);
    return ctx.internalServerError('Something went wrong');
  }
},

// Device verification endpoint

async verifyDevice(ctx) {
  const { deviceCode, userCode } = ctx.request.body;

  // Logic to verify the device using the codes
  const device = await strapi.services.device.findOne({ deviceCode, userCode });
  if (!device) {
    return ctx.notFound('Device not found');
  }

  return ctx.send({ status: 'registered', device });
},

//  Fetch device details along with campaigns
async getDeviceCampaigns(ctx) {
  const { deviceId } = ctx.params;
  console.log('deviceId', deviceId);
  try {
    // Fetch device details with campaigns, media, schedules and related data
    const deviceDetails = await strapi.db.query('api::device-code.device-code').findOne({
      where: { id: deviceId },
      populate: {
        campaigns: {
          fields: ['id', 'CampaignName', 'createdAt', 'updatedAt', 'publishedAt'],
          populate: {
            CampaignFile: {
              fields: ['id', 'name', 'url', 'mime'],
            },
            schedules: {  // Add schedules population
              fields: ['StartDate', 'EndDate'],
            },
            device_registrations: true,
          }
        },
        createdBy: true,
        updatedBy: true,
        Media: {
          fields: ['id', 'Duration', 'MediaName', 'Device_Id', 'createdAt', 'updatedAt', 'publishedAt'],
        }
      }
    });

    if (!deviceDetails) {
      return ctx.notFound('Device not found');
    }

    // Format device response with media details
    const deviceResponse = {
      results: [{
        id: deviceDetails.id,
        Device_name: deviceDetails.Device_name,
        createdAt: deviceDetails.createdAt,
        updatedAt: deviceDetails.updatedAt,
        state: deviceDetails.state,
        User_code: deviceDetails.User_code,
        publishedAt: deviceDetails.publishedAt,
        Device_id: deviceDetails.Device_id,
        Hardware_id: deviceDetails.Hardware_id,
        deviceHash: deviceDetails.deviceHash,
        campaigns: {
          count: deviceDetails.campaigns?.length || 0
        },
        Media: deviceDetails.Media ? {
          id: deviceDetails.Media.id,
          Duration: deviceDetails.Media.Duration,
          MediaName: deviceDetails.Media.MediaName,
          Device_Id: deviceDetails.Media.Device_Id,
          createdAt: deviceDetails.Media.createdAt,
          updatedAt: deviceDetails.Media.updatedAt,
          publishedAt: deviceDetails.Media.publishedAt,
        } : null,
        createdBy: deviceDetails.createdBy || null,
        updatedBy: deviceDetails.updatedBy || null
      }],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 1
      }
    };

    // Format campaigns response with CampaignName, schedules and media file details
    const campaignResponse = {
      results: deviceDetails.campaigns?.map(campaign => ({
        id: campaign.id,
        CampaignName: campaign.CampaignName,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        publishedAt: campaign.publishedAt,
        CampaignFile: campaign.CampaignFile?.map(file => ({
          mediaId: file.id,
          fileName: file.name,
          fileUrl: file.url,
          mime: file.mime
        })) || [],
        schedules: campaign.schedules?.map(schedule => ({  // Add schedules mapping
          StartDate: schedule.StartDate,
          EndDate: schedule.EndDate
        })) || [],
        device_registrations: {
          count: campaign.device_registrations?.length || 0
        },
        createdBy: campaign.createdBy || null,
        updatedBy: campaign.updatedBy || null
      })) || [],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: deviceDetails.campaigns?.length || 0
      }
    };

    return {
      device: deviceResponse,
      campaigns: campaignResponse
    };

  } catch (error) {
    console.error('Error fetching device campaigns:', error);
    return ctx.throw(500, 'Error fetching device campaigns');
  }
},



// Method to fetch all campaigns for a device
async getCampaigns(ctx) {
  const { id } = ctx.params;
  
  if (!id) {
    return ctx.badRequest('Device ID is required.');
  }

  try {
    // Check if device exists
    const deviceExists = await strapi.db.query('api::device-code.device-code').findOne({
      where: { id },
      select: ['id']  // Ensure you're querying the correct fields here
    });

    if (!deviceExists) {
      return ctx.notFound('Device not found');
    }

    // Fetch campaigns for the device
    const device = await strapi.db.query('api::device-code.device-code').findOne({
      where: { id },
      populate: { 
        Campaign: true  // Populate related campaigns
      }
    });

    return ctx.send({ status: 'success', data: device.Campaign });
  } catch (error) {
    console.error('Error fetching device campaigns:', error);
    return ctx.throw(500, 'Error fetching device campaigns');
  }
}
};