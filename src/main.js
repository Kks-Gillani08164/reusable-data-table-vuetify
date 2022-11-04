import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");

          break;
      }
      return Promise.reject(error.response);
    }
  }
);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
