/**Created by liaoyingchao on 2018/11/28.*/

<template>
  <div class="recommend mall2" v-if="storeList.length > 0">
    <div class="title">推荐店铺</div>
    <div class="list-content">
      <div class="store line_bottom" v-for="store in storeList">
        <div class="shop-title" @click="toShop(store.storeCode)">
          <div class="text single-line">
            <i class="iconfont mall-dianpu"></i>
            {{store.storeName}}
          </div>
          <div class="distance">
            距离{{store.distanceKM}}KM
            <i class="iconfont mall-gengduojiantou"></i>
          </div>
        </div>
        <div class="pro-list">
          <div class="pro" v-for="item in store.list" @click="productEvent(item)">
            {{dataProcessing(item)}}
            <div class="pro-img">
              <img :src="item.phMainUrl">
            </div>
            <div class="pro-title single-line">{{item.skuName}}</div>
            <div class="pro-price single-line">
              <PriceOrder :listitem="item"></PriceOrder>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PriceOrder from  '@/components/commonui/price/price-order'
  import CardList from '../base/card-list'

  export default {
    name: "recommend",
    components: {
      CardList,
      PriceOrder
    },
    props: ['searchKey'],
    data() {
      return {
        deliverType: this.$store.state.mall2.staticDeliverType,
        storeList: []
      }
    },
    methods: {
      dataProcessing: function (item) {
        let dpedData = {
          integer: '0',
          decimals: '00',
          linePrice: ''
        }

        let activityPrice = item.salePrice + '';

        let arr = activityPrice.split('.');
        if (arr) {
          if (arr.length == 1) {
            dpedData.integer = arr[0]
            if (dpedData.integer == '') {
              dpedData.integer = '0'
            }
            dpedData.decimals = '00'
          } else if (arr.length == 2) {
            dpedData.integer = arr[0]
            dpedData.decimals = arr[1]
            if (dpedData.decimals.length < 2) {
              dpedData.decimals = dpedData.decimals + '0'
            }
          }
        }
        item.dpedData = dpedData;
      },
      toShop: function (storeOuCode) {
        this.$router.push({
          path: '/mall2/shop',
          query: {
            storeOuCode: storeOuCode
          }
        })
      },
      productEvent: function (product) {
        console.log(product)
        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2){
          path = '/mall2/ticketdetail';
        }
        this.$router.push({
          path: path,
          query: {
            id: product.id,
            skuId: product.skuId,
            storeOuCode: product.storeOuCode,
            productType: product.productType,
          }
        })
      },
      addToCart: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_cart/addCart';
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            activityId:this.activityId,
            selfActivityId:item.activityId,
            number: 1
          }],
          deliveryType: item.deliverType
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.mall2.cartNum = data.data;
              this.$Toast("添加购物车成功！")
              this.$emit('addCartFinish');
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      _loadProList: function () {
        this.storeList = [];
        this.$Loading.open();
        let url = '/app/json/product/getAppProNearDistanceList';
        let paramsData = {
          lng: this.$store.state.currentLocation.posx,
          lat: this.$store.state.currentLocation.posy,
          proName: this.searchKey
        };

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              console.log(data.data)
              this.storeList = data.data.storeList;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          });
      },
    },
    created() {

      this._loadProList();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .recommend {
    width 100%
    overflow hidden
    .title {
      padding 12px 0px 8px;
      text-align center;
      font-size 16px;
    }
    .list-content {
      padding 0 8px;
      .store {
        .shop-title {
          padding 8px 0;
          display flex;
          align-items center;
          justify-content space-between;
          .mall-dianpu {
            font-size 16px;
            font-weight 600;
          }
          .text {
            font-size 16px;
            font-weight 600;
            max-width 240px;
          }
          .distance {
            font-size 12px;
            color #999;
          }
          .mall-gengduojiantou {
            font-size 12px;
            color #999;
          }
        }
        .pro-list {
          width 100%;
          overflow-x auto;
          white-space: nowrap;
          .pro {
            width 30%;
            display inline-block;
            font-size 0;
            .pro-img {
              text-align center;
              font-size 0;
              img {
                width 90px;
                height 90px;
              }
            }
            .pro-title {
              padding 10px 5px 0;
              font-size 12px;
              text-align center;
            }
            .pro-price {
              padding 5px 10px 10px;
              text-align center;
            }
          }
        }
      }
    }
  }
</style>
