import Vue from 'vue'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'  // 引入中文包
import relativeTime from 'dayjs/plugin/relativeTime' // 计算相对时间的插件

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

// 把 dayjs 注册成 Vue 的全局过滤器
// value：要处理的数据
// 返回值：处理之后的结果
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})