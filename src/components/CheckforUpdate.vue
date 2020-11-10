<template>
  <v-container class>
    <v-btn elevation="12" style="outline: none" text @click="checkForUpdates()">
      Check For Updates</v-btn
    >
  </v-container>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "CheckforUpdate",
  methods: {
    checkForUpdates() {
      ipcRenderer.send("check-for-update");
    },
  },
};
</script>
