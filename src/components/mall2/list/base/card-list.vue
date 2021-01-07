/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="card-list">
    <div v-if="$store.state.globalConfig.product_list_type == '1'">
      <div class="equal-div">
        <div class="card" :class="{'no-stock': (item.stockNum == '' || item.stockNum == '0') && $store.state.globalConfig.showNoStockCover == '1'}" v-for="(item, index) in dataArray" @click="productEvent(item)">
          <div v-show="isOpen || index < 1" style="height: 100%;">
            <div class="card-content theme_bg_white" :class="{'big-corner': $store.state.globalConfig.product_big_corner == '1'}">
              <div class="img-div">
                <img v-lazy="item.phMainUrl">
                <div class="presale" v-if="item.supportPreSale == 1">预售</div>
              </div>
              <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
              <div class="info-row">
                <PriceOrder :listitem="item"></PriceOrder>
              </div>
              <div class="info-row activity single-line">
                <div class="act-item theme_font_red theme_border_red single-line" v-for="(activity, aidx) in item.showActivities" v-if="aidx < 2">{{activity}}</div>
                <div class="act-item theme_font_red theme_border_red single-line" v-if="item.hasCou == 1">券</div>
              </div>

              <div class="info-row num-info">
                <span class="font-small theme_font_tint" v-if="showSales">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
                <span class="font-small theme_font_tint" v-if="showComments">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span>
                <div v-if="item.productType != 2" class="car-c">
                  <div class="number theme_bg_red" v-if="getNumber(item) > 0">{{getNumber(item)}}</div>
                  <i class="iconfont mall-gouwuche theme_font_red car-size" :class="{'theme_font_gray_i': item.stockNum == '' || item.stockNum == '0' || item.stockNum == null}" @click.stop="addToCart(item)" v-if="$route.query.entryType !== 'wish'"></i>
                  <div v-else>
                    <div v-if="item.productType == 1 && item.deliverType == 2" :class="{'is-add-wish': item.isAddWishOrder}" class="wish-icon-c" @click.stop="addToWishList(item, $event)">
                      <img src="../../wish-list/images/wish-icon-no.png" alt="" class="wish-icon">
                      <img src="../../wish-list/images/wish-icon.png" alt="" class="wish-icon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="left-div">
        <div class="card" :class="{'no-stock': (item.stockNum == '' || item.stockNum == '0') && $store.state.globalConfig.showNoStockCover == '1'}" v-for="(item, index) in leftArray" @click="productEvent(item)">
          <div v-show="isOpen || index < 1">
            <div class="card-content theme_bg_white" :class="{'big-corner': $store.state.globalConfig.product_big_corner == '1'}">
              <div class="img-div">
                <img v-lazy="item.phMainUrl">
                <div class="presale" v-if="item.supportPreSale == 1">预售</div>
              </div>
              <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
              <div class="info-row">
                <PriceOrder :listitem="item"></PriceOrder>
              </div>
              <div class="info-row activity single-line" v-if="item.activityTypes != '' || item.hasCou == 1">
                <div class="act-item theme_font_red theme_border_red single-line" v-for="(activity, aidx) in item.showActivities" v-if="aidx < 2">{{activity}}</div>
                <div class="act-item theme_font_red theme_border_red single-line" v-if="item.hasCou == 1">券</div>
              </div>

              <div class="info-row num-info">
                <span class="font-small theme_font_tint" v-if="showSales">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
                <span class="font-small theme_font_tint" v-if="showComments">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span>
                <div v-if="item.productType != 2" class="car-c">
                  <div class="number theme_bg_red" v-if="getNumber(item) > 0">{{getNumber(item)}}</div>
                  <i class="iconfont mall-gouwuche theme_font_red car-size" :class="{'theme_font_gray_i': item.stockNum == '' || item.stockNum == '0' || item.stockNum == null}" @click.stop="addToCart(item)" v-if="$route.query.entryType !== 'wish'"></i>
                  <div v-else>
                    <div v-if="item.productType == 1 && item.deliverType == 2" :class="{'is-add-wish': item.isAddWishOrder}" class="wish-icon-c" @click.stop="addToWishList(item, $event)">
                      <img src="../../wish-list/images/wish-icon-no.png" alt="" class="wish-icon">
                      <img src="../../wish-list/images/wish-icon.png" alt="" class="wish-icon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-div">
        <div class="card" :class="{'no-stock': (item.stockNum == '' || item.stockNum == '0') && $store.state.globalConfig.showNoStockCover == '1'}" v-for="(item, index) in rightArray" @click="productEvent(item)">
          <div v-show="isOpen || index < 1">
            <div class="card-content theme_bg_white" :class="{'big-corner': $store.state.globalConfig.product_big_corner == '1'}">
              <div class="img-div">
                <img v-lazy="item.phMainUrl">
                <div class="presale" v-if="item.supportPreSale == 1">预售</div>
              </div>
              <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
              <div class="info-row">
                <PriceOrder :listitem="item"></PriceOrder>
              </div>
              <div class="info-row activity single-line" v-if="item.activityTypes != '' || item.hasCou == 1">
                <div class="act-item theme_font_red theme_border_red theme_bg_ml_red single-line" v-for="(activity, aidx) in item.showActivities" v-if="aidx < 3 && item.activityTypes != ''">{{activity}}</div>
                <div class="act-item theme_font_red theme_border_red single-line" v-if="item.hasCou == 1">券</div>
              </div>
              <div class="info-row num-info">
                <span class="font-small theme_font_tint" v-if="showSales">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
                <span class="font-small theme_font_tint" v-if="showComments">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span>
                <div v-if="item.productType != 2" class="car-c">
                  <div class="number theme_bg_red" v-if="getNumber(item) > 0">{{getNumber(item)}}</div>
                  <i class="iconfont mall-gouwuche theme_font_red car-size" :class="{'theme_font_gray_i': item.stockNum == '' || item.stockNum == '0' || item.stockNum == null}" @click.stop="addToCart(item)" v-if="$route.query.entryType !== 'wish'"></i>
                  <div v-else>
                    <div v-if="item.productType == 1 && item.deliverType == 2" :class="{'is-add-wish': item.isAddWishOrder}" class="wish-icon-c" @click.stop="addToWishList(item, $event)">
                      <img src="../../wish-list/images/wish-icon-no.png" alt="" class="wish-icon">
                      <img src="../../wish-list/images/wish-icon.png" alt="" class="wish-icon">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueLazyLoad from 'vue-lazyload'
  import PriceOrder from  '@/components/commonui/price/price-order'

  export default {
    name: "card-list",
    props: {
      listData: Array,
      cartProducts: Array,
      isOpen: {
        type: Boolean,
        default: true // 是否展开所有的
      },
    },
    components: {
      PriceOrder
    },
    data() {
      return {
        leftArray: [],
        rightArray: [],
        dataArray: []
      }
    },
    computed: {
      showSales() {
        return this.$store.state.globalConfig.app_prolist_sales_hide != 1
      },
      showComments() {
        return this.$store.state.globalConfig.app_prolist_comments_hide != 1
      }
    },
    methods: {
      getNumber: function (item) {
        if (!this.cartProducts || this.cartProducts.length == 0) {
          return 0
        }
        // console.log(this.cartProducts)
        for (let i = 0; i < this.cartProducts.length; i++) {
          let citem = this.cartProducts[i]
          if (citem.skuId == item.skuId) {
            return citem.number
          }
        }
      },
      getSkuNameStr: function (item) {
        let skuName = item.skuName
        if (item.interfaceType == '2') {
          let name = this.$store.state.globalConfig.interface_type_name_1 || '京东'
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${name}</span>` + skuName
        } else if (item.interfaceType == '1') {
          let name = this.$store.state.globalConfig.interface_type_name_2 || '有路'
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${name}</span>` + skuName
        }
        return skuName
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
        // 展示活动
        let showActivities = [];
        if (item.activityTypes) {
          for (let i = 0; i < item.activityTypes.length; i++) {
            let text = item.activityTypes[i];
            let activityTag = item.activityTags.length > i? item.activityTags[i]:'';
            if (!~showActivities.indexOf(text) && activityTag.indexOf('不显示') == -1) {
              showActivities.push(text)
            }
          }
          item.showActivities = showActivities;
        }
      },
      productEvent: function (item) {
        this.$emit('productEvent', item)
      },
      addToCart: function (item) {
        if (item.stockNum == '' || item.stockNum == '0' || item.stockNum == null) {
          this.$Toast('商品缺货！');
          return
        }
        this.$emit('addToCart', item)
      },
      addToWishList(item, event) {
        this.$Loading.open();
        this.$http.post('/app/json/wish_order/addWishOrder', {
          skuId: item.skuId,
          storeOuCode: item.storeOuCode
        }).then(res => {
          let data = res.data;
          if (data.status == 0) {
            event.target.classList.toggle('is-add-wish')
            if (data.data == 1) {
              this.$Toast('已将宝贝添加至心愿单啦~');
            } else {
              this.$Toast('已将宝贝移除心愿单~');
            }
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        }).catch(err => {
          this.$Toast(err);
          this.$Loading.close();
        })
      },
      initData: function () {
        let rightArr = [];
        let leftArr = [];
        this.dataArray = [];
        let pageType = this.$store.state.globalConfig.product_list_type
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i]
          this.dataProcessing(item)
          if (pageType == '1') {
            this.dataArray.push(item)
          } else {
            if (i % 2) {
              rightArr.push(item);
            } else {
              leftArr.push(item)
            }
          }
        }
        this.rightArray = rightArr;
        this.leftArray = leftArr;
      }
    },
    watch: {
      listData: {
        handler: function () {
          this.initData()
        },
        deep: true
      }
    },
    created() {
      this.$store.state.globalConfig.product_big_corner  = '1'
      this.initData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  .card-list {
    padding 0 4px;
    overflow hidden
    /*display flex;
    width 100%;
    flex-wrap : wrap*/
    .left-div {
      float left;
      width 50%;
    }
    .right-div {
      overflow hidden
      width 50%;
    }
    .card {
      width 100%;
      padding 4px;
      /*float left;*/
      .card-content {
        padding 0px 0 8px;
        overflow hidden;
        border-radius 6px;
        &.big-corner {
          border-radius 12px;
        }
        .img-div {
          position relative;
          width 100%;
          height 0px;
          padding-bottom 100%;
          img {
            position absolute;
            width 100%;
            height 100%;
          }
          .presale {
            position absolute;
            left 0;
            bottom 0;
            border-radius 0 15px 0 0;
            background: linear-gradient(90deg, #F8089F, #F80E26);
            font-size 14px;
            font-weight 500;
            color white;
            padding 5px 12px;
            z-index 2;
          }
        }
        .title {
          padding 0px 8px;
          margin 5px 0;
          font-size 14px;
          line-height 16px;
        }
        .info-row {
          font-size $font-size-medium;
          padding 4px 8px;

          .font-small {
            font-size 10px;
          }
        }

        .activity {
          display flex;
          align-items center;
          /*padding 0px 0;*/
          .act-item {
            padding 2px 8px;
            font-size 10px;
            border-radius 10px;
            border-width 0.5px
            border-style solid
            margin-right 4px;
          }
        }
        .num-info {
          padding-top 8px;
          .car-c {
            display inline-block;
            vertical-align middle;
            float right;
            margin-top -2px;
            position relative;
            .number {
              position absolute;
              right -8px;
              top -12px;
              font-size 10px;
              padding 2px 5px;
              color white;
              border-radius 15px;
              text-align center;
            }
          }
          .car-size {
            font-size 18px;
            position: relative
            &:after {
              content: ''
              position: absolute
              top: -10px
              left: -10px
              right: -10px
              bottom: -10px
            }
          }
          span:nth-child(2) {
            margin-left 10px;
          }
          .wish-icon-c {
            extend-click();
            .wish-icon {
              width 20px;
              height 20px;
              border-radius 50%
              &:last-child {
                display none;
              }
            }
            &.is-add-wish {
              .wish-icon {
                display none;
              }
              .wish-icon:last-child {
                display inline-block
              }
            }
          }
        }
      }
    }
    .equal-div {
      display flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .card {
        width 50%;
        padding 4px;
        .card-content {
          height 100%;
          &.big-corner {
            border-radius 12px;
          }
          .title {
            height 34px;
          }
          .info-row {
            height 25px;
          }
        }
      }
    }
    .no-stock {
      position relative;
      &:before {
        position absolute;
        left 50%;
        top 60px;
        margin-left -30px;
        content: '已售罄';
        font-size 14px;
        color white;
        text-align center;
        width 60px;
        height 60px;
        line-height 60px;
        border-radius 30px;
        background-color rgba(0, 0, 0, 0.5)
        z-index 2;
      }
      &:after {
        position absolute;
        left 0;
        right 0;
        top 0;
        bottom 0;
        content: '';
        background-color rgba(255, 255, 255, 0.5)
        z-index 1;
      }
    }
  }
</style>
