<template>
  <div class="search">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @input="onSearchInput"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </form>
    <!-- /搜索框 -->

    <!-- 搜索联想建议自动补全 -->
    <van-cell-group>
      <van-cell icon="search" :key="index" v-for="(item,index) in resultList">
        <!-- 我们要把 item 处理成带有高亮的字符串 -->
        <!-- 过滤器：专门用于文本格式化，但是它只能用在 {{}} 和 v-bind 中 -->
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /搜索联想建议自动补全 -->

    <!-- 搜索历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
        <span>全部删除</span>&nbsp;&nbsp;
        <span>完成</span>
        <van-icon name="delete" />
      </van-cell>
      <van-cell v-for="(item2,index2) in searchHistory" :key="index2" :title="item" @click="onSearch(item2)">
        <van-icon name="close" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { debounce } from "lodash";
import { suggestion } from "@/util/api";
import { setItem, getItem } from "@/util/storage";
export default {
  data() {
    return {
      searchText: "",
      resultList: [],
      searchHistory: getItem("search-histories") || []
    };
  },
  methods: {
    // 获取搜索联想 debounce防抖
    onSearchInput: debounce(async function() {
      const searchText = this.searchText.trim();
      if (!searchText) {
        return;
      }
      const res = await suggestion(this.searchText);
      this.resultList = res.data.data.options;
      console.log(this.resultList)
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
      // // 将搜索的关键字记录到历史记录中
      // let index = this.searchHistory.indexOf(q);
      // // 去重
      // if (index != -1) {
      //   this.searchHistory.splice(index, 1);
      // }
      // // 把最近的记录放到最前面
      // this.searchHistory.unshift(q);
      // console.log(this.searchHistory)
      // // 将搜索历史记录放到本次存储，以便持久化
      // setItem("search-histories", this.searchHistory);
      this.$router.push(`/search/${q}`);
    },
    onCancel() {},
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