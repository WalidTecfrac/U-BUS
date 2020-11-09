module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "U-BUS", 
        "productName": "U-BUS",
        "files":["**/*"],
        publish: ['github'],
      }
      }
    }
  };
