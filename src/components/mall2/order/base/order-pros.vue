/**Created by liaoyingchao on 2018/11/26.*/

<template>
  <div class="order-pros" >
    <div class="order-pro-row scroll-style" v-if="orderItemList.length > 1">
      <div class="img-div" v-for="product in orderItemList">
        <img :src="product.phPictureUrl">
      </div>
    </div>
    <div v-if="orderItemList.length == 1">
      <div class="order-pro-row" v-for="product in orderItemList" :key="product.id">
        <div class="img-div" @click.stop="enterProductDetail(product)">
          <img :src="product.phPictureUrl">
        </div>
        <div class="info-div" >
          <div class="info_detail">
            <div class="title theme_font_black">{{product.skuName}}</div>
            <div class="price_detail">
              <span class="unit">￥</span>
              <span class="integer">{{goodsAmount.integer}}</span>
              <span class="decimal">.{{goodsAmount.decimal}}</span>
            </div>
          </div>
          <div class="number theme_font_tint" v-if="product.number >= 1">
            <span>购买数量：</span>
            <span> {{product.number}}</span>
          </div>
          <div class="number theme_font_red" v-if="tag == 16 && product.productType == 8 && endTime != ''">{{timeString}}商家未接单，将自动取消订单</div>
        </div>
      </div>
    </div>
    <!--<div class="watermark" v-if="watermark == 1">-->
      <!--<img src="../img/watermark.png">-->
    <!--</div>-->
     
  </div>
</template>

<script>

  import countDownJs from "../../../Vendor/countdown/js";

  export default {
    name: "order-pros",
    props: ['orderItemList', 'watermark', 'tag','dataItem'],
    components: {},
    data() {
      return {
        endTime: '',
        goodsAmount: {
          integer: "0",
          decimal: "00"
        },
      }
    },
    computed: {
      timeString() {
        let h = 0, m = 0, s = 0;
        if (this.endTime == '') {
          return h + '时' + m + '分' + s + '秒'
        }
        let time = this.endTime - this.$store.state.severTime.currentTime
        if (time <= 0) {
          return h + '时' + m + '分' + s + '秒'
        }
        if (time > 3600) {
          h = parseInt(time / 3600)
          time = time % 3600
        }
        if (time > 60) {
          m = parseInt(time / 60)
          time = time % 60
        }
        s = time
        return h + '时' + m + '分' + s + '秒'
      },
    },
    methods: {
      computedPrice(){
        console.log('this.orderItemList[0].salePrice',this.orderItemList[0].realPrice)
        if(this.orderItemList.length == 1){
          let amountArr = this.$util
            .toDecimal2(this.orderItemList[0].realPrice)
            .toString()
            .split(".");
          if (amountArr.length !== 0) {
            this.goodsAmount.integer = amountArr[0];
            this.goodsAmount.decimal = amountArr[1];
          }
        }else{
          return
        }
      },
      enterProductDetail:function(product){
        // 砍价订单禁止进入详情
        if(this.$store.state.globalConfig.cut_price_strict==1){
          return
        }
        if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
          return ;
        }
        if (this.watermark == 1) {
          // 蜂鸟配送无法查看详情
          return ;
        }
        let path = '/mall2/detail/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            storeOuCode: product.storeOuCode,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType
          }
        })
      }
    },
    created() {
      countDownJs.heartbeat()
      if (this.orderItemList.length == 1 && this.tag == 16) {
        let item = this.orderItemList[0]
        if (item.productType == 8) {
          let paidTime = item.paidTime
          paidTime = paidTime.replace(/\-/g, "/")
          let t1 = (new Date(paidTime)).getTime()
          let stockupCancel = this.$store.state.globalConfig.stockup_cancel || 7200
          let t3 = Math.floor(t1 / 1000)
          this.endTime = parseInt(t3 + stockupCancel)
        }
      }
      if(this.orderItemList.length == 1){
        this.computedPrice();
        console.log('this.orderItemList',this.orderItemList)
      }
    },
    beforeDestroy() {
      countDownJs.removeHeartbeat()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .order-pros {
    width 100%;
    overflow hidden
    position relative;
    .watermark {
      position absolute;
      right 0;
      bottom 10px;
      img {
        display block;
        width 40px;
        height 40px;
      }
    }
    .scroll-style {
      overflow-x: auto;
      overflow-y: hidden;
      white-space:nowrap;
    }
    .order-pro-row {
      width 100%;
      font-size 0px;
      .img-div {
        display inline-block;
        vertical-align middle;
        width 80px;
        height 80px;
        margin-right 8px;
        img {
          display block;
          width 100%;
          height 100%;
        }
      }
      .info-div {
        width 250px;
        display inline-block;
        vertical-align middle;
        line-height 22px;

        .info_detail{
          display: flex;
          justify-content: space-between;
          .title {
            max-width 145px;
            max-height 44px;
            font-size $font-size-medium;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price_detail{
            flex: 1;
            min-height $font-size-medium;
            font-size $font-size-medium;
            text-align right;
            font-weight: 400;
            color: #121212;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            .unit{
              font-size: 12px;
              line-height: 18px;
            }
            .integer{
              font-size: 16px;
              line-height: 24px;
            }
            .decimal{
              font-size: 12px;
              line-height: 18px;
            }
          }
        }

        .number {
          margin-top 10px;
          min-height $font-size-small;
          font-size $font-size-small;
        }
        .pickup-tip {
          margin-top 5px;
          font-size 12px;
        }
      }
    }
  }
</style>
