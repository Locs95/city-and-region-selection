import Vue from 'vue'
import App from './App.vue'
import jquery from 'jquery'
import bootstrap from '../node_modules/bootstrap/dist/js/bootstrap.min.js'

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')


