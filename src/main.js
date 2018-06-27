// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Vuex from 'vuex'
import moment from 'moment';
import VueI18n from 'vue-i18n';
import Validation from './validate/validation';
import pagination from './assets/plugin/pagination';
import store from './store';
import 'font-awesome/css/font-awesome.css'
import './style/main.css'
import "babel-polyfill";
import customJsonp from './validate/customJsonp';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(iView);

//表单验证插件
Vue.use(Validation);
//国际化
Vue.use(VueI18n);

Vue.use(customJsonp);

const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./lang/zh'),   // 中文语言包
  }
});
//Vue.prototype.$store = store

//时间格式化插件
Vue.prototype.$moment = moment
moment.locale('zh_cn');

// 引用API文件
import api from './api/index.js'
// 将API方法绑定到全局
Vue.prototype.$api = api

// 引用工具文件
import utils from './utils/index.js'
// 将工具方法绑定到全局
Vue.prototype.$utils = utils


//qs
import qs from 'qs'
Vue.prototype.$qs = qs

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,  //国际化
  router,
  store,//使用store
  components: { App },
  template: '<App/>'
})
