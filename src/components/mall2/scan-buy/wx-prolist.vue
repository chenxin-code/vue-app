<template>
  <div>
    <nav-top @backEvent="back()"></nav-top>
    <nav-content>
      <ul class="pro-list" v-if="wxShopCartList.length">
        <li class="pro-item" v-for="(item, idx) in wxShopCartList" :key="idx">
          <div class="pro-item-content">
            <img class="pro-img" :src="item.phMainUrl" alt="">
            <div class="pro-info">
              <div class="pro-name single-line" v-html="item.showTitle"></div>
              <div class="pro-price-wrapper">
                <div class="pro-price">
                  <PriceOrder :scanProduct="item"></PriceOrder>
                </div>
                <div class="input-number">
                  <!--<Counter v-model="item.number" :minValue="item.saleNumBegin" :maxValue="item.saleNumMax"-->
                  <!--:stepNum="item.saleNumStep" @numChange="numChange(item)"></Counter>-->
                  <van-stepper v-model="item.number" :min="item.saleNumBegin" :max="item.saleNumMax"
                               :step="item.saleNumStep" @change="numChange(item)" integer/>
                </div>
              </div>
              <div class="delete-btn" slot="right" @click="deleteEvent(item)">
                <van-icon class="icon" name="delete" />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-data" v-show="wxShopCartList.length == 0">购物车竟然是空的，请选购商品吧</div>
      <div class="btn-group">
        <div class="btn left-btn" @click="shopping">继续购物</div>
        <div class="btn right-btn" @click="shoppingCart">前往购物车</div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import PriceOrder from '@/components/commonui/price/price-order'
  // import Counter from '@/components/commonui/counter/counter'

  export default {
    name: '',
    data() {
      return {
        wxShopCartList: [],
        lastPath: ''
      }
    },
    mounted() {
      this.code = this.$route.query.code
      this.storeOuCode = this.$route.query.storeOuCode
      const wxShopCartList = localStorage.getItem('historyPros')
      this.wxShopCartList = wxShopCartList ? JSON.parse(wxShopCartList) : []
      this.getProDetail()
    },
    created() {
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : '';
    },
    methods: {
      deleteEvent(item) {
        this.$dialog.confirm({message: '确定删除此商品吗？', confirmButtonColor: '#F80F16'}).then(() => {
          for (let i = 0; i < this.wxShopCartList.length; i++) {
            let itm = this.wxShopCartList[i]
            if (itm.skuId == item.skuId) {
              this.wxShopCartList.splice(i, 1)
              break;
            }
          }
          window.localStorage.setItem('historyPros', JSON.stringify(this.wxShopCartList))
        })
      },
      numChange(item) {
        for (let i = 0; i < this.wxShopCartList.length; i++) {
          let itm = this.wxShopCartList[i]
          if (itm.skuId == item.skuId) {
            itm.number = item.number
            break;
          }
        }
        this.setHistoryPros()
      },
      getProDetail() {
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          token: this.$store.state.login.token,
          barcode: this.code,
          pickupStoreOuCode: this.storeOuCode
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let detailData = data.data || {};
              let dpedData = this.$mallCommon.priceFromItem(detailData)
              detailData.dpedData = dpedData;
              let skuId = detailData.skuId
              let isHas = false
              // 如果重复，数量加1
              for (let i = 0; i < this.wxShopCartList.length; i++) {
                let itm = this.wxShopCartList[i]
                if (itm.skuId == skuId) {
                  isHas = true
                  itm.number += 1;
                  break;
                }
              }

              if (!isHas) {
                detailData.number = 1
                this.wxShopCartList.push(detailData)
              }
              this.setHistoryPros()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        )
      },
      shopping() {
        this.$bridgefunc.scanCode((dic) => {
          if (this.$store.state.webtype == 1) {
            this.code = dic.code
          } else {
            this.code = dic.code.split(',')[1]
          }
          this.getProDetail()
        })
      },
      shoppingCart() {
        this.$router.push({
          path: '/mall2/scanbuyplaceorder',
          query: {
            storeoucode: this.$route.query.storeOuCode,
            pickupId: this.$route.query.pickupId
          }
        })
      },
      back() {
        this.$router.back()
      },
      setHistoryPros() {
        let historyPros = []
        window.localStorage.setItem('historyPros', JSON.stringify(this.wxShopCartList))
        this.wxShopCartList.forEach(item => {
          historyPros.push({
            skuId: item.skuId,
            number: item.number,
            checked: 1,
            storeOuCode: this.storeOuCode
          })
        })
        window.localStorage.setItem('historyPros', JSON.stringify(historyPros))
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path == this.lastPath) {
        window.localStorage.removeItem('historyPros')
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    activated () {
      const wxShopCartList = localStorage.getItem('historyPros')
      this.wxShopCartList = wxShopCartList ? JSON.parse(wxShopCartList) : []
    },
    components: {
      PriceOrder,
      // Counter
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .pro-list {
    padding 8px;
    padding-bottom: 50px;

    .pro-item {
      box-shadow: 0 0.026667rem 0.213333rem #efefef
      border-radius 4px;
      padding 8px;

      .pro-item-content {
        display flex
      }

      .pro-img {
        width 80px;
        height 80px;
      }


      .pro-info {
        padding-left: 8px;
        flex 1
        padding-top: 4px;
      }

      .pro-price-wrapper {
        display flex
        justify-content space-between
        align-items center
        padding-top: 15px;

        .pro-price {
        }

        .input-number {
        }
      }

      & + .pro-item {
        margin-top: 8px;
      }
    }

    .delete-btn {
      text-align right
      padding-top: 10px
      .icon{
        font-size:22px;
        color: #4c4c4c
      }
    }
  }

  .btn-group {
    height 50px;
    line-height: 50px;
    text-align: center
    display flex
    position: fixed
    bottom: 0;
    width 100%
    left: 0
    border-top: 0.5px solid #efefef

    .btn {
      flex 1;
      color #fff;
    }

    .left-btn {
      color: #222;
    }

    .right-btn {
      background: #F80F16
    }
  }
</style>
