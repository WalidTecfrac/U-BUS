<template>
  <v-container class>
    <v-btn elevation="12" style="outline:none" text @click="checkForUpdates()"> Check For Updates</v-btn>
  </v-container>
</template>

<script>
// const { autoUpdater } = require("electron-updater");
export default {
  name: "CheckforUpdate",
  // methods: {
  //   checkForUpdates() {
  //     const elHtml = document.getElementsByTagName('html')[0];
  //     elHtml.style.overflow = "hidden";
  //   },
  // },
};
</script>
