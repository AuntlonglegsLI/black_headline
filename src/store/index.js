import Vue from 'vue'
import Vuex from 'vuex'
import { getMyInfo } from '../util/api'

Vue.use(Vuex)

export default new Vuex.Store({
  // 定义在保存的数据
  state: {
    // 从本地存储中读取并转成一个对象
    user: JSON.parse(localStorage.getItem('user')),
    userInfo: {}    // 用户的详细信息
  },
  // 定义修改 state 中数据的函数
  mutations: {
    // state：代表上面的 state
    // data：要修改的数据
    setUser(state, data) {
      state.user = data
      // 为了让数据长久保存，需要写入浏览器（本地存储）
      // 注意：浏览器中只能保存字符串！！如果要保存对象需要使用 JSON.stringify
      localStorage.setItem('user', JSON.stringify(data))
    },
    // 更新 token
    setToken(state, token) {
      state.user.token = token
      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    // 清空 user
    logout(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    // 合并更新 userInfo 所有数据
    setUserInfo(state, data) {
      Object.assign(state.userInfo, data)
    },
    // 初始化 userInfo
    initUserInfo(state, data) {
      state.userInfo = data
    },
    // 修改 userInfo 中的 photo 的值
    setPhoto(state, newPhoto) {
      state.userInfo.photo = newPhoto
    }
  },
  // 复杂的操作：调用接口的代码
  actions: {
    // 获取用户信息
    getUserInfo(context) {
      // 获取接口获取用户信息
      getMyInfo().then(res => {
        // 把得到的用户信息保存到 state.userInfo 中
        // 调用 mutations 中的 setUserInfo 来修改 state.userInfo （state 中的数据必须要通过 mustions 来修改）
        context.commit('initUserInfo', res.data.data)
      })
    }
  },
  modules: {
  }
})
