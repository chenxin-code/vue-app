<template>
  <div class="product-list">
    <div class="wrapper">
      <div class="scroll">
        <div class="layout-grid good-list" :style="getSideMargin()">
          <div class="goods" :class="{'no-stock': (item.stockNum == '0') && $store.state.globalConfig.showNoStockCover == '1', 'row-three-pro': moduleData.rowThreeProduct == true}" v-for="(item, index) in moduleData.rows" @click="enterNav(item);">
            <div class="goods-picture">
              <img class="full-img" :src="item.phMainUrl?item.phMainUrl+'?x-oss-process=image/format,jpg':'static/images/defaultImg_w.png'">
              <div class="corner-mark" v-if="item.cornerMark>0">
                <img :src="item | counerMarkUrl">
              </div>
            </div>
            <div class="goods-name double-line" v-if="moduleData.layout.hasTitle == '1'" v-html="item.showTitle"></div>
            <div class="activity-tags" v-if="item.activityTags.length > 0">
              <div class="tag single-line" v-for="text in item.activityTags">{{text}}</div>
            </div>
            <div class="goods-footer">
              <div class="price" v-if="moduleData.layout.hasPrice == '1'">
                <PriceOrder :listitem="item" :isRMBEnd="isRMBEnd"></PriceOrder>
                <!--<span class="price-x">￥</span>-->
                <!--<span class="price-z">{{item.dpedData.integer}}</span>-->
                <!--<span class="price-x">.{{item.dpedData.decimals}}</span>-->
                <!--<span class="line-price" v-if="item.dpedData.linePrice">原价:￥{{$market.toDecimal2(item.dpedData.linePrice)}}</span>-->
              </div>
              <!--<div>-->
                <!--<del v-if="item.showPrice > item.salePrice">￥{{item.showPrice}} </del>-->
              <!--</div>-->
              <div v-if="moduleData.layout.btnType == '1'" class="icon">
                <img src="static/images/product-list/icon_gods_car01.png" v-if="item.productType != 2 && $store.state.webtype == -1">
                <i class="iconfont mall-gouwuche theme_font_red car-size" :class="{'theme_font_gray_i': item.stockNum == '0'}" v-else-if="item.productType != 2" @click.stop="addToCart(item)"></i>
              </div>
              <div v-if="moduleData.layout.btnType == '2'" class="icon">
                <img src="static/images/product-list/icon_gods_car02.png">
              </div>
              <div v-if="moduleData.layout.btnType == '3'" class="icon">
                <img src="static/images/product-list/icon_gods_car03.png">
              </div>
              <div v-if="moduleData.layout.btnType == '4'" class="icon">
                <img src="static/images/product-list/icon_gods_car04.png">
              </div>
              <div v-if="moduleData.layout.btnType == '5'" class="icon">
                <img src="static/images/product-list/icon_gods_car05.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PriceOrder from  '@/components/commonui/price/price-order'

export default {
	name: 'product-list-grid',
  components: {PriceOrder},
  props: ['myIndex', 'usePorpData', 'propData', 'isRMBEnd'],
	computed: {
    pageData: function() {
      if (this.usePorpData == true) {
        return this.propData;
      }
      return this.$store.state.pageData;
    },
    moduleData: function() {
      if (this.myIndex == -1) {
        return this.pageData.productInfinite.data
      }
      return this.pageData.moduleList[this.myIndex].data;
    },
    dev(){
      return this.$store.state.webtype === '-1'
    },
	},
	data() {
		return {};
  },
  created(){
    this.testCorerMark();
  },
  filters:{
    counerMarkUrl(item){
      return item.cornerMark<6
        ? `static/images/product-list/icon_gods_hot0${item.cornerMark}.png`
        : item.selfCornerMarkUrl;
    }
  },
	methods: {
    testCorerMark(){
      this.moduleData.rows.forEach(item=>{
        item.cornerMark ? null : this.$set(item,'cornerMark', 0);
        item.selfCornerMarkUrl ? null : this.$set(item,'selfCornerMarkUrl', '');
      })
    },
    getSideMargin: function () {
      let sideMargin = this.moduleData.sideMargin
      if (sideMargin) {
        let sty = "margin-left:" + sideMargin + '%;'
        sty += "margin-right:" + sideMargin + '%;'
        return sty
      }
      return ''
    },
    enterNav:function(product){
      this.$market.productEvent(product, this.$route, this.moduleData.onlyDeliveryType)
    },
    addToCart: function (item) {
      this.$Loading.open();
      let url = "/app/json/app_cart/addCart";
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [
          {
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            activityId: '',
            selfActivityId: item.activityId,
            deliveryType: this.$store.state.mall2.staticDeliverType,
            number: 1,
          },
        ],
        orderCategory: undefined,
        vipUnitUserCode: undefined,
        deliveryType: item.deliverType,
      };
      this.$http.post(url, paramsData).then(
        (res) => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.mall2.cartNum = data.data;

            this.$toast("添加购物车成功！");
            // if (this.pageType == "") {
            //   // 孙哥牛逼，加入购物车，直接返回了 count
            //   this.$store.state.mall2.cartNum = data.data;
            //   // this._getCartCount();
            // } else {
            //   this.deductionCart();
            // }
            //记录添加购物车的项
            // this.addToCartItem = item;
            // this.$nextTick(() => {
            //   this.showProductImg = true;
            // });
          } else {
            this.$Toast(data.info);
          }
        },
        (error) => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.product-list {
  position: relative;
  width: 100%;
  height: 100%;
  // background-color #f6f6f6
}
.wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  flex: 1 1 0%;
  overflow: hidden;
}
.scroll {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.good-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 5px 8px;
}
.goods {
  overflow hidden;
  display: flex;
  flex-direction: column;
  width: 48.8%;
  background-color: #fff;
  border-radius 5px;
  box-shadow 0 1px 8px #efefef;
  &.active{
    border:1px dashed #57a3f3;
  }
  &.row-three-pro {
    width: 32.5%;
    &.row-three-pro:nth-child(3) {
      margin-top 0px;
    }
  }
  &.goods:nth-child(n+3) {
    margin-top 8px;
  }
  .goods-picture {
    propor-padding: 100;
  }
  .goods-name {
    flex: 1;
    padding: 0 10px;
    color: $color-text;
    font-size: $font-size-medium;
    line-height 16px
    max-height 32px;
    overflow hidden;
    margin-top: 8px;
    margin-bottom: 8px;
    white-space: break-all;
  }
  .activity-tags {
    width 100%;
    padding 0 10px 5px;
    display flex;
    align-items top;
    overflow hidden;
    .tag {
      background-color #Fef4fa;
      color #F80F16;
      padding 3px 5px;
      border-radius 3px;
    }
    .tag:nth-child(n+2) {
      margin-left 10px;
    }
  }
  .goods-footer {
    // margin-top: 4px;
    margin: 0px 8px 8px;
    display: flex;
    align-items: flex-end;
    overflow hidden;
    .price {
      flex: 1;
      color #F80F16;
      .price-x {
        font-weight 500;
        font-size 12px;
      }
      .price-z {
        font-weight 500;
        font-size 18px;
        margin 0px -4px;
      }
      .line-price {
        color #999
        margin-left 4px;
      }
    }
    /*div:nth-child(1) {
      color: $color-theme-o;
      font-size: $font-size-medium-x;
    }
    div:nth-child(2) {
      color: #a0a0a0;
      font-size: $font-size-medium-s;
      flex: 1;
      padding-left: 5px;
    }*/
    .icon {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      img {
        height 24px
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
.corner-mark {
  position: absolute;
  top: 0;
  right: left;
  width: 36px;
  height: 36px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
