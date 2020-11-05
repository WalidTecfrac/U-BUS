module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "taxi.service", 
        "productName": "Taxi Service",
      }
      }
    }
  };