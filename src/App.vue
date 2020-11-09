<template>
  <v-app>
    <v-main>
      <CheckforUpdate />
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

  data: () => ({
  }),
};
</script>
