import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
// vant官方提供了四种方式引入组件，我们初期开发直接导入所有的组件
import 'vant/lib/index.css'
import 'amfe-flexible'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
