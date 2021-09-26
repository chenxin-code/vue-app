<template>
  <!-- // created by hjc 商品详情 -->
  <!-- https://blog.csdn.net/u014678583/article/details/103928102?utm_medium=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&dist_request_id=a48d2bc9-56c3-4cdf-96c9-e903fde58a76&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecas -->
  <div class="goods_detail">
    <div class="goods_swiper">
      <!-- <van-sticky> -->
      <!-- <van-icon
        name="arrow-left"
        class="arrow_left"
        color="#000000"
        size="0.471467rem"
        @click="$router.go(-1)"
      /> -->
      <!-- </van-sticky> -->
      <div class="backIcon" @click="$router.go(-1)">
        <img src="./images/button_back_default.png" alt="" />
      </div>
      <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="item in resouce.groupbuySkuPicurl" :key="item">
          <img class="goods_img" :src="item" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="goods_info_box">
      <div class="goods_info">
        <div class="goods_price">
          <div class="goods_price_detail">
            <div class="unit">￥</div>
            <div class="price">{{ resouce.groupbuyBuyerPrice }}</div>
            <div class="line_price">¥{{ resouce.groupbuyLinePrice }}</div>
          </div>
          <!-- <div class="goods_count">
            <div>已抢{{ resouce.groupbuyPurchaseNumber }}件</div>
            <div>剩余{{ resouce.groupbuyStockNumber }}件</div>
          </div> -->
        </div>
        <div class="goods_time">
          <div class="goods_time_title">{{ getTimeTitle() }}</div>
          <Countdown
            :endTime="getCountdownTime()"
            :isShowEndText="false"
            type="detail"
          ></Countdown>
        </div>
      </div>
    </div>
    <div class="goods_detail_info">
      <div class="goods_item_detail">
        <div class="goods_name">{{resouce.groupbuySkuName}}</div>
        <!-- 剩余{{ resouce.groupbuyStockNumber }}件 -->
        <div class="goods_count">
          已抢{{ resouce.groupbuyPurchaseNumber }}件
        </div>
        <!-- <div class="goods_other">
          <img
            :src="item"
            alt=""
            v-for="item in resouce.avatarList"
            :key="item"
          />
          <div class="goods_other_text">
            等{{
              resouce.purchasedQuantity > 999
                ? "999+"
                : resouce.purchasedQuantity
            }}人购买了此商品
          </div>
        </div> -->
      </div>
      <!-- <div class="buy_btn" @click="goConfirm()">立即购买</div> -->
    </div>
    <div class="activity">
      <div class="activity_title">
        <div class="point"></div>
        活动说明
      </div>
      <div class="activity_detail">
        {{ resouce.groupbuyRuleDescribe }}
      </div>
    </div>
    <div class="line"></div>
    <div class="goods_item_detail_info">
      <div class="goods_item_detail_info_title">
        <div class="point"></div>
        商品详情
      </div>
      <div class="contnt-style" v-html="resouce.groupbuySkuDetail"></div>
    </div>
    <div class="customerService" @click="handleCustomer">
      <img :src="customerService" alt="">
    </div>
    <div class="pay_btn">
      <div
        class="pay"
        @click="goConfirm()"
        :style="{
          background:
            getTimeTitle() == '活动已结束' || resouce.groupbuyStockNumber == 0
              ? '#ffa5c3'
              : 'linear-gradient(180deg, #FF7BA6 0%, #E9306D 100%)',
        }"
      >
        立即购买
      </div>
    </div>
  </div>
</template>

<script>
import Countdown from "@/components/Vendor/countdown/purchaseTime.vue";
export default {
  name: "orderList",
  props: {},
  components: {
    Countdown,
  },
  data() {
    return {
      time: 1614071248931,
      resouce: {},
      customerService: require("../../../../static/images/service.png"),
    };
  },
  created() {
    this.resouce = this.$store.state.CharseInfo;
    console.log("this.resouce", this.resouce);
  },
  methods: {
    // 唤起客服
    handleCustomer: function () {
      const that = this;
      console.log('-------resouce----->', that.resouce)
      ysf("config", {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email: "",
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function () {
          // 成功回调
          // ysf("open");
          ysf("product", {
            show: 1,
            title: that.resouce.groupbuySkuName,
            desc: `价格：${that.resouce.groupbuyBuyerPrice}`,
            picture: that.resouce.groupbuySkuPicurl[0],
            //   url: "跳转链接",
            success: function() {
              // 成功回调
              ysf("open");
            },
            error: function() {}
          });
        },
        error: function () {
          // 错误回调
          // handle error
        },
      });
    },
    getTimeTitle: function () {
      let nowT = this.$store.state.severTime.currentTime;
      // let startT = this.$util.getDateFromString(
      //   this.resouce.groupbuyEndDatetime
      // );
      // if (nowT < startT) {
      //   return "距离开始还剩:";
      // }
      let endT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime);
      if (nowT < endT) {
        return "拼团剩余时间:";
      }
      return "活动已结束";
    },
    getCountdownTime: function () {
      let nowT = this.$store.state.severTime.currentTime;
      // let startT = this.$util.getDateFromString(
      //   this.resouce.groupbuyEndDatetime
      // );
      // if (nowT < startT) {
      //   return startT;
      // }
      let endT = this.$util.getDateFromString(this.resouce.groupbuyEndDatetime);
      if (nowT < endT) {
        return endT;
      }
      return endT;
    },
    goConfirm() {
      if(this.getTimeTitle() == '活动已结束' || this.resouce.groupbuyStockNumber == 0){
        return
      }
      if (this.$route.query.isWxShare) {
        console.log("跳转go-1", window.location.href);
        this.$router.go(-1);
        return;
      } else {
        console.log("确认订单", window.location.href);
        if (this.resouce.groupbuyStockNumber !== 0) {
          this.$router.push({
            name: "确认订单",
            params: {
              resouce: this.resouce,
            },
          });
        } else {
          this.$toast("该商品没有库存啦~请选择其他商品购买吧~");
        }
      }
    },
  },
  // activated 当keepalive包含的组件再次渲染的时候触发
  // deactived 当keepalive包含的组件销毁的时候触发
  activated() {},
  deactivated() {},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.router_class {
  background-color: #F6F6F6 !important;
}

.goods_detail {
  width: 100%;
  height: 100%;
  background-color: #F6F6F6;
  overflow-y: auto;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;

  .customerService {
    position: fixed;
    width: 42px;
    height: 42px;
    right: 0;
    bottom: 112px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .goods_swiper {
    position: relative;
    width: 100%;
    height: 380px;

    .backIcon {
      position: absolute;
      top: 14px;
      left: 11.5px;
      z-index: 2;
      width: 75px;
      height: 44px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;

      img {
        width: 9px;
        height: 16px;
      }
    }
  }

  .van-swipe-item {
    height: 380px;

    .goods_img {
      width: 100%;
      height: 380px;
    }
  }

  .goods_info_box {
    width: 100%;
    background-color: #fff;

    .goods_info {
      width: 100%;
      height: 70px;
      background-image: url('./images/goods_background.png');
      background-repeat: no-repeat;
      background-size: 100% 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 14px 8px 17px;
      background-color: #fff;

      .goods_price {
        display: flex;
        // flex-direction: column;
        justify-content: center;

        .goods_price_detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #C61606;
          font-weight: 600;

          .goods_price_title {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 16px;
          }

          .unit {
            font-size: 17px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 16px;
          }

          .price {
            font-size: 25px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            // line-height: 29px;
          }

          .line_price {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            text-decoration: line-through;
            color: #FFFFFF;
            line-height: 29px;
            margin-left: 11px;
            margin-top :8px;
          }
        }

        .goods_count {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #EE1636;
          line-height: 16.5px;

          div:last-child {
            margin-left: 12px;
          }
        }
      }

      .goods_time {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .goods_time_title {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 16px;
          text-align: center;
          margin-bottom:5px;
        }

        .block {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border-radius: 2px;
          text-align: center;
          line-height: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #B52232;
        }

        .colon {
          color: #FFFFFF;
        }
      }
    }
  }

  .goods_detail_info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 17px;
    background-color: #fff;

    .goods_item_detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods_name {
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 26px;
        letter-spacing:0px;
      }

      .goods_count {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #EE1636;
        line-height: 16px;
        margin-top: 9px;
      }

      .goods_other {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 4px;
        }

        .goods_other_text {
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          line-height: 15px;
        }
      }
    }

    .buy_btn {
      width: 90px;
      height: 32px;
      background: #C61606;
      border-radius: 17.5px;
      text-align: center;
      line-height: 32px;
      font-size: 15px;
      font-weight: 400;
      color: #FFFFFF;
      margin-top: 8px;
    }
  }

  .activity {
    width: 100%;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 14px 17px 17px;
    background-color: #fff;

    .activity_title {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 18.5px;
      margin-bottom: 11px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .point {
        width: 4px;
        height: 4px;
        background: #FE4886;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    .activity_detail {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;

      div {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
      }

      div:first-child {
        color: #C61606;
      }
    }
  }

  .goods_item_detail_info {
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 13px 20px;
    border-top: 1px solid #F5F5F5;
    margin-bottom: 94px;

    .goods_item_detail_info_title {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 18.5px;
      margin-bottom: 21px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .point {
        width: 4px;
        height: 4px;
        background: #FE4886;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    /deep/.contnt-style {
      img {
        width: 100%;
      }
    }

    img {
      width: 100%;
    }
  }

  .pay_btn {
    width: 100%;
    background: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 15px 25px 30px;
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.15);

    .pay {
      width: 86%;
      height: 49px;
      background: linear-gradient(180deg, #FF7BA6 0%, #E9306D 100%);
      border-radius: 23px;
      text-align: center;
      line-height: 49px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      margin: 0 auto;
    }
  }
}
</style>
