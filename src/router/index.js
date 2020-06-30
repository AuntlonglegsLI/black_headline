import Vue from 'vue'
import VueRouter from 'vue-router'
import Tabbar from '../views/Tabbar.vue'
import Index from '../views/index/Index.vue'
import { Dialog } from 'vant'
import store from '../store'

Vue.use(VueRouter)

// 配置路由页面的数组
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
        component: () => import('../views/my/Index.vue'),
        // 自定义的一些数据
        meta: {
          mustLogin: true   // 这个页面必须登录才能访问
        }
      },
      {
        path: 'search',
        component: () => import('../views/search/Index.vue')
      },
    ]
  },
  {
    path: '/search/:q',
    component: () => import('../views/searchResult/Index.vue')
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/content/:id',
    component: () => import('../views/index/Content.vue')
  },
  {
    path: '/fankui',
    component: () => import('../views/my/Fankui.vue'),
    meta: {
      mustLogin: true   // 这个页面必须登录才能访问
    }
  },
  {
    path: '/xiaozhi',
    component: () => import('../views/my/Xiaozhi.vue'),
    meta: {
      mustLogin: true   // 这个页面必须登录才能访问
    }
  },
  {
    path: '/profile',
    component: () => import('../views/my/Profile.vue'),
    meta: {
      mustLogin: true   // 这个页面必须登录才能访问
    }
  },
  {
    path: '/edit_profile',
    component: () => import('../views/my/EditProfile.vue'),
    meta: {
      mustLogin: true   // 这个页面必须登录才能访问
    }
  }
]

// 创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注册一个路由导航守卫（钩子函数）
// beforeEach:在每次跳转之前调用这个函数
// to:跳转后的路由对象（下一页）
// from：跳转前的路由对象（上一页）
// next：函数
//    next(false) :阻止跳转
//    next():   // 通过
//    next(路径)  // 重定向到这个地址
router.beforeEach(function (to, from ,next) {
  // 判断下一个页面上是否标记了必须要登录
  if (to.meta.mustLogin) {
    // 判断登录
    if (store.state.user) {
      // 通过
      next()
    } else {
      // 弹出对话框
      Dialog.confirm({
        message: '必须登录才能访问，是否现在去登录？'
      }).then(() => {
        // 跳转到登录页面
        next('/login')
      }).catch(() => {
        next(false)
      })
    }
  } else {
    // 通过
    next()
  }
})

export default router
