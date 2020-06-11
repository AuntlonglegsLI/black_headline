import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入less样式文件
import "./styles/index.less"

// 使用 [amfe-flexible] 动态设置 REM 基准值（html 标签的字体大小）
import 'amfe-flexible'

// 引入 dayjs 过滤器
import './utils/day'

// 按需注册 Vant 组件
import "./utils/register-vant.js";
Vue.config.productionTip = false

import request from './utils/request'
Vue.prototype.$axios = request

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
