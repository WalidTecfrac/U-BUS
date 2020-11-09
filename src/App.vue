<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase"> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
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
      <CheckforUpdate />
      <v-btn elevation="12" icon ></v-btn>
    </v-main>
  </v-app>
</template>

<script>
import CheckforUpdate from "./components/CheckforUpdate.vue";

export default {
  name: "App",

  components: {
    CheckforUpdate,
  },

  data: () => ({}),
};
</script>
