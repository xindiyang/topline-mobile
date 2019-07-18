import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/tabbar-layout'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home')
        },
        {
          path: '/qustion',
          name: 'question',
          component: () => import('@/views/Question')
        },
        {
          path: '/videos',
          name: 'videos',
          component: () => import('@/views/Videos')
        },
        {
          path: '/my',
          name: 'my',
          component: () => import('@/views/My')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search')
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: () => import('@/views/search-result')
    },
    {
      name: 'article',
      path: '/article/:articleId',
      component: () => import('@/views/article')
    }
  ]
})
