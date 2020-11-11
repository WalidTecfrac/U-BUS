<template>
<v-data-table
    :headers="tableheaders"
    :items="tabledata"
    class="elevation-12"
    dense
    loading-text="Loading... Please wait"
  ></v-data-table>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      tableheaders: [
        {
          text: "Employee ID",
          align: "start",
          sortable: true,
          value: "employeeid",
        },
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Money", value: "money" },
        { text: "Something Else", value: "something else" },
      ],
      tabledata: [
        {
          employeeid: 420,
          id: 1,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 2,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 3,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 4,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 5,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 6,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 7,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 8,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 9,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 10,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 11,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 12,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 13,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 14,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 15,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 16,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 17,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
        {
          employeeid: 420,
          id: 18,
          name: "Walid",
          money: 0,
          "something else": "i dont know",
        },
      ],
    };
  },
};
</script>
