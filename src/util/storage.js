// 获取用户历史
export const getItem = (msg) => {
    return JSON.parse(localStorage.getItem(msg))
}

// 更新用户历史
export const setItem = (msg) => {
    return localStorage.setItem('search-histories', msg)
}

