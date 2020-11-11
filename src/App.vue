<template>
  <v-app style="overscroll: hidden !important">
    <v-app-bar max-height="48" style="width: 100%">
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
    <v-main>
      <router-view />
      <!-- <v-btn
        color="white"
        elevation="12"
        icon
        x-large
        dark
        class="absolute"
        style="top: 2%; left: 2%; background-color: red; outline: none"
        @click="addNewTab()"
      >
        <i class="mdi mdi-tab-plus mdi-24px"></i>
      </v-btn> -->
      <CheckforUpdate class="absolute" style="bottom: 2%; left: 2%" />
      <v-btn
        elevation="12"
        icon
        class="absolute"
        style="bottom: 3%; right: 2%; outline: none"
      >
        <i class="mdi mdi-arrow-up-thick mdi-24px"></i>
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import CheckforUpdate from "./components/CheckforUpdate.vue";

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
    };
  },
  components: {
    CheckforUpdate,
  },
  methods: {
    addNewTab() {
    },
  },
};
</script>
