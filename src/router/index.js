import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index/Index.vue'
import Tabbar from '../views/Tabbar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Tabbar,
    children: [
      {
        path: '',
        component: Index
      },
      {
        path: 'wenda',
        component: () => import('../views/wenda/Index.vue')
      },
      {
        path: 'video',
        component: () => import('../views/video/Index.vue')
      },
      {
        path: 'my',
        component: () => import('../views/my/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
