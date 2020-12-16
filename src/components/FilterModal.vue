<template>
  <v-row justify="center" style="overflow: hidden">
    <v-dialog
      v-model="value"
      persistent
      max-width="600px"
      style="overflow: hidden"
    >
      <v-card>
        <v-card-title style="background-color: lightgray">
          <span class="headline">Filtering {{ data.label }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="data.type == 'String'">
              <v-col>
                <v-autocomplete
                  v-model="filters"
                  :items="data.items"
                  chips
                  color="blue-grey lighten-2"
                  label="Search"
                  :item-text="data.label"
                  :item-value="data.label"
                  multiple
                >
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="remove(data.item)"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <v-list-item-content
                      v-text="data.item"
                    ></v-list-item-content>
                  </template>
                </v-autocomplete>
                <v-list-item-group
                  v-model="filters"
                  multiple
                  style="overflow: auto; max-height: 400px"
                >
                  <v-list-item
                    v-for="(item, index) in uniqueData"
                    :key="index"
                    :value="item"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          color="primary"
                        ></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-col>
            </v-row>
            <v-row v-else-if="data.type == 'Number'"> </v-row>
            <v-row v-else-if="data.type == 'Date'"> </v-row>
            <v-row v-else-if="data.type == 'Money'"> </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              updateValue($event.target.value);
              applyFilter();
            "
          >
            Apply
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateValue($event.target.value)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
    data: {
      type: Object,
    },
  },
  created() {
    this.uniqueData = _.uniq(this.data.items);
  },
  data() {
    return {
      filters: [],
      uniqueData: [],
    };
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
    applyFilter() {
      this.$emit("filterwith", {
        filters: this.filters,
        label: this.data.label,
        name: this.data.name,
      });
    },
    remove(item) {
      const index = this.filters.indexOf(item);
      if (index >= 0) this.filters.splice(index, 1);
    },
  },
};
</script>

<style>
</style>