<template>
  <v-container class>
    <v-btn class="ml-4 " text @click="checkForUpdates()"> Check For Updates</v-btn>
  </v-container>
</template>

<script>

export default {
  name: "CheckforUpdate",
  methods: {
    checkForUpdates() {
      console.log("hello");
    },
  },
};
</script>
