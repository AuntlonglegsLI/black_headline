<template>
  <div class="edit_profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改资料"
      left-text="返回"
      right-text="确认"
      left-arrow
      @click-left="$router.back()"
      @click-right="$refs.infoForm.submit()"
    />

    <!-- 表单 -->
    <!-- 通过 ref 可以实现 DOM 操作 -->
    <van-form ref="infoForm" @submit="onSubmit">
      <!-- 用户名 -->
      <van-field
        v-model="info.name"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ pattern: /^.{1,7}$/, message: '用户名必须是1~7个字符！' }]"
      />
      <!-- 性别 -->
      <van-field
      name="radio"
      label="性别"
      :rules="[{ required: true, message: '必须要选择性别' }]"
      >
        <template #input>
          <van-radio-group v-model="info.gender" direction="horizontal">
            <van-radio name="0">男</van-radio>
            <van-radio name="1">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- 生日 -->
      <van-field
        :rules="[{ required: true, message: '必须选择生日' }]"
        readonly
        clickable
        name="calendar"
        v-model="info.birthday"
        label="生日"
        placeholder="点击选择日期"
        @click="showPopUp=true"
      />

      <!-- 真实姓名 -->
      <van-field
        v-model="info.real_name"
        name="真实姓名"
        label="真实姓名"
        placeholder="真实姓名"
      />
      <!-- 个人介绍 -->
      <van-field
        v-model="info.intro"
        rows="3"
        autosize
        label="个人介绍"
        type="textarea"
        maxlength="120"
        placeholder="个人介绍"
        show-word-limit
      />
    </van-form>


    <!-- 年、月、日 弹出层 -->
    <van-popup
    v-model="showPopUp"
    position="bottom"
    :style="{height: '50%'}"
    >
      <van-picker
        show-toolbar
        title="选择日期"
        :columns="columns"
        @cancel="showPopUp=false"
        @confirm="onConfirm"
      />
    </van-popup>

  </div>
</template>

<script>
import { updateProfile } from '@/util/api'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showPopUp: false,
      columns: [
        {
          values: this.mkArray(1920,2020),
          defaultIndex: 0
        },
        {
          values: this.mkArray(1,12),
          defaultIndex: 0
        },
        {
          values: this.mkArray(1,31),
          defaultIndex: 0
        }
      ],
      info: {
        name: '',
        gender: 0,
        birthday: '',
        real_name: '',
        intro: ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 选择完日期之后
    onConfirm(value) {
      // 把日期放到框中
      this.info.birthday = value.join('-')
      // 关闭
      this.showPopUp = false
    },
    // 提交表单
    async onSubmit() {
      // 触发表单验证
      try {
        let data = {
          name: this.info.name,
          gender: this.info.gender,
          birthday: this.info.birthday,
        }
        // 如果不为空就放到 data 中
        if(this.info.real_name != '') {
          data.real_name = this.info.real_name
        }
        if(this.info.intro != '') {
          data.intro = this.info.intro
        }
        // 把 data 提交到服务器
        let ret = await updateProfile(data)

        // 提交消息
        this.$toast.success('更新成功！')

        // 把 data 中的数据合并到 vuex 中
        this.$store.commit('setUserInfo', data)

        // 跳转页面：返回上一个页面
        this.$router.back()

      } catch (e) {
        if(e.response.status === 409) {
          this.$toast.fail('失败：用户名已经存在！')
        } else {
          this.$toast.fail('更新失败！')
        }
      }
    },
    // 构造两个整数之间所有整数的组件
    mkArray(min, max) {
      let ret = []
      for(let i=min; i<=max; i++) {
        ret.push(i)
      }
      return ret
    }
  }
}
</script>
