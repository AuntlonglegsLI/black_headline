<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <van-form @submit="onSubmit">
      <van-field
        left-icon="phone-o"
        v-model="mobile"
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[{ pattern: /^1[3456789]\d{9}$/, message: '请输入手机号码' }]"
      />
      <van-field
        left-icon="points"
        v-model="code"
        name="验证码"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[{ pattern: /^\d{6}$/, message: '请输入6位的验证码' }]"
      >
        <template #button>
          <van-count-down v-if="counting" @finish="counting=false" :time="60000" format="ss秒" />
          <van-button v-else @click="onSendCode" size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { sendCode, login } from '@/util/api.js'
export default {
  data() {
    return {
      mobile: '17090086870',
      code: '246810',
      counting: false  // 是否显示倒计时
    }
  },
  methods: {
    // 提交表单
    async onSubmit() {
      try {
        let res = await login(this.mobile, this.code)

        // 把令牌保存到 vuex 中
        this.$store.commit('setUser', res.data.data)

        // 跳转到首页
        // this.$router.push('/')
        this.$router.back()

      } catch (error) {
        this.$toast.fail('登录失败，请重试！')
      }
    },
    // 发送验证码
    async onSendCode() {
      try {
        await sendCode(this.mobile)
        // 显示倒讲时
        this.counting = true
      } catch (error) {
        // 处理错误情况（状态码不是以 2 开头）
        if(error.response.status == 429) {
          this.$toast.fail('访问太频繁')
        } else {
          this.$toast.fail('失败，请重试')
        }
      }
    }
  },
}
</script>

<style scoped>
  .van-count-down {
    color: #ccc;
  }
</style>
