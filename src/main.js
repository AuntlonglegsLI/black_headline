import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 注册 Vant 组件
import './util/register'

// 引入公共样式
import './styles/index.less'

// 引入 REM 适配
import 'amfe-flexible'

// 引入 dayjs 过滤器
import './util/dayjs'

import request from './util/request'
Vue.prototype.$axios = request

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
