<template>
  <v-app>
    <v-main
      ><template>
        <v-card>
          <data-table
            :headers="headers"
            :loader="loadData"
            title="Users Table"
            :addRecord="true"
            @add-record="addRecord"
            :editHandler="editHandler"
            :viewHandler="viewHandler"
            :deleteHandler="deleteHandler"
            :allowFilters="true"
          >
          </data-table>
        </v-card>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import DataTable from "./components/DataTable.vue";
import { UserService } from "./services/user-service";
export default {
  components: { DataTable },
  data() {
    return {
      service: new UserService(),
      headers: [
        {
          text: "User Name",
          value: "username",
          sortable: true,
        },
        {
          text: "Full Name",
          value: "name",
          sortable: false,
          filterable: false,
        },
        {
          text: "Email Address",
          value: "email",
          sortable: false,
          filterable: false,
        },
        {
          text: "Website",
          value: "website",
          sortable: false,
        },
      ],
    };
  },

  methods: {
    loadData() {
      return this.service.fetchAll();
    },
    addRecord() {
      console.log("Record Added");
    },
    editHandler() {
      console.log("Edit Handler");
    },
    viewHandler() {
      console.log("Edit Handler");
    },
    deleteHandler() {
      console.log("Edit Handler");
    },
  },
};
</script>
<style>
body {
  padding: 5rem;
}
</style>
