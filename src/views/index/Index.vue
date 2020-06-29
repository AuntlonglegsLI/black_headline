<template>
  <div class="index">
    <!-- 搜索框 -->
    <van-nav-bar fixed placeholder class="index-navbar">
      <van-button plain type="info" slot="title" icon="search">搜索</van-button>
    </van-nav-bar>
    <!-- 推荐频道 -->
    <van-tabs sticky :offset-top="46" v-model="active">
      <!-- 频道的每一个标签 -->
      <van-tab v-for="(item, index) in userChannels" :key="index" :title="item.name" />

      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
        <!-- 新闻列表 滚动加载
      v-model	：是否正在加载中
      finished：是否已经全部加载完
      offset：滚动时距离底部的距离
      loading-text:加载时的文本
      finished-text：加载完之后的文本
        -->
        <van-list
          v-model="vanList.loading"
          :finished="vanList.finished"
          :offset="vanList.offset"
          :loading-text="vanList.loadingText"
          :finished-text="vanList.finishedText"
          @load="getArticles"
        >
          <van-cell
            v-for="(item, index) in articles[channelId]"
            :key="index"
            :title="item.title"
            :url="'/content/'+item.art_id"
          >
            <!-- 默认插槽：右边默认插槽中放一张图片 -->
            <img v-if="item.cover.type==1" v-lazy="item.cover.images[0]" width="100" height="100" />

            <!-- label 插槽：下面的地方 -->
            <div slot="label">
              <!-- 如果有3张图片就循环显示 -->
              <div class="index-article-images" v-if="item.cover.type==3">
                <img
                  v-lazy="v1"
                  v-for="(v1, k1) in item.cover.images"
                  :key="k1"
                  width="100"
                  height="100"
                />
              </div>
              <!-- 文章下面的描述 -->
              <div class="index-article-label">
                <van-tag v-if="item.is_top==1" plain type="danger" size="medium">置顶</van-tag>
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{item.pubdate|relativeTime}}</span>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>

      <!-- 放在 nav-right 插槽中 -->
      <!-- 占位 -->
      <van-button slot="nav-right" icon="apps-o" />
      <!-- 真正的按钮 -->
      <van-button
        @click="showPopup=true"
        style="position: fixed;right:0"
        slot="nav-right"
        icon="apps-o"
      />
    </van-tabs>

    <!-- 编辑频道 -->
    <van-popup
      close-icon-position="top-left"
      :overlay="false"
      closeable
      position="bottom"
      v-model="showPopup"
    >
      <van-cell-group :border="false">
        <!-- 自定义标题 -->
        <div slot="title">
          <van-button
            style="float:right"
            plain
            type="danger"
            @click="showDeleteBtn=!showDeleteBtn"
            size="mini"
          >{{showDeleteBtn?'完成':'编辑'}}</van-button>
          <h3>我的频道</h3>
        </div>
        <van-grid class="index-channel" :gutter="10">
          <van-grid-item
            v-for="(item, index) in userChannels"
            :key="index"
            :icon="showDeleteBtn?'close':''"
            :text="item.name"
            @click="onDeleteChannel($event, index)"
          />
        </van-grid>
      </van-cell-group>
      <van-cell-group class="index-channel" :border="false">
        <!-- 自定义标题 -->
        <h3 slot="title">推荐频道</h3>
        <van-grid :gutter="10">
          <!-- 循环所有的频道，如果不在我的频道中就显示出来 -->
          <template v-for="(item, index) in channels">
            <van-grid-item
              :key="index"
              v-if="userChannels.findIndex(v=>v.id==item.id) === -1"
              :text="item.name"
              @click="onAllChannelClicked(index)"
            />
          </template>
        </van-grid>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import {
  getAllChannels,
  getUserChannels,
  deleteUserChannel,
  addUserChannel,
  getChannelArticles
} from "@/util/api";

export default {
  data() {
    return {
      isRefreshing: false,  // 是否正在刷新
      vanList: {
        loading: false, // 是否正在加载数据
        finished: false, // 是否已经完全加载完
        offset: 300, // 滚动条距离底部的距离
        loadingText: "加载中...", // 加载时文本
        finishedText: "没有更多了..." // 加载完之后文本
      },
      preTimestamp: {}, // 保存每个频道用来翻页的时间戳，频道ID做为键
      articles: {}, // 文章数据对象
      channelId: "", // 当前选中的频道的 ID
      active: 0, // 当前选中的频道的下标
      value: "",
      showDeleteBtn: false,
      showPopup: false, // 是否显示编辑频道的层
      channels: [], // 频道数据
      userChannels: [] // 频道选择的频道
    };
  },
  // 项目中哪些生成周期函数最常用？是怎么用的？
  // created: 获取页面中的初始数据~~~
  async created() {
    // (并行执行）两个接口同时执行，当两个都执行完之后，返回两个结果
    const [r1, r2] = await Promise.all([getAllChannels(), getUserChannels()]);
    this.channels = r1.data.data.channels;
    this.userChannels = r2.data.data.channels;
    this.channelId = this.userChannels[this.active].id;
  },
  methods: {
    async onAllChannelClicked(index) {
      // 1. 从所有频道的数组中截取出点击的频道
      let data = this.channels.splice(index, 1);
      // 2. 把截取出来的频道放到我的频道数组中
      this.userChannels.push(data[0]);
      // 3. 调用服务器接口修改数据
      try {
        let params = {
          channels: [
            {
              id: data[0].id,
              seq: data[0].id
            }
          ]
        };
        let ret = await addUserChannel(params);
      } catch (error) {
        this.$toast.fail("添加频道失败");
      }
    },
    async onDeleteChannel(e, index) {
      // 判断点击的是否是关闭图标
      if (e.srcElement.nodeName === "I") {
        // 1. 从我的频道数组中截取出要删除的频道
        let data = this.userChannels.splice(index, 1);
        // 2. 把截取出来的频道放到所有频道的数组中
        this.channels.push(data[0]);
        // 3. 调用删除接口
        try {
          await deleteUserChannel(data[0].id);
        } catch (error) {
          this.$toast.fail("删除失败！");
        }
      }
    },
    // 加载更多文章
    async getArticles() {
      // 只要频道ID不等于 0 就执行
      if (this.channelId !== "") {
        try {
          // 设置为当前正在加载数据的状态
          this.vanList.loading = true;
          // 根据频道ID和上次时间戳加载数据
          // 说明：如果上次时间戳是空（第一次调用接口），那么就使用当前时间戳(this.preTimestamp || Date.now())
          let ret = await getChannelArticles(
            this.channelId,
            this.preTimestamp[this.channelId] || Date.now()
          );
          // 设置当前的状态不是 “正在加载”
          this.vanList.loading = false;
          // 判断是否已经没有下一页了
          if (ret.data.data.results.length == 0) {
            // 设置已经加载完的状态
            this.vanList.finished = true;
          } else {
            // 如果这个频道ID中还没有数据直接设置为当前数据
            if (this.articles[this.channelId] === undefined) {
              this.articles[this.channelId] = ret.data.data.results;
            } else {
              // 把新的数据 "展开" 然后放到原数组最后
              this.articles[this.channelId].push(...ret.data.data.results);
            }
            // 保存本次接口的时间戳数据，用来下次调用接口时的翻页
            this.preTimestamp[this.channelId] = ret.data.data.pre_timestamp
          }
        } catch (error) {
          this.$toast.fail("获取频道文章失败!");
        }
      } else {
        // 延迟 0.5 秒等频道接口执行完之后有了频道ID再执行
        setTimeout(this.getArticles, 500);
      }
    },
    // 下拉刷新
    async onRefresh() {
      // 先清空当前这个频道的数据
      this.articles[this.channelId] = []

      // 设置翻页时间戳为最新的
      this.preTimestamp[this.channelId] = Date.now()

      // 重新调用接口获取当前的数据
      await this.getArticles()

      // 设置已经刷新完了
      this.isRefreshing = false
    }
  },
  // 监听器
  watch: {
    // 监听 active 变量当值改变时调用函数
    active: async function(newValue, oldValue) {
      // 更新频道ID
      this.channelId = this.userChannels[newValue].id;
      // 如果新切换的频道中还没有文章那么就获取文章
      if (this.articles[this.channelId] === undefined) {
        // 获取文章
        await this.getArticles();
      }
    }
  },
  destroyed() {
    console.log("index 被销毁了！！1");
    // 有时候我们希望在切换组件时，不要销毁原组件，那么怎么办呢？
    // 使用 keep-alive 组件把要保留的组件套起来1！
  },
  // 被激活了！！
  activated() {
    console.log("index 被激活了！！");
  },
  // 被切换走了（没有被销毁）
  deactivated() {
    console.log("index 被隐藏了！！");
  }
};
</script>

<style lang="less">
.index-navbar {
  .van-nav-bar__title {
    height: 80%;
    border-radius: 50px;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.2);
  }
  .van-button {
    background-color: rgba(255, 255, 255, 0.2);
    width: 100%;
    height: 100%;
    &__icon {
      color: white !important;
    }
    &__text {
      font-weight: normal;
      color: white;
    }
  }
}
.index {
  .van-popup {
    height: 100%;
    padding: 60px 10px 10px;
    box-sizing: border-box;
  }
}
.index-channel {
  .van-icon {
    position: absolute;
    right: -8px;
    top: -8px;
    font-size: 20px;
    z-index: 9999;
    background-color: #fff;
    color: #bbb;
  }
  .van-grid-item__text {
    margin-top: 0 !important;
  }
}
.index-article-images {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.index-article-label {
  span {
    margin-right: 20px;
  }
}
</style>
