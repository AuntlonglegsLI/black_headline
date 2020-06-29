<template>
  <div class="xiaozhi">
    <!-- 标题栏 -->
    <van-nav-bar
      title="小智同学"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 聊天内容列表 -->
    <div ref="ml" class="xiaozhi-messages">
      <div
        v-for="(item, index) in messages"
        :key="index"
        :class="{
          'xiaozhi-item': true,
          'xiaozhi-item-reverse': item.isme
        }">
        <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="xiaozhi-item__text">{{item.content}}</div>
      </div>
    </div>

    <!-- 输入框 -->
    <van-field
      @keyup.enter="send"
      v-model.trim="content"
      class="xiaozhi-input"
      placeholder="请输入用户名">
      <!-- button 插槽 -->
      <van-button
        slot="button"
        size="small"
        type="info"
        @click="send"
      >
        发送
      </van-button>
    </van-field>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  data() {
    return {
      // 从浏览器中读取历史记录
      messages: JSON.parse(localStorage.getItem('chat-messages')||'[]'),    // 从浏览器中读取历史消息
      content: '',    // 输入框中的数据
      socket: null   // 连接对象
    }
  },
  watch: {
    // 监听 messages 数组，只要有新的消息就更新历史记录
    messages: function() {
      localStorage.setItem('chat-messages', JSON.stringify(this.messages))
    }
  },
  // 组件创建之后执行
  created() {
    // 连接服务器
    this.socket = io('http://ttapi.research.itcast.cn/')

    this.socket.on('connect', () => {
      console.log('连接成功')
    })

    this.socket.on('disconnect', () => {
      console.log('连接断开')
    })

    // 接收消息：绑定一个回调函数
    this.socket.on('message', data => {
      this.updateNewMessage({
        isme: false,
        content: data.msg
      })
    })


  },
  methods: {
    // 向页面中添加新的消息并且滚动到底
    updateNewMessage(mess) {
      this.messages.push(mess)
      // 先更新页面，页面更新完之后再滚动
      this.$nextTick(()=>{
        // 让 ref=ml 的元素滚动到底
        this.$refs.ml.scrollTop = this.$refs.ml.scrollHeight
      })
    },
    send() {
      if(this.content == '') {
        this.$toast.fail('内容不能为空！')
      } else {
        // 发送消息
        // 参数一、事件名
        // 参数二、发送的内容
        this.socket.emit('message', {
          msg: this.content,  // 内容
          timestamp: Date.now()
        })

        // 添加到页面中
        this.updateNewMessage({
          isme: true,
          content: this.content
        })

        // 清空内容
        this.content = ''
      }

    }
  },
}
</script>

<style lang="less">
  .xiaozhi-input {
    position: fixed;
    bottom: 0;
  }
  .xiaozhi-item {
    padding: 10px;
    display: flex;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
    &__text {
      font-size: 12px;
      background-color: #e0effb;
      border-radius: 10px;
      border: solid 1px #c2d9ea;
      padding: 5px;
    }
  }
  // 聊表内容列表
  .xiaozhi-messages {
    position: fixed;
    top: 45px;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: scroll;
  }
  // 反向排列（头像在右）
  .xiaozhi-item-reverse {
    flex-direction: row-reverse;
    img {
      margin-left: 10px;
    }
  }
</style>
