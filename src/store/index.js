import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import header_store from './modules/header';

export default new vuex.Store({
  modules: {
    headerStore: header_store
  }
})
