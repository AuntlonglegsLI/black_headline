import request from './request'

// 调用搜索接口
export const search = (keywords) => {
  return request.get('/v1_0/search?q=' + keywords)
}

// 调用联想建议
export const suggestion = (keywords) => {
  return request.get('/v1_0/suggestion?q=' + keywords)
}

// 获取搜索结果
export const getSearchResult = (params) => {
  let page = params.page
  let per_page = params.per_page
  let q = params.q
  return request.get(`/v1_0/search?page=${page}&per_page=${per_page}&q=${q}`)
}

// 获取用户搜索历史
// export const getSearchHistory = (params) => {
//   let page = params.page
//   let per_page = params.per_page
//   let q = params.q
//   return request.get(`/v1_0/search?page=${page}&per_page=${per_page}&q=${q}`)
// }

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
export const getChannelArticles = (channelId, timestamp) => {
  return request.get(`/v1_1/articles?channel_id=${channelId}&timestamp=${timestamp}&with_top=1`)
}

// 根据 ID 获取文章详情
export const getArticleById = artId => {
  return request.get('/v1_0/articles/' + artId)
}

// 关注作者
export const followById = userId => {
  // 在 body 中传参数
  return request.post('/v1_0/user/followings', { target: userId })
}

// 取消关注作者
export const deleteFollowById = userId => {
  // 在 url 上传参数
  return request.delete('/v1_0/user/followings/' + userId)
}

// 获取文章的评论
// artId：文章ID
// offset：翻页用的ID，第一页时不传
export const getCommentsByArtId = (artId, offset) => {
  let params = {
    type: 'a',
    source: artId
  }
  // 如果有 offset 就传参数
  if (offset) {
    params.offset = offset
  }
  return request.get('/v1_0/comments', { params })
}

// 发表评论
export const addComment = (target, content) => {
  return request.post('/v1_0/comments', {
    target,
    content
  })
}

// 对评论点赞
export const zanComment = target => {
  return request.post('/v1_0/comment/likings', {
    target
  })
}

// 对评论取消点赞
export const cancelZanComment = target => {
  return request.delete('/v1_0/comment/likings/' + target)
}

// 修改头像
export const uploadAvatar = photo => {
  // 上传文件时一般需要创建一个 FormData 再提交
  let form = new FormData()
  // 参数一、接口文档上规定的参数名
  // 参数二、本地图片的令牌
  form.append('photo', photo)
  // 调用接口上传
  return request.patch('/v1_0/user/photo', form)
}

// 获取我的信息
export const getMyInfo = () => {
  return request.get('/v1_0/user')
}

// 更新个人资料
export const updateProfile = data => {
  return request.patch('/v1_0/user/profile', data)
}

/*
模块化技术（一个文件就是一个模块，在其他模块中可以互相引入）
实现模块化两套技术：
1. ES6中的：（前端：Vue、React）
          export 和 export default 导出
          import ... from           导入

2. Node 中：（后端）
          module.export 和 export 导出
          require                导入


1. export 是干什么用的？
答：导出，只能导出的东西才能在其他页面中通过 import ... from ... 导入

2. export 和 export default 有什么区别？
  export 是一个一个的导出，一个页面中可以有多个 export 。
  export default ：把所有的东西放到一个对象中，一次导出，一个页面中一般只能有一个 export default
  如何选择？
  两种写法都行。
*/
