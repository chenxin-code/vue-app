<template>
  <!-- // created by hjc 商品详情 -->
  <!-- https://blog.csdn.net/u014678583/article/details/103928102?utm_medium=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&dist_request_id=a48d2bc9-56c3-4cdf-96c9-e903fde58a76&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecas -->
  <div class="goods_detail">
    <div class="goods_swiper">
      <!-- <van-sticky> -->
      <van-icon
        name="arrow-left"
        class="arrow_left"
        color="#000000"
        size="0.471467rem"
        @click="$router.go(-1)"
      />
      <!-- </van-sticky> -->
      <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="item in resouce.groupbuySkuPicurl" :key="item">
          <img class="goods_img" :src="item" alt="" />
        </van-swipe-item>
      </van-swipe>
      <div class="goods_info_box">
        <div class="goods_info">
          <div class="goods_price">
            <div class="goods_price_detail">
              <div class="goods_price_title">团购价格：</div>
              <div class="unit">￥</div>
              <div class="price">{{ resouce.groupbuyBuyerPrice }}</div>
              <div class="line_price">¥{{ resouce.groupbuyLinePrice }}</div>
            </div>
            <div class="goods_count">
              <div>已抢{{ resouce.groupbuyPurchaseNumber }}件</div>
              <div>剩余{{ resouce.groupbuyStockNumber }}件</div>
            </div>
          </div>
          <div class="goods_time">
            <div class="goods_time_title">{{ getTimeTitle() }}</div>
            <Countdown :endTime="getCountdownTime()" color="blue"></Countdown>
          </div>
        </div>
      </div>
    </div>
    <div class="goods_detail_info">
      <div class="goods_item_detail">
        <div class="goods_name">{{ resouce.groupbuySkuName }}</div>
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
      <div class="buy_btn" @click="goConfirm()">立即购买</div>
    </div>
    <div class="activity">
      <div class="activity_title">活动</div>
      <div class="activity_detail">
        {{ resouce.groupbuyRuleDescribe }}
      </div>
    </div>
    <div class="goods_item_detail_info">
      <div class="goods_item_detail_info_title">商品详情</div>
      <div class="contnt-style" v-html="resouce.groupbuySkuDetail"></div>
    </div>
    <div class="customerService" @click="handleCustomer">
      <img :src="customerService" alt="">
    </div>
  </div>
</template>

<script>
import Countdown from "@/components/Vendor/countdown/purchaseTime.vue";
export default {
  name: "orderList",
  props: {},
  components:{
    Countdown
  },
  data() {
    return {
      time: 1614071248931,
      resouce: {},
      customerService:require('../../../../static/images/service.png'),
    };
  },
  created() {
    this.resouce = this.$store.state.CharseInfo;
    console.log([this.resouce.groupbuySkuPicurl])
  },
  methods: {
    // 唤起客服
    handleCustomer: function() {
      ysf('config', {
        uid: this.$store.state.userInfo.userId,
        name: this.$store.state.userInfo.nickName,
        email:'',
        mobile: this.$store.state.userInfo.phone,
        data: this.$store.state.userLable,
        success: function(){     // 成功回调
          ysf('open');
        },
        error: function(){       // 错误回调
          // handle error
        }
      })
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
        return "距离结束还剩:";
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
      this.$router.push({
        name: "确认订单",
        params: {
          resouce: this.resouce,
        },
      });
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
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #F6F6F6;
  overflow-y: auto;
  font-family: PingFangSC-Semibold, PingFang SC;
  letter-spacing: 1px;

  .customerService{
    position: fixed;
    width: 42px;
    height : 42px;
    right: 0;
    bottom: 112px;
    img{
      width 100%;
      height 100%;
    }
  }

  .goods_swiper {
    position: relative;
    width: 100%;
    height: 380px;

    .arrow_left {
      position: absolute;
      top: 14px;
      left: 11.5px;
      z-index: 2;
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
    position: absolute;
    bottom: 0;
    left: 0;

    .goods_info {
      width: 100%;
      height: 70px;
      background-image: url('./images/goods_background.png');
      background-repeat: no-repeat;
      background-size: 100% 70px;
      display: flex;
      justify-content: space-between;
      padding: 8px 10px 8px 20.5px;
      background-color: #fff;

      .goods_price {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .goods_price_detail {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          color: #C61606;
          font-weight: 600;

          .goods_price_title {
            font-size: 14px;
          }

          .unit {
            font-size: 12px;
          }

          .price {
            font-size: 24px;
          }

          .line_price {
            font-size: 12px;
            font-weight: 400;
            color: #DA5969;
            line-height: 16.5px;
            margin-left: 5px;
            text-decoration: line-through;
          }
        }

        .goods_count {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #DA5969;
          line-height: 16.5px;

          div:last-child {
            margin-left: 12px;
          }
        }
      }

      .goods_time {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 7px;

        .goods_time_title {
          font-size: 12px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 16.5px;
          margin-bottom: 5px;
          text-align :center;
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
    padding: 16px 20px 15px 20.5px;
    background-color: #fff;

    .goods_item_detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods_name {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        margin-bottom: 4px;
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
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    padding: 13px 20.5px 11px;
    background-color: #fff;

    .activity_title {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 18.5px;
      margin-right: 32px;
      white-space: nowrap;
    }

    .activity_detail {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;

      div {
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 18.5px;
        margin-right: 16px;
        white-space: nowrap;
        margin-bottom: 5px;
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
    margin-top: 10px;

    .goods_item_detail_info_title {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 18.5px;
      margin-bottom: 12.5px;
    }

    /deep/.contnt-style{
      img{
        width: 100%;
      }
    }
    img {
      width: 100%;
    }
  }
}
</style>
