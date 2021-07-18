<template>
  <div class="component-goodPanel" @click="toDetails">
    <div
      class="goodPanel-remain"
      :style="{
        backgroundImage: require('../../activity/images/-s-img_card_tips_default.png'),
      }"
    >
      <div class="remain-times" v-if="getTimeTitle() !== '活动已结束'">
        <Countdown :endTime="getCountdownTime()"></Countdown>
      </div>
    </div>
    <dl class="good-ms">
      <dd>
        <van-image class="image-comm" :src="resouce.groupbuySkuPicurl[0]" />
      </dd>
      <dt>
        <div class="good-name">{{ resouce.groupbuySkuName }}</div>
        <div class="price-x">
          <div class="sale-price line-through">
            <span>销售价格&nbsp;:</span
            ><em>&nbsp;&nbsp;¥{{ resouce.groupbuyLinePrice }}</em>
          </div>
          <div class="purchase-price">
            <span>团购价格&nbsp;:</span
            ><em>&nbsp;&nbsp;¥{{ resouce.groupbuyBuyerPrice }}</em>
          </div>
        </div>
      </dt>
    </dl>
    <!-- <div class="remain-num-x">
      已抢{{ resouce.groupbuyPurchaseNumber }}件/剩余{{
        resouce.groupbuyStockNumber
      }}件
    </div> -->
    <!-- <div class="use-buy-x" v-if="resouce.avatarList.length">
      <div class="advantor-x">
        <van-image class="user-image" v-for="(item, index) in resouce.avatarList" :key="index" :src="item" :error-icon="defaultAvatar" />
      </div>
      <span>等{{resouce.purchasedQuantity > 999 ? '999+':resouce.purchasedQuantity}}人购买了此商品</span>
    </div> -->
    <button :class="resouce.groupbuyStockNumber == 0?'no_goods buy-button-x':'buy-button-x' " @click.stop="goConfirm()">
      <img :src="require('../../activity/images/icon_shop_default.png')" alt="">
      <div>购买</div>
    </button>
  </div>
</template>
<script>
import Countdown from "@/components/Vendor/countdown/purchaseTime.vue";
import vantImage from "@/components/bulk/components/vantImage.js";
export default {
  name: "goodPanel",
  components: {
    Countdown,
  },
  props: {
    resouce: {
      type: Object,
    },
  },
  data() {
    return {
      defaultAvatar: require("@/components/bulk/activity/images/user-default.png"),
    };
  },
  methods: {
    getTimeTitle: function () {
      let nowT = this.$store.state.severTime.currentTime;
      // let startT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime)
      // if (nowT < startT) {
      //   return '距离开始还剩:'
      // }
      let endT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime);
      if (nowT < endT) {
        return "距离结束还剩:";
      }
      return "活动已结束";
    },
    getCountdownTime: function () {
      let nowT = this.$store.state.severTime.currentTime;
      // let startT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime)
      // if (nowT < startT) {
      //   return startT
      // }
      let endT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime);
      if (nowT < endT) {
        return endT;
      }
      return endT;
    },
    toDetails() {
      this.$store.commit("setCharseInfo", this.resouce);
      this.$router.push({
        name: "商品详情",
        params: {
          resouce: this.resouce,
        },
      });
    },
    goConfirm() {
      if(this.resouce.groupbuyStockNumber == 0){
        this.$toast('该商品没有库存啦~')
        return
      }
      this.$store.commit("setCharseInfo", this.resouce);
      this.$router.push({
        name: "确认订单",
        params: {
          resouce: this.resouce,
        },
      });
    },
  },
};
</script>
<style scoped>
.line-though {
  text-decoration: line-through;
}
.component-goodPanel:nth-last-child(1) > .line {
  background: transparent;
}
.component-goodPanel {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
  width: 345px;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 0 15px 16px 0;
}

.goodPanel-remain {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 29px;
  width: 215px;
  background-image: url("../../activity/images/-s-img_card_tips_default.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.remain-times {
  margin-left: 10.5px;
}

.colon {
  display: inline-block;
  margin: 0 4px;
  color: #ee0a24;
}
.block {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 17px;
  background: #d0021b;
  border-radius: 3.5px;
  font-size: 11px;
  font-weight: 400;
  color: #ffffff;
  line-height: 15px;
  letter-spacing: 1px;
}

.good-ms {
  display: flex;
  box-sizing: border-box;
  padding: 20px 0 0 15px;
}
.good-ms dd {
  width: 70px;
  height: 70px;
}
.image-comm {
  width: 70px;
  height: 70px;
}
/deep/.image-comm img {
  object-fit: cover;
}
.good-ms dd img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
}
.good-ms dt {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.good-ms dt .good-name {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 16px;
}
.good-ms dt .price-x {
  margin-top: 11px;
  padding-bottom: 9px;
}
.good-ms dt .price-x .sale-price {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  text-decoration: line-through;
  color: #999999;
  line-height: 15px;
}
em,
i {
  font-style: normal;
}
.good-ms dt .price-x .purchase-price {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #F00000;
  line-height: 15px;
  margin-top: 9px;
}
.remain-num-x {
  margin-top: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 15px;
  letter-spacing: 1px;
}
.use-buy-x {
  box-sizing: border-box;
  color: #999999;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-left: 6px;
}
.advantor-x {
  display: flex;
}
.use-buy-x span {
  margin-left: 10px;
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  line-height: 15px;
}
.advantor-x img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
}
.advantor-x img:not(:nth-of-type(1)) {
  margin-left: 5px;
}
.buy-button-x {
  position: absolute;
  right: 15px;
  bottom: 21px;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 23px;
  background: linear-gradient(180deg, #ff7ba6 0%, #e9306d 100%);
  border-radius: 12px;
}
.no_goods{
  background:#999999
}
.buy-button-x img{
  width: 16px;
  height: 15px;
  display: block;
  margin-right: 6px;
}
.buy-button-x div{
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #F7F8F9;
  line-height: 16px;
}
.user-image {
  width: 22px;
  margin-left: 2px;
}
/deep/.user-image img {
  width: 22px;
  height: 22px;
  margin-left: 2px;
  border-radius: 50%;
}
/deep/.van-image__error {
  background-color: transparent;
}
/deep/.van-icon {
  font: initial;
}
</style>
