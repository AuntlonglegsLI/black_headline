<template>
  <div class="my">
    <!-- 顶部蓝色背景 -->
    <van-cell class="my-userinfo">
      <van-uploader
        slot="icon"
        :after-read="onAfterRead"
      >
        <!-- 头像：icon -->
        <van-image
          round
          width="76px"
          height="76px"
          fit="cover"
          :src="userInfo.photo"
        />
      </van-uploader>

      <!-- 用户名： -->
      <div slot="title">{{userInfo.name}}</div>

      <!-- 申请认证：label -->
      <van-button
        slot="label"
        size="mini"
        round
        type="info"
        v-if="userInfo.is_media == 0"
      >
        申请认证
      </van-button>
      <van-tag
        v-else
        slot="label"
        type="warning"
      >
        已认证
      </van-tag>


      <!-- 今天阅读 -->
      <div class="my-read">
        <van-icon size="25" name="description"></van-icon>
        <div>
          今日阅读 <br />
          5分钟
        </div>
      </div>
    </van-cell>

    <!-- 动态、关注、粉丝 -->
    <div class="my-numinfo">
      <div>{{userInfo.art_count}}<br />动态</div>
      <div>{{userInfo.follow_count}}<br />关注</div>
      <div>{{userInfo.fans_count}}<br />粉丝</div>
    </div>

    <van-grid :column-num="3" :border="false">
      <van-grid-item text="收藏">
        <van-icon color="#EB5859" slot="icon" name="location-o" />
      </van-grid-item>
      <van-grid-item text="历史">
        <van-icon color="#FFA127" slot="icon" name="like-o" />
      </van-grid-item>
      <van-grid-item text="wtkk">
        <van-icon color="#6C92FF" slot="icon" name="fire-o" />
      </van-grid-item>
    </van-grid>

    <!-- 消息通知 -->
    <van-cell-group>
      <van-cell to="/profile" title="个人资料" is-link />
      <van-cell title="消息通知" is-link />
      <van-cell title="实名认证" is-link />
    </van-cell-group>

    <van-cell-group>
      <van-cell to="/fankui" title="用户反馈" is-link />
      <van-cell to="/xiaozhi" title="小智同学" is-link />
      <van-cell title="系统设置" is-link />
    </van-cell-group>

    <!-- 退出 -->
    <van-button
    class="logout-btn"
    type="danger"
    @click="logout"
    >
      退出
    </van-button>

  </div>
</template>

<script>
import { uploadAvatar } from '@/util/api'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  // 计算属性
  computed: {
    ...mapState(['userInfo'])
  },
  // 这个页面创建完之后就调用
  created() {
    // 调用 Vuex 中的 actions 中的 getUserInfo 方法获取用户数据
    this.$store.dispatch('getUserInfo')
  },
  methods: {
    ...mapMutations(['setPhoto']),
    logout() {
      // 调用 Vuex 中 mutations 中的 logout 方法
      this.$store.commit('logout')
      // 跳转到首页
      this.$router.push('/')
    },
    // uploader 组件在选择图片之后调用的函数
    // file:选择的图片信息
    async onAfterRead(file) {
      try {
        // 调用接口上传图片到服务器
        let ret = await uploadAvatar(file.file)
        // 上传成功之后，使用返回的图片路径更新头像
        // 把新的头像路径更新到 Vuex 中
        this.setPhoto(ret.data.data.photo)
        // 提示
        this.$toast.success('更新成功！')
      } catch (error) {
        this.$toast.fail('上传头像失败！')
      }
    }
  },
}
</script>

<style lang="less">
.my-read {
  background-color: rgba(0, 0, 0, .2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: fixed;
  right: 0;
  padding: 5px 12px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  font-size: 12px;
  line-height: 1.4em;
}
.my-numinfo {
  background-color: #3E9CFA;
  display: flex;
  color: white;
  font-size: 13px;
  justify-content: space-around;
  text-align: center;
  padding: 15px;
}
.my-userinfo {
  background-color: #3E9CFA;
  padding-top: 50px;
  &::after {
    border: none;
  }
  .van-image {
    margin-right: 15px;
    border: 1px solid white;
  }
  .van-button {
    padding-left: 5px;
    padding-right: 5px;
  }
  .van-cell__title {
    color: white;
    font-size: 18px;
    padding-top: 10px;
  }
}
.my {
  .van-cell-group {
    border-top: 4px solid #F5F7F9;
  }
  .logout-btn {
    margin: 30px auto;
    display: block;
    width: 70%;
  }
}
</style>
