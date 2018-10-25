import Vue from 'vue';
import VueFuse from 'vue-fuse';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';

// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/styles/bootstrap-dark.css';
import './assets/styles/app.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueFuse);

Vue.prototype.$eventHub = new Vue();

Vue.mixin({
  methods: {
    getMissionLabel(mission) {
      let label = `${mission.program}`;
      let card_info = '';
      if (mission.program != mission.player) label += ` - ${mission.player}`;
      card_info += (mission.rating != '') ? `${mission.rating}/` : '-/';
      card_info += (mission.series != '') ? `${mission.series}/` : '-/'; 
      card_info += (mission.position != '') ? `${mission.position}` : '-';
      if (card_info != '-/-/-')  label += ` (${card_info})`;
      return label;
    }
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app');
