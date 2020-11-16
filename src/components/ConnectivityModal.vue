<template>
  <v-dialog persistent max-width="400" v-model="showDialog" >
    <v-card >
      <v-card-title class="headline" :style="connectivitySpeed == 0 ? 'background-color:red;':'background-color:rgb(254, 216, 89);'" >
        <i class="mdi mdi-24px mr-3" :class="connectivitySpeed == 0 ? 'mdi-wifi-off':'mdi-wifi-alert' "></i>
        {{connectivitySpeed == 0 ? "No network Detected".toUpperCase() : "slow network detected".toUpperCase()}}
      </v-card-title>
      <v-card-text class="pt-2"
        >{{"Make Sure your computer has an active Internet Connection".toUpperCase()}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "ConnectivityModal",
  methods: {
    closeDialog()  {
      this.$emit('closeDialog');
    },
  },
  props: ["showDialog", "connectivitySpeed"],
};
</script>
<