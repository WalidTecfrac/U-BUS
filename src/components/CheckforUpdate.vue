<template>
  <v-container>
    <v-container v-if="(this.text == 'check for update')">
      <v-btn
        id="checkForUpdates"
        elevation="12"
        style="outline: none"
        text
        @click="checkForUpdates()"
        :loading="loading"
        :disabled="downloading || loading || updated"
      >
        {{ this.text }}
      </v-btn>
      <v-progress-linear
        :active="downloading"
        v-model="progress"
        :buffer-value="progress + 5"
        absolute
        bottom
      ></v-progress-linear>
    </v-container>
    <v-container v-if="(this.text =='force update in progress')">
      {{this.text}}
      <v-progress-linear
        :active="downloading"
        v-model="progress"
        :buffer-value="progress + 5"
        absolute
        bottom
      ></v-progress-linear>
    </v-container>
  </v-container>
</template>

<script>
const { ipcRenderer } = window.require("electron");

export default {
  name: "CheckforUpdate",
  data() {
    return {
      loader: null,
      loading: false,
      updateAvailable: false,
      updateDownloaded: false,
      downloading: false,
      progress: 0,
      updated: false,
    };
  },
  props: {
    text: String,
  },
  methods: {
    checkForUpdates() {
      if (!this.updateAvailable) {
        ipcRenderer.send("check-for-update");
        this.loading = true;
        ipcRenderer.once("update-available", (info, updateData) => {
          document.getElementById("checkForUpdates").children[0].innerHTML = [
            "update available. download ",
            updateData.files[0].url,
            " of size ",
            (updateData.files[0].size / (1024 * 1024)).toFixed(2),
            "Mb",
          ].join("");
          this.loading = false;
          this.updateAvailable = true;
        });
        ipcRenderer.once("update-not-available", () => {
          document.getElementById("checkForUpdates").children[0].innerHTML = "Application is up to date";
          this.updated = true;
          this.loading = false;
        });
        ipcRenderer.once("update-error", () => {
          document.getElementById("checkForUpdates").children[0].innerHTML = "update not available currently";
          this.loading = false;
        });
      } else if (!this.updateDownloaded) {
        ipcRenderer.send("download-update");
        ipcRenderer.on("download-progress", (info, progress) => {
          this.progress = parseInt(progress.percent, 10);
          this.downloading = true;
          document.getElementById("checkForUpdates").children[0].innerHTML = [
            "Downloading at ",
            progress.percent.toFixed(2),
            "% of ",
            (progress.total / (1024 * 1024)).toFixed(2),
            " Mb at download speed of ",
            (progress.bytesPerSecond / (1024 * 1024)).toFixed(2),
            "Mb/s",
          ].join("");
        });
        ipcRenderer.once("update-downloaded", () => {
          // console.log(info);
          // console.log(releaseName);
          document.getElementById("checkForUpdates").children[0].innerHTML = "update downloaded. Quit and Install";
          this.downloading = false;
          this.updateDownloaded = true;
          this.progress = 0;
        });
      } else {
        ipcRenderer.send("quit-and-install");
      }
    },
  },
};
</script>
