<!--
 * @Description: 这是账单详情页面
 * @Date: 2021-06-12 23:32:07
 * @Author: shuimei
 * @LastEditTime: 2021-07-19 11:34:25
-->
<template>
  <div class="bill-center-detail">
    <van-sticky :offset-top="offsetTop">
      <nav-top leftTitle="账单详情" @backEvent="backEvent"></nav-top>
    </van-sticky>
    <div class="content">
      <div class="total">
        <div class="name">物业缴费</div>
        <div class="money">
          <span class="syb">￥</span>
          <span class="num">{{ query.payableAmount }}</span>
        </div>
        <div class="status">待支付</div>
      </div>
      <div class="detail-box">
        <div class="item">
          <!-- <div class="item-hd">
            <div class="title">支付方式</div>
            <div class="result">微信</div>
          </div> -->
          <div class="item-hd">
            <div class="title">创建时间</div>
            <div class="result">
              {{ query.businessCreateTime | filterDate() }}
            </div>
          </div>
          <div class="item-hd">
            <div class="title">交易单号</div>
            <div class="result">{{ query.tradeMerCstNo }}</div>
          </div>
          <div class="item-hd">
            <div class="title">商户单号</div>
            <div class="result merchant">
              {{ query.platMerCstNo }}
            </div>
          </div>
        </div>
        <div class="item border">
          <!-- <div class="item-hd">
            <div class="title">实付金额</div>
            <div class="result">{{ query.realAmount }}</div>
          </div> -->
          <div class="item-hd">
            <div class="title">收费周期</div>
            <div class="result">
              {{ query.recStartTime | filterDateCycle(query.recEndTime) }}
            </div>
          </div>
          <div class="item-hd">
            <div class="title">商品说明</div>
            <div class="result">{{ query.showInfo }}</div>
          </div>
          <div class="item-hd">
            <div class="title">缴纳月份</div>
            <div class="result">
              {{ query.chargeYear }}
            </div>
          </div>
          <!-- <div class="item-hd">
            <div class="title">楼盘小区</div>
            <div class="result">时代外滩</div>
          </div>
          <div class="item-hd">
            <div class="title">房屋楼栋</div>
            <div class="result">3座</div>
          </div>
          <div class="item-hd">
            <div class="title">单元号</div>
            <div class="result unit">00</div>
          </div>
          <div class="item-hd">
            <div class="title">门牌房号</div>
            <div class="result">2104</div>
          </div> -->
          <div class="item-hd">
            <div class="title">房号</div>
            <div class="result buildings">{{ query.buildings }}</div>
          </div>
          <div class="item-hd">
            <div class="title">业主姓名</div>
            <div class="result">{{ query.proprietorName }}</div>
          </div>
          <div class="item-hd">
            <div class="title">收款员</div>
            <div class="result saler">无</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import appNav from "@zkty-team/x-engine-module-nav";
import _ from "lodash";
import moment from "moment";
export default {
  data() {
    return {
      offsetTop: "0rem",
      query: this.$route.query || {}
    };
  },
  filters: {
    filterDate(val) {
      return moment(parseInt(val)).format("YYYY-MM-DD HH:mm:ss");
    },
    filterDateCycle(start, end) {
      if (start && end) {
        return (
          moment(start).format("YYYY-MM-DD") +
          " 至 " +
          moment(end).format("YYYY-MM-DD")
        );
      } else {
        return "";
      }
    }
  },
  mounted() {
    // appNav.setNavLeftBtn({
    //   title: "账单详情",
    //   titleColor: "#333333",
    //   titleSize: 17,
    //   titleFontName: "PingFangSC-Medium",
    //   titleBig: "500"
    // });
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
$color = #E5165A;
.bill-center-detail {
  height: 100%;
  background-color: #F9F9F9 !important;
  overflow: auto;
  /deep/.nav-top {
    .navcontent{
      .title-div {
        text-align: left !important;
      }
    }

  }
  .content {
    padding: 16px 11px 34px 11px;
    margin-top: 65px;
    .total {
      background-color: #FFFFFF;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
      padding: 25px 0;
      text-align: center;
      .name {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #121212;
        line-height: 22px;
        margin-bottom: 16px;
      }
      .money {
        margin-bottom: 11px;
        .syb {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #121212;
          line-height: 28px;
        }
        .num {
          font-size: 36px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 600;
          color: #121212;
          line-height: 28px;
        }
      }
      .status {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $color;
        line-height: 22px;
      }
    }
    .detail-box {
      background: #FFFFFF;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
      margin-top: 16px;
      .item {
        padding: 25px 26px;
        &.border {
          border-top: 2px dashed #F1F1F1;
        }
        .item-hd {
          display: flex;
        }
        .title {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 30px;
          width: 30%;
        }
        .result {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #121212;
          line-height: 30px;
          // margin-left: 29px;
          width: 70%;
          word-wrap: break-word;
          word-break: normal;
          &.merchant {
            line-height: 22px;
            margin-top: 7px;
          }
          &.saler,
          &.unit{
            // margin-left: 43px;
          }
          &.buildings {
            line-height: 22px;
            // margin-left: 56px;
            margin-top: 4px;
          }
        }

      }
    }
  }

}
</style>
