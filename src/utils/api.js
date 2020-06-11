import request from './request'

// 调用搜索接口
export const search = (keywords) => {
  return request.get('/v1_0/search?q=' + keywords)
}

// 发送验证码
export const sendCode = (mobile) => {
  return request.get('/v1_0/sms/codes/' + mobile)
}

// 登录
export const login = (mobile, code) => {
  return request.post('/v1_0/authorizations', { mobile, code })
}

// 获取全部新闻频道
export const getAllChannels = () => {
  return request.get('/v1_0/channels')
}

// 获取用户的频道
export const getUserChannels = () => {
  return request.get('/v1_0/user/channels')
}

// 删除用户的频道
export const deleteUserChannel = channelId => {
  return request.delete('/v1_0/user/channels/' + channelId)
}

// 添加用户频道
export const addUserChannel = data => {
  return request.patch('/v1_0/user/channels', data)
}

// 获取某一个频道下面的新闻
export const getChannelArticles = (channelId, page, perPage) => {
  let timestamp = Date.now()
  return request.get(`/v1_1/articles?channel_id=${channelId}&timestamp=${timestamp}&with_top=1&page=${page}&per_page=${perPage}`)
}