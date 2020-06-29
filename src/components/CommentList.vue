<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了~"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in comments" :key="index">
        <!-- 头像 :icon 插槽 -->
        <van-image
          slot="icon"
          round
          width="50px"
          height="50px"
          fit="cover"
          :src="item.aut_photo"
        />

        <!-- 标题：title 插槽 -->
        <div slot="title">
          <div class="comment-list__zan" @click="zan(item.is_liking, item.com_id, index)">
            <van-icon
            :color="item.is_liking ? 'green' : 'gray'"
            name="good-job-o"
            size="20"
            />
            {{item.like_count}}
          </div>
          <div>{{item.aut_name}}</div>
        </div>

        <!-- 评论的内容 ： label 插槽-->
        <div slot="label">
          <div>{{item.content}}</div>
          <div>
            {{ item.pubdate | relativeTime }}
            <van-button size="mini" round type="default"> {{item.reply_count}} 回复</van-button>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import {
  getCommentsByArtId,
  zanComment,
  cancelZanComment
} from '@/util/api'
export default {
  data() {
    return {
      offset: '',      // 空，第一页
      loading: false,  // 是否正在加载评论数据
      finished: false,  // 是否所有的评论都加载完了（没有下一页了）
      comments: []     // 评论列表
    }
  },
  props: {
    artid: {
      type: String,
      required: true
    }
  },
  // async created() {
  //   try {
  //     let ret = await getCommentsByArtId(this.artid)
  //     this.comments = ret.data.data.results
  //     console.log(ret.data.data)
  //   } catch (error) {
  //     this.$toast.fail('获取评论数据失败！')
  //   }
  // },
  methods: {
    // 滚动到底时加载评论数据
    async onLoad() {
      // 显示加载进度条
      this.loading = true

      // 执行加载
      try {
        let ret

        if(this.offset === '') {
          // 第一页
          ret = await getCommentsByArtId(this.artid)
        } else {
          // 不是第一页
          ret = await getCommentsByArtId(this.artid, this.offset)
        }

        // 判断如果没有数据了就结束
        if(ret.data.data.results.length === 0) {
          // 标记没有下一页了
          this.finished = true
        } else {
          // 追回数据到原数据后面
          this.comments.push(...ret.data.data.results)
          // 把最后一个ID保存到 offset 中（下次翻页）
          this.offset = ret.data.data.last_id
        }
        // 隐藏加载中的进度条
        // this.loading = false

    } catch (error) {
        this.$toast.fail('获取评论数据失败！')
        // 隐藏加载中的进度条
        // this.loading = false
      }
    },
    async zan(done,id,k) {
      try {
        // 是否已经点过赞
        if(done) {
          // 取消点赞
          await cancelZanComment(id)
          // 取消点赞的状态
          this.comments[k].like_count--
          this.comments[k].is_liking = false
        } else {
          // 点赞
          await zanComment(id)
          // 点赞状态
          this.comments[k].like_count++
          this.comments[k].is_liking = true
        }
        this.$toast.success('操作成功！')
      } catch (error) {
        this.$toast.fail('操作失败！')
      }
    }
  },
}
</script>

<style>
.comment-list__zan {
  float: right;
  display: flex;
  justify-content: center;
  color: #7F7F7F;
}
</style>
