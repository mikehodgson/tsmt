import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
// import './assets/styles/bootstrap-dark.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/styles/bootstrap-dark.css';
import './assets/styles/app.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.prototype.$eventHub = new Vue();

new Vue({
  render: h => h(App)
}).$mount('#app');
