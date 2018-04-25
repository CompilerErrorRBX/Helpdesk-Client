import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';

import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';

import App from './App';
import router from './router';
import store from './store';

axios.defaults.headers.common.Authorization = localStorage.getItem('jwt');

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.base,
    secondary: colors.amber.base,
    accent: colors.blue.accent1,
    error: colors.red.base,
  },
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App />',
});
