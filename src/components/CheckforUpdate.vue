<template>
  <v-container class>
    <v-btn elevation="12" style="outline: none" text @click="checkForUpdates()">
      Check For Updates</v-btn
    >
  </v-container>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: "CheckforUpdate",
  methods: {
    checkForUpdates() {
      console.log("click");
      ipcRenderer.send("check-for-update", "test");
    },
  },
};
</script>
