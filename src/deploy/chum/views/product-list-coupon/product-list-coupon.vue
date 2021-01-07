<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="top-info">
        <div class="exchange-container">
          <input class="enter-input" type="text" placeholder="搜你想要的商品" v-model="searchValue" />
          <van-icon name="clear" class="clear-btn" @click="clearSearch" v-if="searchValue"/>
          <van-button
            class="exchange-btn"
            type="primary"
            color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
            @click="searchHandler">搜索</van-button>
        </div>
        <van-tabs
          class="reset-tab"
          :border="false"
          :line-width="46"
          :line-height="2"
          color="#E0C28A"
          title-active-color="#E0C28A"
          @change="changeTab"
          v-model="activeTab">
          <van-tab title="服务券"></van-tab>
          <van-tab title="会员卡"></van-tab>
        </van-tabs>
      </div>
      <van-list
        class="prod-list"
        v-model="isLoading"
        :finished="finished"
        finished-text="没有更多了"
        :offset="200"
        @load="loadMore">
        <div class="prod-c">
          <div
            v-for="(item, index) in prodList"
            :key="index"
            @click="prodClick(item)"
            class="item">
            <div class="top-img" :style="{'background-image': 'url('+ item.phMainUrl +')'}"></div>
            <div class="btm-prod">
              <p class="prod-name">{{ item.skuName }}</p>
              <div class="price-c">
                <span class="current-price">￥{{ dealWithPrice(item.activityPrice)[2] }}</span>
                <span class="old-price">￥{{ dealWithPrice(item.couFaceValue)[2] }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </nav-content>
  </div>
</template>
<script>
import utils from '../../assets/utils/tools'

export default {
  mixins: [utils],
  components: {},
  data() {
    return {
      searchValue: '',
      activeTab: 0,
      isLoading: true,
      finished: false,
      pageInfo: {
        page: 0,
        rows: 10,
      },
      prodList: []
    }
  },
  mounted() {
    if (this.$route.query.coupon) {
      this.loadMore()
    } else {
      this.$Toast('未传入券信息')
    }
  },
  computed: {},
  methods: {
    // 搜索
    searchHandler() {
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.prodList = []
      this.isLoading = true
      this.finished = false
      this.loadMore()
    },
    // 清除
    clearSearch() {
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.prodList = []
      this.isLoading = true
      this.finished = false
      this.searchValue = ''
      this.loadMore()
    },
    // 加载更多
    loadMore() {
      this.isLoading = true
      this.pageInfo.page++
      this.$Loading.open()
      let params = {
        deliverType: 2,
        couTypeCode: this.$route.query.coupon,
        ...this.pageInfo,
      }
      if (this.searchValue) {
        params.proName = this.searchValue
      }
      if (this.activeTab == 0) {
        params.productType = 5
      } else {
        params.productType = 550
        params.spuSubType = 550003
      }
      this.$http.post('/app/json/product/getAppProSearchList', params).then(res => {
        let data = res.data
        if (data.status == 0) {
          this.isLoading = false
          this.$Loading.close()
          if (data.data.list instanceof Array && data.data.list.length > 0) {
            this.prodList.push(...data.data.list)
            if (this.prodList.length >= data.data.page.count) {
              this.finished = true;
            }
          } else {
            this.$Toast(data.info)
            this.finished = true;
          }
        } else {
          this.finished = true;
          this.$Toast(data.info)
          this.$Loading.close()
        }
      })
      .catch(err => {
        this.finished = true;
        this.$Toast(`getAppProSearchList err ${err}`)
        this.$Loading.close()
      })
    },
    // 更改tab
    changeTab(name, title) {
      this.pageInfo = {
        page: 0,
        rows: 10
      }
      this.prodList = []
      this.isLoading = true
      this.finished = false
      this.searchValue = ''
      this.loadMore()
    },
    prodClick(item) {
      this.$router.push({
        path: '/service_detail',
        query: {
          skuId: item.skuId,
          price: item.couFaceValue,
          salePrice: item.salePrice,
          entryType: this.activeTab
        }
      })
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  display flex;
  flex-direction column;

}
.reset-tab {
  margin-top 10px;
  /deep/ .van-tabs__wrap {
    height 30px;
    .van-tab__text {
      font-size 16px;
      font-weight 700;
    }
  }
}
.exchange-container {
  margin: 0 20px 0;
  display: flex;
  position relative;

  .enter-input {
    flex: 1;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 5px 0 0 5px;
    font-size: 16px;
    padding-left: 15px;
    -webkit-appearance: none;
  }

  .exchange-btn {
    border-radius: 0 5px 5px 0;
    padding: 0 24px;
    .van-button__text {
      color #E0C28A;
    }
  }

  .clear-btn {
    font-size 14px;
    position absolute;
    top 50%;
    right 85px;
    transform translateY(-50%)
    color #bdbdbd;

  }
}
.prod-list {
  flex 1;
  overflow-y auto;
  padding 0 15px;
  margin-top 10px;
  .item {
    border-radius 5px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    overflow hidden;
    margin-top 10px;
    .top-img {
      height 110px;
      overflow hidden;
      background-size cover;
      background-position: center;
    }
    .btm-prod {
      padding 12px 10px;
      .prod-name {
        font-size 15px;
        font-weight 500;
        line-height 18px;
        ellipse-2()
      }
      .price-c {
        margin-top 10px;
        .current-price {
          font-size 16px;
          font-weight 700;
          color $color-theme-r;
        }
        .old-price {
          padding-left 10px;
          font-size 13px;
          color #999;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>