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
        publish: [{
          "provider": "github",
          "owner": "WalidTecfrac",
          "repo": "U-BUS",
          "updaterCacheDirName": "ubus"
        }],
      }
      }
    }
  };
