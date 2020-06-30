<template>
  <div class="tabbar">
    <keep-alive>
      <!-- 显示子路由页面 -->
      <router-view />
    </keep-alive>

    <!-- 底部导航栏 -->
    <van-tabbar placeholder route>
      <van-tabbar-item to="/" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/wenda" icon="notes-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="play-circle-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
.tabbar{
  height: 100%;
}
</style>
