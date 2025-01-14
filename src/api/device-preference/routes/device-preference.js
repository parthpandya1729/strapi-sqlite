module.exports = {
  routes: [
    {
      "method": "GET",
      "path": "/device-preferences",
      "handler": "device-preference.find",
      "config": {
        "policies": [],
        "auth": false
      }
    },
    {
      "method": "GET",
      "path": "/device-preferences/:id",
      "handler": "device-preference.findOne",
      "config": {
        "policies": [],
        "auth": false
      }
    },
    {
      "method": "POST",
      "path": "/device-preferences",
      "handler": "device-preference.create",
      "config": {
        "policies": [],
        "auth": false
      }
    },
    {
      "method": "PUT",
      "path": "/device-preferences/:id",
      "handler": "device-preference.update",
      "config": {
        "policies": [],
        "auth": false
      }
    },
    {
      "method": "GET",
      "path": "/device-preferences/device/:deviceId",
      "handler": "device-preference.findByDevice",
      "config": {
        "policies": [],
        "auth": false
      }
    },
    {
      method: 'GET',
      path: '/device-preferences/findByDevice/:deviceId',
      handler: 'device-preference.findByDevice',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};  