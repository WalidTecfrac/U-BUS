module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "u-bus", 
        "productName": "U-BUS",
        "files":["**/*"],
        publish: ['github']
      }
      }
    }
  };
