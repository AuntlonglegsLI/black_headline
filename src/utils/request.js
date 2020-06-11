import axios from 'axios'
import jsonBigInt from 'json-bigint'
// 导入 Vuex
import store from '../store'

const baseURL = 'http://ttapi.research.itcast.cn/app'

// 创建 axios 对象
const request = axios.create({
  baseURL
})

// 前置（请求）拦截器：在每次发送请求之前执行的
request.interceptors.request.use(
  function(config) {
    // 在每次发送请求之前执行的代码写在这里
    // 把令牌放到协议头上
    // 如果 Vuex 中有令牌就设置到协议头上
    if (store.state.user) {
      config.headers.Authorization = 'Bearer ' + store.state.user.token
    }
    return config
  },
  function(error) {
    // 在每次发送请求之前如果出错执行的代码

    return Promise.reject(error)
  }
)

// 后置（响应）拦截器：每次调用接口成功返回时执行
request.interceptors.response.use(
  function(response) {
    // 接口调用成功返回时执行

    return response
  },
  function(error) {
    // 调用接口返回失败时执行

    // console.dir(error)

    // 没有登录或者令牌过期了
    if (error.response.status == 401) {
      // 判断本地是否有令牌
      if (store.state.user) {
        // 使用 刷新令牌 重新更新令牌
        axios.put(baseURL + '/v1_0/authorizations', {}, {
          headers: {
            Authorization: 'Bearer ' + store.state.user.refresh_token
          }
        }).then(res => {
          // 更新本地令牌
          store.commit('setToken', res.data.data.token)
          // 重新调用接口
          // return request.get(error.config.url)

        })
      }
    }


    return Promise.reject(error);
  }
)

// 配置自定义解析 JSON
// 总结：后端接口会返回非常大的整数（超出了 JS 的安全整数范围，
// 这时要使用 JSON.parse 转 JSON 时会出错，
// 所以我们需要使用 json-bigint 包来转
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBigInt.parse(data)
  } catch {
    return {}
  }
}]

// 导出配置好的 axios 对象
export default request