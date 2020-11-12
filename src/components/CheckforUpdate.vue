<template>
  <v-container>
    <v-container v-if="!forceUpdate">
      <v-btn
        id="checkForUpdates" elevation="12" style="outline: none" text
        @click="checkForUpdates()"
        :loading="loading"
        :disabled="downloading || loading || updated">
        {{ this.text }}
      </v-btn>
      <v-progress-linear
        :active="downloading" v-model="progress" :buffer-value="progress + 5" absolute bottom
      ></v-progress-linear>
    </v-container>
    <v-container v-if="forceUpdate">
      <v-card class="mx-auto" max-width="700" height="350">
        <v-card-text>
          <div>
            <div
              id="forceUpdatetext"
              style="font-size: 20px;margin-bottom: 2%;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);text-align: center;max-width: 500px;" class="text--primary">
              {{ this.text }} <br />
              {{ "Application Is Outdated. Force Updating.".toUpperCase()}}<br />
            </div>
            <v-progress-circular
              v-if="checking" indeterminate
            ></v-progress-circular>
          </div>
          <v-progress-linear
            :active="downloading" v-model="progress" :buffer-value="progress + 5" absolute bottom
          ></v-progress-linear>
        </v-card-text>
      </v-card>
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
      checking: false,
    };
  },
  props: ["text", "forceUpdate"],
  created() {
    if (this.forceUpdate) {
      setTimeout(() => {
        this.buttonText("forceUpdatetext", "checking for update");
        this.checking = true;
        this.checkForUpdates();
      }, 5000);
    }
  },
  methods: {
    buttonText(id, message) {
      if (id == "forceUpdatetext") {
        document.getElementById(id).innerHTML = message.toUpperCase();
      } else {
        document.getElementById(
          id
        ).children[0].innerHTML = message.toUpperCase();
      }
    },
    checkForUpdates() {
      if (!this.updateAvailable) {
        ipcRenderer.send("check-for-update");
        this.loading = true;
        ipcRenderer.once("update-available", (info, updateData) => {
          this.buttonText(this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",["update available. ",this.forceUpdate ? "downloading " : "download ", updateData.files[0].url, " of size ",(updateData.files[0].size / (1024 * 1024)).toFixed(2),"Mb", ].join(""));
          this.loading = false;
          this.updateAvailable = true;
          if (this.forceUpdate) {
            this.checkForUpdates();
          }
        });
        ipcRenderer.once("update-not-available", () => {
          this.checking = false;
          this.buttonText(this.forceUpdate ? "forceUpdatetext" : "checkForUpdates","Application is up to date");
          this.updated = true;
          this.loading = false;
        });
        ipcRenderer.once("update-error", () => {
          this.checking = false;
          this.buttonText(this.forceUpdate ? "forceUpdatetext" : "checkForUpdates","update not available. try again later");
          setTimeout(() => {
            if (!this.forceUpdate) {
              this.buttonText("checkForUpdates", "check for update");
            } else {
              this.buttonText("forceUpdatetext", "Quiting Application ...");
            }
          }, 3000);
          setTimeout(() => {
            if (this.forceUpdate) {
              ipcRenderer.send("close-app");
            }
          }, 5000);
          this.loading = false;
        });
      } else if (!this.updateDownloaded) {
        ipcRenderer.send("download-update");
        ipcRenderer.on("download-progress", (info, progress) => {
          this.checking = false;
          this.progress = parseInt(progress.percent, 10);
          this.downloading = true;
          this.buttonText(this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",["Downloading at ",progress.percent.toFixed(2),"% of ",(progress.total / (1024 * 1024)).toFixed(2)," Mb at download speed of ",(progress.bytesPerSecond / (1024 * 1024)).toFixed(2),"Mb/s",].join(""));
        });
        ipcRenderer.once("update-downloaded", (info, release) => {
          this.buttonText(this.forceUpdate ? "forceUpdatetext" : "checkForUpdates","update downloaded. ",this.forceUpdate ? "Quiting and Installing" : "Quit and Install");
          this.downloading = false;
          this.updateDownloaded = true;
          this.progress = 0;
        });
      } else {
        if (this.forceUpdate) {
          setTimeout(() => {
            ipcRenderer.send("quit-and-install");
          }, 5000);
        } else {
          ipcRenderer.send("quit-and-install");
        }
      }
    },
  },
};
</script>
