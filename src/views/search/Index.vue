<template>
  <div class="search">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 搜索框 -->
      <form action="/">
        <van-search
          v-model="value"
          show-action
          background="#3296fa"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
        >
          <div slot="action" @click="onSearch(value)">搜索</div>
        </van-search>
      </form>
      <!-- /搜索框 -->

      <!-- 搜索联想建议自动补全 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell
          v-for="(item,index) in resultList"
          :key="index"
          icon="search"
          @click="onSearch(item)"
        >
          <!-- 我们要把 item 处理成带有高亮的字符串 -->
          <!-- 过滤器：专门用于文本格式化，但是它只能用在 {{}} 和 v-bind 中 -->
          <div slot="title" v-html="highlight(item)"></div>
        </van-cell>
      </van-list>
      <!-- /搜索联想建议自动补全 -->

      <!-- 搜索历史记录 -->
      <van-cell-group>
        <van-cell title="历史记录">
          <span>全部删除</span>&nbsp;&nbsp;
          <span>完成</span>
          <van-icon name="delete" />
        </van-cell>
        <van-cell v-for="item in searchHistory" :key="item" :title="item" @click="onSearch(item)">
          <van-icon name="close" />
        </van-cell>
      </van-cell-group>
      <!-- /搜索历史记录 -->
    </van-pull-refresh>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { suggestion } from "@/util/api";
import { setItem, getItem } from "@/util/storage";
export default {
  data() {
    return {
      value: "",
      resultList: [],
      loading: false,
      finished: false,
      refreshing: false,
      searchHistory: getItem("search-histories") || []
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.onSearchInput(newVal.trim());
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取搜索联想 debounce防抖
    onSearchInput: debounce(async function(keyWord) {
      if (keyWord) {
        try {
          let data = await suggestion(keyWord);
          this.resultList = data.data.data.options;
          // console.log(this.resultList);
        } catch (error) {
          this.$toast.fail("搜索失败");
        }
      }
      // return this.list;
    }, 300),
    // 高亮
    highlight(val) {
      // 忽略大小写
      const reg = new RegExp(this.value, "ig");
      // 将检索的关键字设为蓝色
      return val.replace(
        reg,
        `<span style="color: #3296fa">${this.value}</span>`
      );
    },
    onSearch(q) {
      if (!q.trim()) {
        return;
      }
      // 将搜索的关键字记录到历史记录中
      let index = this.searchHistory.indexOf(q);
      // 去重
      if (index != -1) {
        this.searchHistory.splice(index, 1);
      }
      // 把最近的记录放到最前面
      this.searchHistory.unshift(q);
      console.log(this.searchHistory)
      // 将搜索历史记录放到本次存储，以便持久化
      setItem("search-histories", this.searchHistory);
      this.$router.push(`/search/${q}`);
    },
    onCancel() {},
    onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }

      // 加载状态结束
      this.loading = false;
      // 数据全部加载完成
      if (this.resultList.length >= 40) {
        this.finished = true;
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  }
};
</script>

<style lang="less" scoped>
.van-search {
  .van-search__action {
    color: #fff;
  }
}
</style>