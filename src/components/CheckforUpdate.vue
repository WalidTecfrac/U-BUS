<template>
  <v-container>
    <v-container v-if="!forceUpdate">
      <v-btn
        id="checkForUpdates"
        elevation="12"
        style="outline: none"
        text
        @click="checkForUpdates()"
        :loading="loading"
        :disabled="downloading || loading || updated"
      >
        {{ text }}
      </v-btn>
      <v-progress-linear
        v-if="downloading"
        style="margin-top: 3%"
        :active="downloading"
        v-model="progress"
        height="25"
        color="red"
      >
        <strong>{{
          progress +
          " % of " +
          size +
          " MB AT DOWNLOADSPEED OF " +
          downloadSpeed +
          " MB/s."
        }}</strong></v-progress-linear
      >
    </v-container>
    <v-container v-if="forceUpdate">
      <v-card class="mx-auto" max-width="700" height="350">
        <v-card-text>
          <div>
            <div
              id="forceUpdatetext"
              style="
                font-size: 20px;
                margin-bottom: 2%;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                max-width: 500px;
              "
              class="text--primary"
            >
              {{ text }} <br />
              {{ "Application Is Outdated. Force Updating.".toUpperCase()
              }}<br />
            </div>
            <v-progress-circular
              v-if="checking"
              indeterminate
            ></v-progress-circular>
          </div>
          <v-progress-linear
            :active="downloading"
            v-model="progress"
            height="25"
            bottom
            absolute
            color="red"
          >
            <strong>{{
              progress +
              " % of " +
              size +
              " MB AT DOWNLOADSPEED OF " +
              downloadSpeed +
              " MB/s."
            }}</strong></v-progress-linear
          >
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
      downloading: false,
      downloadSpeed: 0,
      progress: 0,
      size: 0,
      updated: false,
      checking: false,
    };
  },
  props: ["text", "forceUpdate"],
  created() {
    if (this.forceUpdate) {
      setTimeout(() => {
        this.buttonText("forceUpdatetext", "Fetching Download");
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
          this.buttonText(
            this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",
            [
              "update available. ",
              this.forceUpdate ? "downloading " : "download ",
              updateData.files[0].url,
              " of size ",
              (updateData.files[0].size / (1024 * 1024)).toFixed(2),
              " Mb",
            ].join("")
          );
          this.filename = updateData.files[0].url;
          this.loading = false;
          this.updateAvailable = true;
          if (this.forceUpdate) {
            this.checkForUpdates();
          }
        });
        ipcRenderer.once("update-not-available", () => {
          this.checking = false;
          this.buttonText(
            this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",
            "Application is up to date"
          );
          this.updated = true;
          this.loading = false;
        });
        ipcRenderer.once("update-error", () => {
          this.checking = false;
          this.buttonText(
            this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",
            "update not available. try again later"
          );
          this.updated = true;
          setTimeout(() => {
            if (!this.forceUpdate) {
              this.buttonText("checkForUpdates", "check for update");
              this.updated = true;
            } else {
              this.buttonText("forceUpdatetext", "Quiting Application ...");
            }
          }, 3000);
          setTimeout(() => {
            if (this.forceUpdate) {
              ipcRenderer.send("close-app");
            }
          }, 8000);
          this.loading = false;
        });
      } else {
        ipcRenderer.send("download-update");
        ipcRenderer.on("download-progress", (info, progress) => {
          this.checking = false;
          this.progress = parseFloat(progress.percent).toFixed(2);
          this.downloadSpeed = parseFloat(
            progress.bytesPerSecond / (1024 * 1024)
          ).toFixed(2);
          this.size = parseFloat(progress.total / (1024 * 1024)).toFixed(2);
          this.downloading = true;
          this.buttonText(
            this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",
            "Downloading " + this.filename
          );
        });
        ipcRenderer.once("update-downloaded", (info, release) => {
          this.checking = false;
          this.downloading = false;
          this.progress = 0;
          this.buttonText(
            this.forceUpdate ? "forceUpdatetext" : "checkForUpdates",
            "update downloaded. Quiting and Installing."
          );
          setTimeout(() => {
            ipcRenderer.send("quit-and-install");
          }, 5000);
        });
      }
    },
  },
};
</script>

<style>
#checkForUpdates.v-btn--disabled {
  color: black !important;
}
</style>
