import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
// vant官方提供了四种方式引入组件，我们初期开发直接导入所有的组件
import 'vant/lib/index.css'
import 'amfe-flexible'
import relativeTime from './filters/relative-time'
import Vant, { Lazyload } from 'vant'

Vue.use(Vant)
// 注册 Vant 的图片懒加载自定义指令
Vue.use(Lazyload)

// 注册一个全局过滤器：处理相对时间
Vue.filter('relativeTime', relativeTime)

Vue.config.productionTip = false
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
