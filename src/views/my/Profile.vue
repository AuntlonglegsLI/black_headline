<template>
  <div class="profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      right-text="编辑"
      left-arrow
      @click-left="$router.back()"
      @click-right="$router.push('/edit_profile')"
    />
    <van-cell-group title="个人资料">
      <van-cell title="用户名" :value="userInfo.name" />
      <van-cell title="头像">
        <van-image
          round
          width="50px"
          height="50px"
          fit="cover"
          :src="userInfo.photo"
        />
      </van-cell>
      <van-cell
      title="是否认证"
      :value="userInfo.is_media ? '已认证' : '未认证'" />
      <van-cell title="个人简介" :value="userInfo.intro" />
      <van-cell title="文章数量" :value="userInfo.art_count" />

    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>
