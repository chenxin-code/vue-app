<template>
  <div class="body">
    <nav-top @backEvent="backEvent" title="订单管理"></nav-top>
    <nav-content>
      <div class="main">
        <div class="screen">
          <div
            v-for="(screenItem,screenIndex) in screenArr"
            :key="screenIndex"
            class="btn"
            :class="{theme_standard_font_i: rewardState == screenItem.type}"
            @click="screenBtn(screenItem)"
          >{{`${screenItem.name}（${screenItem.number}）`}}</div>
        </div>
        <div class="list">
          <div class="row" v-for="(item,index) in array" :key="index">
            <div class="row-top">
              <span class="row-top-left">
                <!-- <img src="static/image/microShop/head@2x.png" alt> -->
                <img :src="$store.state.globalConfig.microshop_headurl" alt="">
                <span
                  v-if="item.mobile"
                  class="row-top-left-tel"
                >{{item.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}}</span>
              </span>
              <span class="theme_standard_font_i row-top-right">
                {{status(item.state)}}{{item.rewardState ==1 && item.state==9 ? '：':''}}
                <countdown
                  v-if="item.rewardState ==1 && item.state==9"
                  :endTime="item.predictDate"
                  type="theme_standard_bg"
                />
              </span>
            </div>
            <div class="row-time">
              <span>{{item.submitTime}}</span>
              <span>
                <span class="tuan theme_light_bg theme_standard_bdr_i theme_standard_font_i" v-if="item.groupBuy==1">团</span>
                <span>订单号：{{item.orderCode}}</span>
              </span>
            </div>
            <div class="row-content">
              <!-- v-for="(res,resIndex) in item.distributionOrderItems"
              :key="resIndex"-->
              <div class="row-content-left">
                <img v-lazy="item.picMainUrl">
              </div>
              <div class="row-content-right">
                <div class="row-content-right-top">{{item.skuName}}</div>
                <div class="row-content-right-bottom">
                  <span>商品规格:{{item.specs}}</span>
                  <span>¥{{item.salePrice}}</span>
                  <span>x{{item.number}}</span>
                </div>
              </div>
            </div>
            <div class="row-bottom">
              <span>总计：¥{{item.payAmount}}</span>
              <span>返点：{{item.rewardType == 0 ? '¥':''}}{{item.rebate || 0.00}} {{text(item.rewardType)}}</span>
              <!-- <span v-if="item.moneyValue" class="theme_standard_font_i">收益：¥{{item.moneyValue}}</span>
              <span v-if="item.moneyValue" class="theme_standard_font_i">收益：¥{{item.integralValue}}</span>
              <span v-if="item.moneyValue" class="theme_standard_font_i">收益：¥{{item.oilValue}}</span>
              <span v-if="item.moneyValue" class="theme_standard_font_i">收益：¥{{item.peasValue}}</span> -->
            </div>
          </div>
          <div class="no-data theme_font_tint" v-if="array.length && !hasMore">没有更多数据了~</div>
          <div class="no-list" v-if="!array.length">
            <div class="img-div">
              <img src="static/image/mall2/no-data-img.png">
            </div>
            <div class="tip theme_font_gray">抱歉没有找到相应订单~</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Countdown from "@/components/Vendor/countdown/countdown";
export default {
  name: "order-management",
  components: {
    Countdown
  },
  computed: {
    ...mapGetters(["getPutaggregate"])
  },
  data() {
    return {
      array: [],
      loading: false,
      hasMore: true,
      rewardState: "1",
      screenArr: [
        { name: "待奖励", number: "0", type: 1 },
        { name: "已奖励", number: "0", type: 2 },
        { name: "未奖励", number: "0", type: 0 }
      ],
      params: {
        page: 1,
        rows: 20,
        distributionUserId: "", // 分销员工id
        rewardState: "1", // 奖励状态 0:未奖励 1:待奖励 2:已奖励
        orderCode: "" // 订单号
      }
    };
  },
  mounted() {
    this.params.distributionUserId = this.getPutaggregate.userId;
    this._loadProList();
  },
  methods: {
    text(rewardType) {
      console.log("rewardType", rewardType);
      // 3 积分 8 油滴 9 豌豆 12 元
      let text = ''
      if(rewardType == 3){
      text = '积分'
      }else if(rewardType == 8){
      text = '油滴'
      }else if(rewardType == 9){
      text = '豌豆'
      }else if(rewardType == 0){
      text = '元'
      }
      return text;
    },
    backEvent() {
      this.$router.go(-1);
    },
    screenBtn(item) {
      this.array = [];
      this.params.page = 0;
      this.rewardState = item.type;
      this.params.rewardState = item.type;
      this._loadProList();
    },
    _loadProList() {
      // 获取商品列表
      this.$Loading.open();
      this.loading = true;
      this.params.page++;
      this.$http
        .post(
          "/app/json/app_distribution_order/getDistributionOrders",
          this.params
        )
        .then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            var data = res.data.data || {};
            this.array = [...this.array.concat(data.distributionOrderItems || [])]
            this.$set(this.screenArr[1], "number", data.rewardedNums);
            this.$set(this.screenArr[2], "number", data.noRewardNums);
            this.$set(this.screenArr[0], "number", data.waitRewardNums);

            if (this.array.length < res.data.totalRecords) {
              this.loading = false;
            } else {
              this.hasMore = false;
            }
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    status(state) {
      let text = "";
      switch (state) {
        case 1:
          text = "未支付";
          break;
        case 2:
          text = "支付中";
          break;
        case 3:
          text = "已支付";
          break;
        case 4:
          text = "待收货";
          break;
        case 5:
          text = "已收货";
          break;
        case 6:
          text = "拒收";
          break;
        case 7:
          text = "已取消";
          break;
        case 8:
          text = "已失效";
          break;
        case 9:
          text = "已完成";
          break;
        case 10:
          text = "退款中";
          break;
        case 11:
          text = "已退款";
          break;
        case 12:
          text = "支付后取消";
          break;
        case 13:
          text = "已拆单";
          break;
        case 14:
          text = "退货中";
          break;
        case 15:
          text = "退货确认";
          break;
        case 16:
          text = "待发货";
          break;
        case 17:
          text = "待备货";
          break;
        case 18:
          text = "已备货";
          break;
        case 19:
          text = "备货失败";
          break;
      }
      return text;
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.body {
  width: 100%;
  height: 100%;

  .main {
    height: 100%;
    background: url('../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;
    box-shadow 0px -2px 2px #efefef
    border-radius 10px
    margin-top 8px

    .screen {
      display: flex;
      justify-content: space-between;
      padding: 10px 24px;
      font-size: 12px;
      font-weight: 500;
    }

    .list {
      height: 95%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .row {
        padding: 10px;
        margin: 6px;
        background-color: #fff;

        .row-top {
          height: 40px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .row-top-left {
            display: flex;
            align-items: center;

            .row-top-left-tel {
              margin-left: 4px;
            }

            img {
              width: 26px;
            }
          }

          .row-top-right {
            display: flex;
            align-items: center;
          }
        }

        .row-time {
          color: #908d8d;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .tuan {
            padding: 2px 4px;
            border-radius: 6px;
            border: 0.6px solid transparent;
          }
        }

        .row-content {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1eded;

          .row-content-left {
            height: 100%;
            width: 100px;
            padding: 10px;

            img {
              height: 100%;
              width: 100px;
              border-radius: 6px;
            }
          }

          .row-content-right {
            margin-left: 24px;
            padding: 20px 0;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .row-content-right-top {
              line-height: 20px;
              font-size: 14px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .row-content-right-bottom {
              color: #908d8d;
              padding-right: 6px;
              padding-bottom: 10px;
              display: flex;
              justify-content: space-between;
            }
          }
        }

        .row-bottom {
          height: 40px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .no-list {
        .img-div {
          margin-top: 20px;
          text-align: center;

          img {
            width: 160px;
          }
        }

        .tip {
          margin-top: 10px;
          padding: 10px;
          font-size: 12px;
          text-align: center;
        }
      }

      .no-data {
        padding: 15px;
        text-align: center;
      }
    }
  }
}
</style>
