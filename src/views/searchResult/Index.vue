<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar :title="$route.params.q" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <!-- /导航栏 -->
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in articalList" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearchResult } from "@/util/api";
export default {
  name: "searchResult",
  data() {
    return {
      articalList: [],
      loading: false,
      finished: false,
      page: 1
    };
  },
  methods: {
    async onLoad() {
      let res = await getSearchResult({
        page: this.page,
        per_page: 20,
        q: this.$route.params.q
      });
      // 2. 将数据添加到数据列表中
      const results = res.data.data.results;
      this.articalList.push(...results);

      // 加载状态结束
      this.loading = false;

      // 判断是否还有数据，如果没有了则将 finished 设置为 true
      if (results.length) {
        this.page++;
      } else {
        this.finished = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>