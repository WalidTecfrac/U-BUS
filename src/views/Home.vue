<template>
  <div class="home">
    <DataTable/>
  </div>
</template>

<script>
import DataTable from "../components/DataTable.vue";

export default {
  name: 'Home',
  components: {
    DataTable,
  },
};
</script>
