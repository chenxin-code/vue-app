<template>
  <div>
    <van-swipe-cell :right-width="80" :on-close="onClose" class="cell-swipe">
      <div class="cart-item">
        <div class="cart-item-sel">
          <i v-show="cartitem.isGift == 0 || isEditing " class="iconfont font-large"
             :class="cartJS.getXZClass(isEditing,cartitem.checked,cartitem.dchecked)"
             @click="setCartSel(cartitem,storeitem,occuritem)"></i>
        </div>
        <div class="cell-content">
          <div class="good-content">
            <div class="good-img" :class="{'img-samll': cartitem.isGift != 0}">
              <div class="click-div" @click.stop="enterGoodDetail(cartitem)"></div>
              <img :src="cartitem.phPictureUrl" alt="">
              <div class="cart-item-state theme_font_white" v-if="cartitem.state == 1 || cartitem.state == 4">
                {{getStateStr()}}
              </div>
            </div>
            <div class="good-detail">
              <!--<div v-if="cartitem.isGift == 1">-->
              <!--<span class="good-tag theme_border_red  theme_font_red ">赠品</span>-->
              <!--</div>-->
              <!--<div v-if="cartitem.isGift == 2">-->
              <!--<div class="good-tag theme_border_red  theme_font_red ">换购</div>-->
              <!--</div>-->
              <div class="good-info">
                <p class="good-name line-two" :class="getFontColorClass()"><span
                  class="good-tag theme_border_red  theme_font_red" v-if="cartitem.isGift == 1">赠品</span><span
                  class="good-tag theme_border_red  theme_font_red" v-if="cartitem.isGift == 2">换购</span>
                  {{cartitem.productName}}</p>
                <p class="size theme_font_gray  single-line" v-if="cartitem.isGift == 0">{{cartitem.specs}}</p>
                <div class="good-paras">
                  <div class="paras-left">

                    <PriceOrder :productData="cartitem"></PriceOrder>
                  </div>
                  <div class="paras-right">
                    <!--//1下架 4无货-->
                    <!--<Counter v-if="cartitem.isGift == 0 && cartitem.state != 1 &&cartitem.state != 4"-->
                             <!--v-model="cartitem.number"-->
                             <!--:minValue="cartitem.saleNumBegin" :stepNum="cartitem.saleNumStep"-->
                             <!--:maxValue="cartitem.saleNumMax"-->
                             <!--:itemInfo="cartitem" @numChange="numChange"></Counter>-->
                    <van-stepper v-if="cartitem.isGift == 0 && cartitem.state != 1 &&cartitem.state != 4" v-model="cartitem.number" :min="cartitem.saleNumBegin" :step="cartitem.saleNumStep" :max="cartitem.saleNumMax" @change="numChange" integer/>
                    <span v-if="cartitem.isGift != 0" class="gift-num theme_font_gray">X{{cartitem.number}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--已参加单品活动 级别2-->
          <div class="good-salespro" v-if="singleActivities_2.length > 0 && curSingleActivity != null">
            <!--<div class="good-salespro-left">-->
            <p class="sa-type">{{curSingleActivity.currentSelfActivity.mktActivityType}}</p>
            <p class="sl-title single-line">{{curSingleActivity.currentSelfActivity.mktActivityTitle}} <span class="theme_standard_font">{{curSingleActivity.digitalPrice}}{{getDigitalDisplayName(curSingleActivity.acctType)}} + ¥{{$util.toDecimal2(curSingleActivity.price)}}</span></p>
            <p class="good-salespro-right" v-if="singleActivities_2.length > 1" @click="reviseSingleActivity()">修改</p>
            <p class="good-salespro-right" v-if="singleActivities_2.length == 1" @click="removeSingleActivity()">不参加</p>
          </div>
          <!--未参加单品活动 级别2，但是有活动 级别2-->
          <div class="good-salespro" v-for="item in singleActivities_2"
               v-if="singleActivities_2.length > 0 && curSingleActivity == null">
            <p class="sa-type">{{item.currentSelfActivity.mktActivityType}}</p>
            <p class="sl-title single-line">{{item.currentSelfActivity.mktActivityTitle}} <span class="theme_standard_font">{{item.digitalPrice}}{{getDigitalDisplayName(item.acctType)}} + ¥{{$util.toDecimal2(item.price)}}</span></p>
            <p class="good-salespro-right" @click="joinSingleActivity(item.currentSelfActivity)">参加</p>
          </div>

          <div class="good-salespro" v-if="cartitem.activity.length > 1 && cartitem.isGift == 0">
            <!--<div class="good-salespro-left">-->
            <p class="sl-tag theme_border_red_i theme_font_red">{{getActivityTag()}}</p>
            <p class="sl-title single-line">{{getActivityTitle()}}</p>
            <!--</div>-->
            <p class="good-salespro-right" @click="reviseActivity()">修改</p>
          </div>
        </div>
      </div>
      <div class="del-btn" slot="right">删除</div>
    </van-swipe-cell>
  </div>
</template>

<script>
  import cartJS from './js/cart'
  // import Counter from '@/components/commonui/counter/counter'
  // import SalesPro from '../common/salepro'
  import PriceOrder from '@/components/commonui/price/price-order'
  import {CellSwipe} from 'mint-ui'

  export default {
    name: "cart-item",
    components: {
      // Counter,
      CellSwipe,
      PriceOrder
    },
    props: [
      'cartitem',
      'storeitem',
      'occuritem',
      'isEditing',
    ],
    data() {
      return {
        cartJS: cartJS,
        // 等级为2的单品活动
        singleActivities_2: [],
        curSingleActivity: null
      }
    },
    methods: {
      getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '200001')
        // let arr = this.$store.state.globalConfig.acctList;
        // for (let i = 0; i < arr.length; i++) {
        //   let item = arr[i]
        //   if (item.acctType == acctType) {
        //     return item.displayName
        //   }
        // }
        // return '积分'
      },
      onClose(clickPosition, instance) {
        switch (clickPosition) {
          case 'left':
          case 'cell':
          case 'outside':
            instance.close();
            break;
          case 'right':
            this.$emit('deleteCart', [this.cartitem]);
            instance.close();
            break;
        }
      },
      initSingleActivity: function () {
        this.singleActivities_2 = []
        if (this.cartitem.currentSelfActivity && this.cartitem.currentSelfActivity.mktActivityPriceLevel == 2) {
          this.curSingleActivity = this.cartitem
          this.singleActivities_2.push(this.cartitem)
        } else {
          this.curSingleActivity = null
        }
        if (this.cartitem.selfActivity) {
          for (let i = 0; i < this.cartitem.selfActivity.length; i++) {
            let item0 = this.cartitem.selfActivity[i]
            let item = item0.currentSelfActivity;
            if (item.mktActivityPriceLevel == 2) {
              // item.digitalPrice = item0.digitalPrice
              // item.digitalPrice = item0.digitalPrice
              this.singleActivities_2.push(item0)
            }
          }
        }
      },
      removeSingleActivity: function () {
        let arr = this.$store.state.microSho.carts
        arr.forEach((element,index) => {
          if(this.cartitem.skuId == element.skuId){
            this.$store.state.microSho.carts[index].selfActivityId = '-2'
            return
          }
        })
        this.$emit('updateCart')
      },
      joinSingleActivity: function (item) {
        let arr = this.$store.state.microSho.carts
        arr.forEach((element,index) => {
          if(this.cartitem.skuId == element.skuId){
            this.$store.state.microSho.carts[index].selfActivityId = item.mktActivityId
            return
          }
        })
        this.$emit('updateCart')
      },
      reviseSingleActivity: function () {
        let listData = [];

        for (let i = 0; i < this.singleActivities_2.length; i++) {
          let item = this.singleActivities_2[i];
          listData.push({
            mktActivityId: item.currentSelfActivity.mktActivityId,
            title: item.currentSelfActivity.mktActivityTitle + ' ' + item.digitalPrice + this.getDigitalDisplayName(item.acctType) + '+¥' + this.$util.toDecimal2(item.price),
            checked: item.currentSelfActivity.mktActivityId == this.curSingleActivity.currentSelfActivity.mktActivityId
          })
        }
        listData.push({
          mktActivityId: '-2',
          title: '不参加兑换活动',
          checked: false
        })
        SalesPro.open({
          listData: listData,
          sureFunc: (item1) => {
            let carts = [{
              skuId: this.cartitem.skuId,
              storeOuCode: this.cartitem.storeOuCode,
              selfActivityId: item1.mktActivityId
            }];
            this.$emit('updateCart', carts)
          }
        });
      },
      deleteCartItem: function () {
        this.$emit('deleteCart', [this.cartitem]);
      },
      enterGoodDetail: function (cartitem) {
        let path = '/micro_sho/shareDetail/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            storeOuCode: cartitem.storeOuCode,
            skuId: cartitem.skuId,
            lastPath: this.$route.path,
            deliveryType: cartitem.deliverType,
            productType: cartitem.productType,
            activityId: this.curSingleActivity ? this.curSingleActivity.mktActivityId : ''
          }
        })
      },
      setCartSel: function (cartitem, storeitem, occuritem) {
        this.$emit('setCartSel', cartitem, storeitem, occuritem);
      },
      getActivityTitle: function () {
        for (let i = 0; i < this.cartitem.activity.length; i++) {
          let item = this.cartitem.activity[i];
          if (item.mktActivityId == this.cartitem.activityId) {
            return item.mktActivityTitle;
          }
        }
        return ''
      },
      getActivityTag: function () {
        for (let i = 0; i < this.cartitem.activity.length; i++) {
          let item = this.cartitem.activity[i];
          if (item.mktActivityId == this.cartitem.activityId) {
            return item.mktActivityType;
          }
        }
        return ''
      },
      getItemAmount: function (amount, index) {
        return cartJS.getItemAmount(amount, index)
      },
      reviseActivity: function () {
        let listData = [];

        for (let i = 0; i < this.cartitem.activity.length; i++) {
          let item = this.cartitem.activity[i];
          let checked = false;
          if (this.cartitem.activityId == item.mktActivityId) {
            checked = true;
          }
          listData.push({
            mktActivityId: item.mktActivityId,
            title: item.mktActivityTitle,
            checked: checked
          })
        }
        SalesPro.open({
          listData: listData,
          sureFunc: this.sureFunc
        });
      },
      sureFunc: function (item) {
        let carts = [{
          skuId: this.cartitem.skuId,
          storeOuCode: this.cartitem.storeOuCode,
          activityId: item.mktActivityId
        }];
        this.$emit('updateCart', carts)
      },
      numChange: function () {
        this.$emit('numChange', this.cartitem);
      },
      getStateStr: function () {
        if (this.cartitem.state == 1) {
          return '下架'
        } else if (this.cartitem.state == 4) {
          return '无货'
        }
        return ''
      },
      getFontColorClass: function () {

        if (this.cartitem.state == 1 || this.cartitem.state == 4) {
          return 'theme_font_gray_i'
        }
        return ''
      },

    },
    created() {
      this.initSingleActivity()
    },
    watch: {
      cartitem() {
        this.initSingleActivity()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"

  .cell-swipe {
    margin-left -20px
    background none
    padding 0px

    .mint-cell-wrapper {
      padding 0px !important
    }
  }

  .del-btn {
    width 80px;
    height 100%;
    background-color #F80F16;
    color white;
    display: flex
    align-items: center
    justify-content: center;
  }

  .cart-item {
    display flex
    align-items center
    background none
    overflow hidden;

    .cart-item-sel {
      width 15px

      i {
        margin-left -10px;
        padding 20px 20px 20px 10px;
      }
    }

    .cell-content {
      flex 1;
      padding 10px 10px 10px 15px;
      overflow hidden;

      .good-content {
        display flex
        align-items center
      }

      .good-salespro {
        display flex
        align-items center
        justify-content space-between
        margin-top 10px

        .sa-type {
          font-size $font-size-small
          padding 3px 0px 3px 10px;
          font-weight 500;
        }

        .sl-tag {
          font-size $font-size-small
          padding 2px 6px
          border-radius 8px
          border-width 0.5px
          border-style solid
        }

        .sl-title {
          flex 1
          margin-left 4px
          font-size $font-size-small
          span {
            margin-left 10px;
          }
        }

        /*.good-salespro-left{
          flex 1
          display flex
          align-items center
        }*/

        .good-salespro-right {
          font-size $font-size-small
          padding 2px 6px
        }

      }

      .good-img {
        width 80px
        height 80px
        position relative
        min-width 0

        img {
          display block;
          width 80px
          height 80px
        }

        .click-div {
          position absolute;
          left 0px;
          top 0px;
          bottom 0px;
          right -130px;
          z-index 1;
        }

        .cart-item-state {
          position absolute
          left 0px
          top 0px
          width 100%
          height 100%
          border-radius 40px
          font-size $font-size-large-x
          line-height 80px
          background-color: rgba(0, 0, 0, 0.5)
          text-align center
        }

      }

      .img-samll {
        width 68px
        height 68px
      }

      .good-detail {
        flex 1
        padding-left 12px
        display flex
        min-width 0

        .good-tag {
          font-size $font-size-small
          padding 0px 6px
          border-radius: 20px;
          border: 0.5px solid
          display inline-block
        }

        .good-info {
          flex 1
          margin-left 10px
          overflow hidden

          .good-name {
            margin-bottom 6px;
            font-size $font-size-medium
            height 36px;
            line-height 18px;
          }

          .size {
            padding-top 2px;
            padding-bottom 8px
            font-size $font-size-medium-s
          }

          .good-paras {
            display flex
            justify-content space-between
            align-items flex-end

            .paras-left {

              .money-small {
                font-size $font-size-small
              }

              .money-large {
                font-size $font-size-medium-x
              }
            }

            .paras-right {
              margin-right 0px;

              .gift-num {
                font-size $font-size-medium-x
              }
            }
          }
        }
      }
    }

    .font-large {
      font-size $font-size-large
    }

    .line-two {
      ellipse-2();
    }

  }
</style>
