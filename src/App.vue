<template>
  <v-app >
    <!-- <v-app-bar v-if="!forceUpdate" max-height="48" style="width: 100%">
      <v-toolbar-items>
        <v-btn text>
          <router-link to="/">Home</router-link>
        </v-btn>
        <v-btn text>
          <router-link to="/about">About</router-link>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar> -->
    <v-main>
      <router-view v-if="!forceUpdate" />
      <!-- <CheckforUpdate
        :text="forceUpdate ? 'FORCE UPDATE IN PROGRESS' : 'CHECK FOR UPDATE'"
        :forceUpdate="forceUpdate"
        :class="forceUpdate ? 'force-update' : 'check-update'"
      /> -->
      <v-btn
        v-if="!forceUpdate"
        elevation="12"
        icon
        style="position:fixed;bottom: 3%; right: 2%; outline: none"
        @click="scrollToTop"
        v-show="visible"
      >
        <i class="mdi mdi-arrow-up-thick mdi-24px"></i>
      </v-btn>
      <v-overlay :value="forceUpdate" :z-index="0" :opacity="0.8"></v-overlay>
      <ConnectivityModal
        :showDialog="showConnectivityModal"
        :connectivitySpeed="connectivitySpeed"
        @closeDialog="showConnectivityModal = false"
      />
      <v-snackbar
        id="alerts"
        :timeout="3000"
        :value="alert"
        color="success"
        elevation="24"
      >
      <i class="mdi mdi-24px mdi-wifi-check mr-3" ></i>
        Good Internet Established. You Can Resume Your Work.
      </v-snackbar>
    </v-main>
    <detected-speed @network-speed="handleNetworkSpeed"></detected-speed>
  </v-app>
</template>

<script>
import DetectedSpeed from "vue-identify-network";
import CheckforUpdate from "./components/CheckforUpdate.vue";
import ConnectivityModal from "./components/ConnectivityModal.vue";

const { ipcRenderer } = window.require("electron");
export default {
  name: "App",
  data() {
    return {
      forceUpdate: false,
      showConnectivityModal: null,
      connectivitySpeed: null,
      alert: false,
      visible : false,
    };
  },
  components: {
    CheckforUpdate,
    DetectedSpeed,
    ConnectivityModal,
  },
  mounted () {
    window.addEventListener('scroll', this.scrollListener)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollListener)
  },
  methods: {
    scrollToTop(){
      window.scrollTo(0,0)
    },
    scrollListener(e) {
      this.visible = window.scrollY > 150
    },
    handleNetworkSpeed(speed) {
      if (speed < 0.5) {
        this.showConnectivityModal = true;
        this.connectivitySpeed = speed;
      } else if (this.showConnectivityModal==null && speed >= 0.5) {
        this.showConnectivityModal = false;
      } else {
        this.showConnectivityModal = false;
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        },3000);
      }
    },
  },
};
</script>

<style>
#close:hover {
  background-color: red;
}
#minimize:hover {
  background-color: darkgray;
}
#fullscreen:hover {
  background-color: darkgray;
}
.check-update {
  position: absolute;
  bottom: 2%;
  left: 2%;
}
.force-update {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
