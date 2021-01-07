
<template>
  <div class="list">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <list
        :class="{'list-shadow':$store.state.webtype != 2}"
        @productEvent="productEvent"
        @addShopping="addShopping"
        :params="params"
        :styleObj="styleObj"
        :screenArr="screenArr"
      ></list>
      <div
        ref="gouwuche"
        class="cart-div theme_bg_dark_d"
        :class="{'gouwucheani':addCartBtnAn}"
        @click.stop="goCart"
      >
        <p
          class="cart-num theme_bg_red theme_font_white"
          v-if="($store.state.microSho.carts.length + $store.state.microSho.groupbuyingCarts.length) > 0" >{{$store.state.microSho.carts.length + $store.state.microSho.groupbuyingCarts.length}}</p>
        <i class="iconfont mall-gouwuche theme_font_white"></i>
      </div>
      <transition name="bounce" @afterEnter="productImgAfterEnter">
        <img
          :src="this.addToCartItem.picMainUrl || this.addToCartItem.mainMobilePicUrl"
          alt
          class="productImg"
          v-if="showProductImg && addToCartItem"
        >
      </transition>
      <transition @after-enter="afterEnter" @before-enter="beforeEnter">
        <div class="anProductImg" v-if="showAddCartAn  && addToCartItem">
          <img :src="this.addToCartItem.picMainUrl || this.addToCartItem.mainMobilePicUrl" alt>
        </div>
      </transition>
    </nav-content>
  </div>
</template>

<script>
import list from "../../common/list.vue";

export default {
  name: "",
  components: {
    list
  },
  data() {
    return {
      paramsNew: {},
      loading: false,
      hasMore: true,
      array: [],
      screenArr: [
        {
          name: "综合",
          type: 0,
          default: 0,
          allScreen: false,
          typeText: "sortType",
          sort: "sortProp",
          classStaId: "classStaId",
          classStaLevel: "classStaLevel",
          priceLow: "priceLow",
          priceHigh: "priceHigh"
        },
        { name: "销量", type: 2 },
        { name: "价格", type: 1 }
      ],
      params: {
        page: 1,
        rows: '',
        // storeId: 7,
        groupFlag: this.$route.query.groupFlag,
        pickUpId: this.$store.state.mall2.zitiAddress.id,
        storeCode: this.$route.query.storeCode || '',
        deliverType: this.$store.state.mall2.staticDeliverType, // 配送方式 2快递运输 1上门自提 12都支持
        sortType: "asc", // 排序方式 desc 降序 asc 升序
        sortProp: "0" // 排序属性 0 综合 1 价格 2销量
      },
      styleObj: {
        listStyle: false,
        rowStyle: 2,
        isObject: false,
        isHeight: "96",
        url: "/app/json/app_distribution_order/getHotSaleList"
      },
      //当前点击加入购货物车的商品
      addToCartItem: undefined,
      //加入购物车的时候  显示图片动画
      showProductImg: false,
      // 抛物线动画
      showAddCartAn: false,
      //显示购物车按钮动画
      addCartBtnAn: false
    };
  },
  created(){
    // this.params.deliverType = this.$store.state.mall2.staticDeliverType
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    productEvent(product) {
      let path = "/micro_sho/shareDetail/" + this.$util.getDataString();
      if (product.productType == 2){
        path = '/micro_sho/shareTicketDetail';
      }
      if (this.$route.query.groupFlag) {
        path = "/micro_sho/sharebuyingDetail/" + this.$util.getDataString();
      }
      
      this.$router.push({
        path: path,
        query: {
          // id: product.skuId,
          // skuId: product.skuId,
          // lastPath: this.$route.path,
          // deliveryType: product.deliverType,
          // productType: product.productType,
          // profit: product.profit,
          // listData: product
          id: product.skuId,
          skuId: product.skuId,
          lastPath: this.$route.path,
          deliveryType: this.$store.state.mall2.staticDeliverType,
          productType: product.productType,
          profit: product.profit,
          listData: product,
          microStoreCode: this.$route.query.storeCode,
          proSkuDistributionId: product.proSkuDistributionId
        }
      });
    },
    addShopping(item) {
      if (this.$route.query.groupFlag) {
        let arr = this.$store.state.microSho.groupbuyingCarts;
        if (arr.length == 0) {
            this.$store.state.microSho.groupbuyingCarts.push({
                skuId: item.skuId,
                storeOuCode: item.storeOuCode,
                deliverType: item.deliverType,
                proSkuDistributionId: item.proSkuDistributionId,
                number: item.minPurNumber,
                // number: 1,
                checked: 1,
                selfActivityId: -2
            });
        } else {
            let status = null;
            let arr = this.$store.state.microSho.groupbuyingCarts;
            arr.forEach((element, index) => {
                if (item.skuId == element.skuId) {
                    this.$store.state.microSho.groupbuyingCarts[index].number += 1;
                    status = true;
                    return;
                }
            });
            if (!status) {
                this.$store.state.microSho.groupbuyingCarts.push({
                    skuId: item.skuId,
                    storeOuCode: item.storeOuCode,
                    deliverType: item.deliverType,
                    proSkuDistributionId: item.proSkuDistributionId,
                    number: item.minPurNumber,
                    // number: 1,
                    checked: 1,
                    selfActivityId: -2
                });
            }
        }
      } else {
        let arr = this.$store.state.microSho.carts
        if(arr.length == 0){
          this.$store.state.microSho.carts.push({
            skuId: item.skuId,
            storeOuCode: item.storeOuCode,
            deliverType: item.deliverType,
            proSkuDistributionId: item.proSkuDistributionId,
            number: item.saleNumBegin,
            // number: 1,
            checked: 1,
            selfActivityId:-2
          })
        } else {
          let status = null
          let arr = this.$store.state.microSho.carts
          arr.forEach((element,index) => {
            if(item.skuId == element.skuId){
              this.$store.state.microSho.carts[index].number +=1
              status = true
              return
            }
          })
          if(!status){
            this.$store.state.microSho.carts.push({
              skuId: item.skuId,
              storeOuCode: item.storeOuCode,
              deliverType: item.deliverType,
              proSkuDistributionId: item.proSkuDistributionId,
              number: item.saleNumBegin,
              // number: 1,
              checked: 1,
              selfActivityId:-2
            })
          }
        }
      }
      this.addToCartItem = item;
      this.$nextTick(() => {
        this.showProductImg = true;
      })
    },
    productImgAfterEnter(el) {
      this.showProductImg = false;
      this.showAddCartAn = true;
    },
    beforeEnter(el) {
      el.style.transform = `translate3d(0,0,0)`;
      el.children[0].style.opacity = 0;
    },
    afterEnter(el) {
      let elBottom = el.getBoundingClientRect().bottom;
      let elLeft = el.children[0].getBoundingClientRect().left;
      let gwcLeft = this.$refs.gouwuche.getBoundingClientRect().left;
      let gwcBottom = this.$refs.gouwuche.getBoundingClientRect().top;
      el.style.transform = `translate3d(0,${gwcBottom - elBottom}px,0)`;
      el.style.transition =
        "transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)";
      el.children[0].style.transform = `translate3d(${gwcLeft - elLeft}px,0,0)`;
      el.children[0].style.transition = "transform .55s linear";
      el.children[0].style.opacity = 1;
      this.showAddCartAn = false;
      el.addEventListener("transitionend", () => {
        this.addCartBtnAn = true;
        this.$refs.gouwuche.addEventListener("webkitAnimationEnd", () => {
          this.addCartBtnAn = false;
        });
      });
    },
    goCart() {
      let path = '/micro_sho/cart';
      if (this.$route.query.groupFlag) {
        path = '/micro_sho/buyingCart'
      }
      this.$router.push({
          path: path,
          query: {microStoreCode: this.$route.query.storeCode}
      });
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;
  .list-shadow{
    box-shadow 0px -2px 2px #efefef
    border-radius 10px
    margin-top: 2px
  }
  .setNavContent{
    margin-top -60px
  }
  .cart-div {
    position: fixed;
    right: 16px;
    bottom: 170px;
    width: 36px;
    height: 36px;
    border-radius: 20px;
    padding: 8px;
    z-index 10;

    .cart-num {
      position: absolute;
      right: -5px;
      top: -5px;
      border-radius: 12px;
      padding: 2px 4px;
      font-size: 12px;
    }

    i {
      font-size: 20px;
    }
  }

  .productImg {
    position: fixed;
    z-index: 2000;
    left: 147.5px;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    top: 120px;
  }

  .anProductImg {
    position: fixed;
    z-index: 2000;
    left: 0px;
    width: 100%;
    top: 160px;
    overflow: hidden;
    text-align: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }

  .gouwucheani {
    animation: addCart-in 0.75s;
  }

  @keyframes addCart-in {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.8);
    }

    100% {
      transform: scale(1);
    }
  }
}
</style>
