import Vue from 'vue';
import App from './App.vue';
import store from './store/store';

Vue.config.productionTip = false;
Vue.config.debug = true;
Vue.config.devtools = true;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
