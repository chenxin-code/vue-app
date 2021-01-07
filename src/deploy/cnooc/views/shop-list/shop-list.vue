<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="top-info">
        <div class="left">
          <div class="logo-c">
            <img src="../../assets/images/logo.png" alt="" class="logo">
          </div>
          <p class="name">海油e购</p>
        </div>
        <div class="right" @click="toAddressList">
          <i class="iconfont mall-dingwei"></i>
          <span class="address-name">{{ $store.state.mall2.selectAddress.addressFull }}</span>
          <i class="iconfont mall-gengduojiantou"></i>
        </div>
      </div>
      <div class="bottom-info">
        <van-button
          class="reset-btn"
          size="small"
          type="primary"
          @click="toProdList"
          color="linear-gradient(145deg, #0098ff, #0096fc, #0064a7, #005d9c)">查看所有商品</van-button>
          <van-list
            v-model="isLoading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="100"
            class="store-list"
            @load="loadMore">
            <ul class="store-c">
              <li
                v-for="(item, index) in storeList"
                :key="index"
                class="item">
                <div class="store-info">
                  <img :src="dealWithStoreUrl(item.storePictureUrl)" alt="" class="store-logo" v-if="item.storePictureUrl">
                  <img src="../../assets/images/store-logo.png" alt="" class="store-logo" v-else>
                  <div class="right">
                    <div class="name" @click="storeClick(item)">
                      <p>{{ item.storeName }}</p>
                      <van-icon name="arrow" class="arrow"/>
                    </div>
                    <div class="store-basic">
                      <span>销量：{{ item.saleNumb || 0 }}</span>
                      <!-- <span>收藏：{{ item.collectionNumb || 0 }}</span> -->
                    </div>
                  </div>
                </div>
                <div class="commodity-c" v-if="item.list && item.list.length > 0">
                  <div class="prod-item" v-for="(item2, index2) in item.list" :key="index2">
                    <div class="prod-img">
                      <img :src="item2.phMainUrl" alt="">
                    </div>
                    <p class="name">{{ item2.skuName }}</p>
                    <p class="now-price">￥{{ $util.toDecimal2(item2.salePrice) }}</p>
                    <p class="old-price">￥{{ $util.toDecimal2(item2.marketPrice) }}</p>
                  </div>
                </div>
                <p class="no-result-text" v-else>当前店铺暂无商品~</p>
              </li>
            </ul>
          </van-list>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: true,
      finished: false,
      storeList: [],
      // 本省分页信息
      currentProvincePageInfo: null,
      // 其他省分页信息
      otherProvincePageInfo: null,
      queryType: 0,
      pageInfo: {
        page: 0,
        rows: 5
      }
    }
  },
  mounted() {
    this.loadMore()
  },
  methods: {
    /*
      加载说明
        1. 首先加载本省数据（不传queryType）接口已控制分页每页必须为5条
        2. 加载完本省店铺列表后开始加载外省店铺列表（queryType传1）
        3. 本省店铺加载完成重置pageInfo开始加载外省分页信息
        4. 通过最后判断店铺列表总条数和两个分页信息相加结果来进行判断是否全部加载完成
    */
    loadMore() {
      this.$Loading.open()
      this.isLoading = true
      this.pageInfo.page++
      let params = {
        area: {
          provinceId: this.$store.state.mall2.selectAddress.provinceId,
          cityId: this.$store.state.mall2.selectAddress.cityId,
          countryId: this.$store.state.mall2.selectAddress.countryId,
          townId: this.$store.state.mall2.selectAddress.townId
        },
        ...this.pageInfo,
      }
      if (this.queryType) {
        params.queryType = 1
      }
      this.$http.post('/app/json/product/getAppProvinceStoreProList', params).then(res => {
        this.isLoading = false
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data.storeList instanceof Array && (data.data.storeList.length > 0)) {
            this.storeList.push(...data.data.storeList)
            
            // 存储本省分页信息
            if (!this.currentProvincePageInfo) {
              this.currentProvincePageInfo = data.data.page
            }

            // 存储外省分页信息
            if (this.queryType && !this.otherProvincePageInfo) {
              this.otherProvincePageInfo = data.data.page
            }

            if (this.otherProvincePageInfo) { // 包含外省分页信息(开始加载外省数据)
              if (this.storeList.length >= (this.currentProvincePageInfo.count + data.data.page.count)) { // 外省信息加载完成
                this.finished = true
              }
            } else {
              if (this.storeList.length >= data.data.page.count) { // 本省列表已加载完
                this.pageInfo = {
                  page: 0,
                  rows: 5
                }
                this.queryType = 1
              }
            }
          } else {
            this.finished = true
          }
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Toast(`getAppProvinceStoreProList err ${err}`)
        this.$Loading.close()
      })
    },
    toAddressList() {
      this.$router.push({
        path: '/mall2/addresslist',
      })
    },
    toProdList() {
      this.$router.push({
        path: '/mall2/list/1000'
      })
    },
    storeClick(item) {
      console.log(item)
      this.$router.push({
        path: '/mall2/shop',
        query: {
          storeOuCode: item.storeCode,
          lastPath: this.$route.path
        }
      })
    },
    dealWithStoreUrl(url) {
      let result = ''
      if (url) {
        let decodeUrl = decodeURIComponent(url)
        if (decodeUrl.indexOf('[') > -1) {
          result = decodeUrl.substring(2, decodeUrl.length - 2)
        }
      }
      return result
    }
  }
}
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl'
@import '~@/common/stylus/mixin.styl'
.reset-btn {
  float right;
  margin 10px 10px 0 0;
  border-radius 5px;
  .van-button__text {
    font-weight 500;
  }
}
.top-info {
  display flex;
  align-items center
  background url('../../assets/images/benefits_bottom.png') no-repeat;
  background-size 100%;
  background-position 0 -20px;
  justify-content space-between
  padding 10px 15px 25px;
  .left {
    display flex;
    align-items center;
    .logo-c {
      border-radius 50%;
      height 55px;
      width 55px;
      background-color #fff;
      position relative;
      .logo {
        display block;
        width 100%;
        position absolute;
        left 50%;
        top 50%;
        transform translate(-50%, -50%)
      }
    }
    .name {
      font-size 18px;
      color #fff;
      padding-left 10px;
      font-weight 500;
    }
  }
  .right {
    display flex;
    align-items center;
    color #fff;
    .address-name {
      padding 0 2px;
      max-width 100px;
      ellipse();
    }
    .mall-gengduojiantou {
      font-size 11px;
    }
  }
}
.bottom-info {
  background-color #f6f6f6;
  border-radius 10px 10px 0 0;
  position absolute;
  left 0;
  right 0;
  bottom 0;
  top 75px;
  .store-list {
    position absolute;
    left 0;
    right 0;
    bottom 0;
    top 50px;
    padding 0 10px;
    overflow-y auto;
    .store-c {
      .item {
        background-color #fff;
        padding 10px;
        border-radius 10px;
        margin-top 10px;
        &:first-child {
          margin-top 0;
        }
        .store-info {
          display flex;
          .store-logo {
            display block;
            width 45px;
            height 45px;
            border-radius 50%;
          }
          .right {
            flex 1;
            padding 4px 0 4px 10px;
            display flex;
            flex-direction column;
            justify-content space-between;
            .name {
              font-size 16px;
              line-height 18px;
              p {
                font-weight 400;
                display inline-block;
                max-width 250px;
                ellipse()
              }
              .arrow {
                line-height 17px;
              }
            }
            .store-basic {
              font-size 12px;
              line-height 15px;
              color #acacac;
              span:last-child {
                padding-left 5px;
              }
            }
          }
        }
        .commodity-c {
          padding-top 10px;
          display flex;
          justify-content space-between
          .prod-item {
            width 31%;
            text-align center;
            .prod-img {
              display inline-block;
              width 104px;
              height 104px;
              border-radius 5px;
              background-color #f6f6f6;
              overflow hidden;
              img {
                display block;
                width 100%;
                height 100%;
              }
            }
            .name {
              font-size 14px;
              color #333;
              padding-top 5px;
              ellipse()
            }
            .now-price {
              font-size 18px;
              font-weight 500;
              color #d7282e;
              padding-top 5px;
            }
            .old-price {
              font-size 12px;
              padding-top 5px;
              color #989898;
              text-decoration: line-through;
            }
          }
        }
        .no-result-text {
          font-size 14px;
          text-align center;
          color #989898;
          padding 15px 0;
        }
      }
    }
  }
}
</style>