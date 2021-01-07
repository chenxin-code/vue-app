<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="list-container">
        <van-list
          v-model="isLoading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="200"
          @load="loadMore">
          <div class="item" v-for="(item, index) in dataList" :key="index" @click="brandClick(item)">
            <img :src="item.hotMainUrl" alt="" class="brand-img">
            <span class="tip">进入&gt;</span>
          </div>
        </van-list>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      isLoading: true,
      finished: false,
      queryPage: 0,
      dataList: [],
    }
  },
  watch: {
  },
  mounted() {
    this.loadMore();
  },
  methods: {
    loadMore() {
      this.$Loading.open();
      this.queryPage++;
      this.isLoading = true;
      this.$http
        .post('/app/json/app_brand/getHotBrandList', {
          isHot: 1,
          page: this.queryPage,
          rows: 20
        })
        .then(res => {
          this.isLoading = false;
          let data = res.data
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.dataList.push(...data.data);
              if (this.dataList.length >= data.totalRecords) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
          } else {
            this.$Toast(data.info)
          }
          this.$Loading.close();
        })
        .catch(err => {
          this.$Toast(`getHotBrandList err ${err}`)
          this.$Loading.close();
        })
    },
    brandClick(item) {
      this.$router.push({
        path: 'brand_prod_list',
        query: {
          brandId: item.id,
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  .list-container {
    width 100%;
    height 100%;
    overflow-y auto;
    padding 0 15px;
    .item {
      width 100%;
      height 130px;
      background-color black;
      position relative
      border-radius 5px;
      margin-top 10px;
      overflow hidden;
      &:first-child {
        margin-top 0;
      }
      .brand-img {
        display block;
        width 100%;
        height 100%;
      }
      .tip {
        font-size 12px;
        color #fff;
        background-color rgba(0, 0, 0, .3)
        height 20px;
        line-height 20px;
        border-radius 10px;
        padding 0 10px;
        position absolute
        right 10px;
        top 10px;
      }
    }
  }
}
</style>