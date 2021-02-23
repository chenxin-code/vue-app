<template>
  <!-- // created by hjc 商品详情 -->
  <!-- https://blog.csdn.net/u014678583/article/details/103928102?utm_medium=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&dist_request_id=a48d2bc9-56c3-4cdf-96c9-e903fde58a76&depth_1-utm_source=distribute.pc_feed_404.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecas -->
  <div class="goods_detail">
    <div class="goods_swiper">
      <van-sticky>
        <van-icon
          name="arrow-left"
          class="arrow_left"
          color="#000000"
          size="0.471467rem"
          @click="$router.go(-1)"
        />
      </van-sticky>
      <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="item in 4" :key="item">
          <img
            class="goods_img"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202006%2F06%2F20200606192747_zmbbn.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615305439&t=6a054dde42a9b2bb717f30ee09686365"
            alt=""
          />
        </van-swipe-item>
      </van-swipe>
      <div class="goods_info_box">
        <div class="goods_info">
          <div class="goods_price">
            <div class="goods_price_detail">
              <div class="goods_price_title">团购价格：</div>
              <div class="unit">￥</div>
              <div class="price">{{resouce.groupbuyBuyerPrice}}</div>
              <div class="line_price">¥{{resouce.groupbuyLinePrice}}</div>
            </div>
            <div class="goods_count">
              <div>已抢{{resouce.groupbuyPurchaseNumber}}件</div>
              <div>剩余{{resouce.groupbuyStockNumber}}件</div>
            </div>
          </div>
          <div class="goods_time">
            <div class="goods_time_title">拼团剩余时间</div>
            <van-count-down :time="time">
              <template #default="timeData">
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
        </div>
      </div>
    </div>
    <div class="goods_detail_info">
      <div class="goods_item_detail">
        <div class="goods_name">{{resouce.groupbuySkuName}}</div>
        <div class="goods_other">
          <img
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202006%2F06%2F20200606192747_zmbbn.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615305439&t=6a054dde42a9b2bb717f30ee09686365"
            alt=""
            v-for="item in resouce.avatarList"
            :key="item"
          />
          <div class="goods_other_text">等{{resouce.purchasedQuantity >999 ? '999+':resouce.purchasedQuantity}}人购买了此商品</div>
        </div>
      </div>
      <div class="buy_btn" @click="$router.push('/confirmOrder')">立即购买</div>
    </div>
    <div class="activity">
      <div class="activity_title">活动</div>
      <div class="activity_detail">
        {{resouce.groupbuyRuleDescribe}}
        <!-- <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div>
        <div>春节也送货</div> -->
      </div>
    </div>
    <div class="goods_item_detail_info">
      <div class="goods_item_detail_info_title">商品详情</div>
      <img
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202006%2F06%2F20200606192747_zmbbn.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615305439&t=6a054dde42a9b2bb717f30ee09686365"
        alt=""
        v-for="item in 3"
        :key="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "orderList",
  props: {},
  data() {
    return {
      time: 2131231,
      resouce:null
    };
  },
  created() {
    this.resouce = this.$route.params.resouce;
  },
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
      padding: 8px 23.5px 8px 20.5px;
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

    img {
      width: 100%;
    }
  }
}
</style>

