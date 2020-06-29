<template>
  <div class="content">
    <!-- 导航栏 -->
    <van-nav-bar
      class="index-content-navbar"
      left-arrow
      @click-left="$router.back()"
    >
      <!-- right插槽： -->
      <van-icon slot="right" name="ellipsis" color="#ffffff" />
    </van-nav-bar>
    <!-- 文章标题 -->
    <h5 class="title">{{ article.title }}</h5>
    <!-- 作者信息 -->
    <van-cell>
      <!-- icon插槽：头像 -->
      <van-image
        slot="icon"
        round
        width="50px"
        height="50px"
        :src="article.aut_photo"
      />
      <!-- title插槽：用户名 -->
      <div  slot="title">{{ article.aut_name }}</div>
      <!-- label插槽：标题下的小字：时间
          |：管道符
      -->
      <div slot="label">{{ article.putdate | relativeTime }}</div>
      <!-- default插槽：右边的内容：关注按钮 -->
      <van-button @click="onDeleteFollow" v-if="followed" size="small" round icon="close" type="primary">已关注</van-button>
      <van-button @click="onFollow" v-else size="small" round icon="add" type="info">关注</van-button>
    </van-cell>
    <!-- 文章内容 -->
    <div class="content-content" v-html="article.content" />

    <!-- 评论列表（懒加载：滚动到这个组件时才加载。 -->
    <lazy-component>
      <comment-list :artid="$route.params.id" />
    </lazy-component>

    <!-- 发表评论的按钮 -->
    <div class="content-commbtn">
      <van-button
      round
      type="default"
      plain
      size="small"
      @click="showPlForm=true"
      >请评论</van-button>
      <van-grid :border="false" icon-size="22" :gutter="5">
        <van-grid-item icon="comment-o" badge="22" />
        <van-grid-item icon="star-o" />
        <van-grid-item icon="bulb-o" />
      </van-grid>
    </div>

    <!-- 评论表单 -->
    <van-action-sheet
      title="发表评论"
      v-model="showPlForm"
    >
      <div class="pl-form">
        <van-field
          v-model.trim="plcontent"
          rows="10"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请输入评论内容..."
          show-word-limit
        />
        <van-button
          style="float: right;"
          size="small"
          type="primary"
          @click="submit"
        >
          发表评论
        </van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import {
  getArticleById,
  followById,
  deleteFollowById,
  addComment
 } from '@/util/api'

import CommentList from '@/components/CommentList.vue'

export default {
  data() {
    return {
      plcontent: '',       // 评论的内容
      showPlForm: false,
      followed: false,   // 是否已关注
      article: ''   // 文章信息
    }
  },
  components: {
    CommentList
  },
  async created() {
    // 根据 ID 获取文章
    try {
      let ret = await getArticleById(this.$route.params.id)
      this.article = ret.data.data
      // 更新关注的状态
      this.followed = this.article.is_followed
      // console.log(this.article)
    } catch (error) {
      this.$toast.fail('获取文章数据失败!')
    }
  },
  methods: {
    async onFollow() {
      try {
        let ret = await followById(this.article.aut_id)
        // 切换为已关注的按钮
        this.followed = true
        // 提示成功
        this.$toast.success('已关注')
      } catch (error) {
        this.$toast.fail('关注失败！')
      }
    },
    async onDeleteFollow() {
      try {
        let ret = await deleteFollowById(this.article.aut_id)
        // 切换为未关注的按钮
        this.followed = false
        // 提示成功
        this.$toast.success('已取消关注')
      } catch (error) {
        this.$toast.fail('删除关注失败！')
      }
    },
    async submit() {
      if(this.plcontent.length < 5) return this.$toast.fail('评论内容不能少于 5 个字符')

      try {
        let ret = await addComment(this.$route.params.id, this.plcontent)
        // 关闭
        this.showPlForm = false
        // 清空输入框
        this.plcontent = ''
        // 提示
        this.$toast.success('评论发表成功！')
      } catch (error) {
        this.$toast.fail('发表评论失败！')
      }


    }
  },
}
</script>

<style lang="less">
.index-content-navbar {
  .van-icon {
    color: white;
  }
}
.content {
  padding-bottom: 50px;
  .title {
    margin: 0;
    padding: 10px 20px;
  }
  .van-cell__title {
    margin-left: 10px;
  }
  .content-commbtn {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    height: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-top: 1px solid #eee;
    width: 100%;
    padding: 0 10px;
    .van-button {
      width: 55%;
      color: #ccc;
      &__content {
        justify-content: left;
      }
      margin-right: 10px;
    }
  }
  &-content {
    padding: 0 10px;
  }
}
</style>
