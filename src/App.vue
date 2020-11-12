<template>
  <v-app style="overscroll: hidden !important">
    <v-system-bar class="p-0" height="30" >
       <v-icon style="margin: 0;">
         <v-img :src="icon">
         </v-img>
         </v-icon>
      <!-- <v-btn x-small text height="40" style="outline: none" @click="addNewTab()">
        <v-icon style="margin: 0;>mdi-tab-plus</v-icon>
      </v-btn> -->
      <v-spacer></v-spacer>
      <v-btn id="minimize" tile x-small text height="30" style="outline: none" @click="minimize()" >
        <v-icon style="margin: 0;">mdi-minus</v-icon>
      </v-btn>
      <v-btn id="fullscreen" tile x-small text height="30" style="outline: none" @click="fullscreen()" >
        <v-icon style="margin: 0;">mdi-checkbox-multiple-blank-outline</v-icon>
      </v-btn>
      <v-btn id="close" tile x-small text height="30" style="outline: none" @click="close()">
        <v-icon style="margin: 0;">mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar v-if="!forceUpdate" max-height="48" style="width: 100%">
      <v-toolbar-items>
        <v-menu transition="slide-y-transition" rounded="b-xl">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              x-large
              max-height="48"
              style="background-color: red; outline: none"
            >
              Services
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in services" :key="i">
              <v-list-item-title style="text-align: center">
                <i class="mdi mdi-48px" :class="item.mdiname"></i>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn text>
          <router-link to="/">Home</router-link>
        </v-btn>
        <v-btn text>
          <router-link to="/about">About</router-link>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main v-if="!forceUpdate">
      <router-view />
      <CheckforUpdate
        class="absolute"
        style="bottom: 2%; left: 2%"
        :text="'check for update'"
      />
      <v-btn
        elevation="12"
        icon
        class="absolute"
        style="bottom: 3%; right: 2%; outline: none"
      >
        <i class="mdi mdi-arrow-up-thick mdi-24px"></i>
      </v-btn>
    </v-main>
    <v-container fill-height style="width: 100%" v-if="forceUpdate">
      <CheckforUpdate :text="'force update in progress'" />
    </v-container>
  </v-app>
</template>

<script>
import CheckforUpdate from "./components/CheckforUpdate.vue";
import icon from '../public/favicon.ico';

const { ipcRenderer } = window.require("electron");
export default {
  name: "App",
  data() {
    return {
      services: [
        { mdiname: "mdi-bus" },
        { mdiname: "mdi-credit-card-outline" },
        { mdiname: "mdi-printer" },
        { mdiname: "mdi-form-select" },
      ],
      forceUpdate: true,
    };
  },
  components: {
    CheckforUpdate,
  },
  methods: {
    close() {
      ipcRenderer.send("close-app");
    },
    fullscreen() {
      ipcRenderer.send("fullscreen-app");
    },
    minimize() {
      ipcRenderer.send("minimize-app");
    },
    //  addNewTab() {},
  },
};
</script>

<style>
#close:hover{
background-color: red;
}
#minimize:hover {
background-color:darkgray;
}
#fullscreen:hover {
background-color: darkgray;
}
</style>
