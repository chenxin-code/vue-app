<template>
  <div class="card-classifyList-index">
    <nav-top title="视听卡搜索" @backEvent="$router.go(-1)">
      <div
        class="search-div theme_bg_white_f5"
        style="left: 50px; right: 55px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
      >
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 16px;"></i>
        <form class="search-input" action id="form">
          <input style="display: none" type="text" name="keyword">
          <input
            id="searchInput"
            class
            type="search"
            placeholder="搜你想要的商品"
            v-model="searchStr"
            @keyup.enter="searchgoods"
          >
        </form>
      </div>
      <div class="go-recharge-bill" @click="rechargeBillFun">账单</div>
    </nav-top>
    <nav-content class="card-classifyList-content">
      <van-index-bar :index-list="indexList" highlight-color="#0000FF">
        <div v-for="index in indexList" :key="index">
          <van-index-anchor class="listTr" :index="index"/>
          <van-cell title="text" @click="gorecharge(index)"/>
        </div>
      </van-index-bar>
    </nav-content>
  </div>
</template>

<script>

export default {
  data() {
    const indexList = ['#'];
    const charCodeOfA = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      indexList.push(String.fromCharCode(charCodeOfA + i));
    }
    return {
      searchStr: '',
      indexList,
    }
  },
  methods: {
    searchgoods() {

    },
    gorecharge(index) {
      this.$router.push({
        path: '/user_center/video_recharge',
        query: {}
      })
    },
    rechargeBillFun() {
      this.$router.push({
        path: '/user_center/recharge_bill',
        query: {}
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.card-classifyList-index {
  .go-recharge-bill {
    font-size: 14px;
    margin-right: 15px;
    text-align: right;
  }

  .search-div {
    position: absolute;
    display: flex;
    align-items: center;

    .icon-font {
      font-size: $font-size-medium;
    }

    .search-input {
      flex: 1;
      margin-left: 10px;
      font-size: $font-size-medium;

      input {
        background: none;
        width: 100%;
        height: 100%;
      }
    }
  }

  .card-classifyList-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .listTr {
      background: #F8F8F8;
    }
  }
}
</style>
