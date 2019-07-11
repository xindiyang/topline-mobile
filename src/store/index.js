import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 初始化的时候从本地存储获取用户信息（里面有token等内容）
    user: JSON.parse(window.localStorage.getItem('user'))
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 持久化到本地存储，防止页面刷线状态丢失
      window.localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {
  }
})
