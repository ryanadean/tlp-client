import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io-extended'
import store from './store'
import $socket from './lib/socket-instance'
import VueChartKick from 'vue-chartkick'
import VueRouter from 'vue-router'
import Chart from 'chart.js'
import './lib/chart-shadows'
import router from './router/routes'



Vue.config.productionTip = false
Vue.use(VueSocketIO, $socket, {
  store
})
Vue.use(VueChartKick, {adapter: Chart})
Vue.use(VueRouter)

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')