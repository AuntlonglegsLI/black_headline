import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 定义在保存的数据
  state: {
    // 从本地存储中读取并转成一个对象
    user: JSON.parse(localStorage.getItem('user'))
  },
  // 定义修改 state 中数据的函数
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了让数据长久保存，需要写入浏览器（本地存储）
      // 注意：浏览器中只能保存字符串 如果要保存对象需要使用 JSON.stringify
      localStorage.setItem('user', JSON.stringify(data))
    }
  },
  actions: {
  },
  modules: {
  }
})