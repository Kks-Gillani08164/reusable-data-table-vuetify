<template>
  <div>
    <div class="px-4 py-6 d-flex justify-space-between">
      <h1 class="text-h5">{{ title }}</h1>
      <div>
        <v-btn v-if="addRecord" color="primary" @click="$emit('add-record')">
          Add New
        </v-btn>
        <v-btn
          id="refresh"
          class="refresh"
          icon
          style="margin-left: 15px"
          @click="loadData"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn v-if="allowFilters" icon style="margin-left: 10px">
          <v-icon @click="$emit('filter')">mdi-filter</v-icon>
        </v-btn>
      </div>
    </div>
    <v-data-table
      :loading="loading"
      :items="items"
      :headers="headersValue"
      :search="search"
      @page-count="pageCount = $event"
      :page.sync="page"
      hide-default-footer
      :hide-default-header="$vuetify.breakpoint.width < 964"
      :class="$vuetify.breakpoint.width < 964 ? 'mobile' : ''"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search..."
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:item="{ item }">
        <tr v-if="$vuetify.breakpoint.width < 964">
          <td v-for="(elem, key) of headers" :key="key">
            <div class="flex-content">
              <h4 class="text-h5">{{ elem.text }}</h4>
              <span class="arrange-item">
                <slot :name="elem.value" :item="item">{{
                  item[elem.value]
                }}</slot>
              </span>
            </div>
          </td>
          <td
            v-if="viewHandler || editHandler || deleteHandler"
            class="justify-center"
          >
            <slot name="extra-actions" :item="item" />

            <v-avatar color="grey lighten-2 mr-2">
              <v-icon
                v-if="viewHandler"
                @click="viewHandler(item)"
                color="blue"
              >
                mdi-eye
              </v-icon>
            </v-avatar>

            <v-avatar color="grey lighten-2 mr-2" :elevation="3">
              <v-icon
                v-if="editHandler"
                @click="editHandler(item)"
                color="green"
              >
                mdi-pencil
              </v-icon>
            </v-avatar>

            <v-avatar color="grey lighten-2">
              <v-icon v-if="deleteHandler" @click="onDelete(item)" color="red">
                mdi-delete
              </v-icon>
            </v-avatar>
          </td>
          <v-divider></v-divider>
        </tr>
        <tr v-else>
          <td
            v-for="(elem, key) of headers"
            :key="key"
            :class="`text-${
              elem.align === 'center'
                ? 'center'
                : elem.align === 'right'
                ? 'end'
                : 'start'
            }`"
          >
            <slot :name="elem.value" :item="item">{{ item[elem.value] }}</slot>
          </td>
          <td
            v-if="viewHandler || editHandler || deleteHandler"
            class="text-end"
          >
            <slot name="extra-actions" :item="item" />

            <v-avatar color="grey lighten-2 ma-2" size="40">
              <v-icon
                v-if="viewHandler"
                @click="viewHandler(item)"
                color="blue"
              >
                mdi-eye
              </v-icon>
            </v-avatar>

            <v-avatar color="grey lighten-2 ma-2" size="40">
              <v-icon
                v-if="editHandler"
                @click="editHandler(item)"
                color="green"
              >
                mdi-pencil
              </v-icon>
            </v-avatar>

            <v-avatar color="grey lighten-2 ma-2" size="40">
              <v-icon v-if="deleteHandler" @click="onDelete(item)" color="red">
                mdi-delete
              </v-icon>
            </v-avatar>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div>
      <v-pagination
        class="mt-10 pb-7"
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataTable",

  props: {
    headers: {
      type: Array,
      required: true,
    },
    loader: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    allowFilters: {
      type: Boolean,
      default: false,
    },
    addRecord: {
      type: Boolean,
      default: false,
    },
    viewHandler: {
      type: Function,
      default: null,
    },
    editHandler: {
      type: Function,
      default: null,
    },
    deleteHandler: {
      type: Function,
      default: null,
    },
  },

  emits: ["add-record"],

  data() {
    return {
      loading: false,
      search: "",
      items: [],
      headersValue: [],
      errorValue: {},
      error: false,
      page: 1,
      pageCount: 0,
      dataContainer: "data-container",
    };
  },

  mounted() {
    this.headersValue = [...this.headers];
    if (this.editHandler || this.deleteHandler || this.viewHandler) {
      this.headersValue.push({
        text: "Actions",
        search: false,
        align: "center",
        sortable: false,
      });
    }
    this.loadData();
  },

  methods: {
    async loadData() {
      this.loading = true;
      try {
        this.items = await this.loader();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.errorValue = {
          title: "Error while loading data",
          description: e?.response?.data?.error ?? "Some Error occurred",
        };
        this.error = true;
      }
    },
    async onDelete(item) {
      if (confirm("This Item will be delete")) {
        try {
          this.loading = true;
          await this.deleteHandler(item);
          this.loading = false;
          this.items.splice(this.items.indexOf(item), 1);
        } catch (e) {
          window.console.log(e);
        }
      }
    },
  },
};
</script>
<style scoped>
.mobile {
  color: #333;
}

@media screen and (max-width: 964px) {
  .mobile table tbody tr {
    max-width: 100%;
    position: relative;
    display: block;
    margin-bottom: 3rem;
  }

  .mobile table tbody tr:nth-child(odd) {
    border-left: 6px solid #6a1b9a;
  }

  .mobile table tbody tr:nth-child(even) {
    border-left: 6px solid #ff5252;
  }

  .mobile table tbody tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
    padding-inline: 2rem;
  }
}

.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.flex-content h4 {
  font-size: 0.8rem !important;
  font-weight: 500;
}

.flex-content span {
  font-size: 0.8rem;
}

.arrange-item {
  width: max-content;
}
</style>
