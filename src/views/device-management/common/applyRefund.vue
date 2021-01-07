
<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="container" v-if="showDetail">
      <div class="row">
        <div class="row-top" style="color: #666">
          <span class="row-top-left">
            <span class="row-top-left-tel" >设备编号: {{item.utilityAccount}}</span>
          </span>
        </div>
        <div class="row-content">
          <div class="contentLift">
            <div class="leftImg">
              <img :src="item.orderExtendData.picUrl">
            </div>
            <div class="leftText">
              <span class="titer">{{item.skuNames}}</span>
              <span style="color: #666">{{item.storeName}}</span>
            </div>
          </div>
          <div class="contentRight">
            <span>{{item.rechargeNo}}分钟</span>
           </div>
        </div>
        <div class="row-bottom">
          <div></div>
          <div class="bottom-btn">
            <span>实付金额:</span>
            <span class="theme_standard_font">{{item.orderExtendData.amount}} {{getDictByAliasText(item.orderExtendData.priceMode)}}</span>
          </div>
        </div>
      </div>
      <div class="explain">
        <div class="box-text">
          <van-cell-group>
            <van-field type="textarea" :readonly="item.refundReason ? true:false" v-model="reason" placeholder="请输入退款原因" maxlength="50" autosize rows="3" show-word-limit/>
          </van-cell-group>
        </div>
      </div>
    </nav-content>
    <div class="btm-btn">
      <div v-if="item.refundReason" class="tab refundReason">已提交</div>
      <div v-else class="tab" @click="applyRefund">提交申请</div>
    </div>
  </div>
</template>
<script>
import mixin from "../mixin";
import payHelper from '@/utils/payHelper'
import icon from '../images/icon-积分.png'
import Coupon from '@/components/mall2/common/coupon'
export default {
  name: "payment",
  mixins: [mixin],
  data() {
    return {
      item: {
        orderExtendData: {}
      },
      reason: '',
      showDetail: false
    };
  },

  created() {
    this.item  = JSON.parse(this.$route.query.item) || {}
    console.log(this.item)
    if (this.item.refundReason) {
      this.reason = this.item.refundReason
    }
    this.showDetail = true
  },
  mounted() {},
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    getInteger: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0]
    },
    getDecimals: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1]
    },
    applyRefund() {
      if (this.reason) {
        this.$request.post('/app/json/app_self_washer_order/applyRefund',{orderType: this.item.orderType, orderId: this.item.id, reason: this.reason}).then(res => {
          if (res.status == 0) {
            this.$Toast('申请成功！');
            this.$router.go(-1);
            // this.$router.replace({
            //   path: '/device_management/home',
            //   query: {
            //     psySuccess: true
            //   }
            // });
          } else {
            this.$Toast(res.info);
          }
        })
      } else {
        this.$Toast('请输入退款原因');
      }
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl'
.container {
  background-color #f6f6f6
  position: relative;
  width: 100%;
  height: calc(100% - 110px);
  padding 10px
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .row {
    padding: 0 10px;
    margin-bottom 10px
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
        i {
          font-style normal
          &:first-child {
            font-size 12px
          }
        }
      }
    }

    .row-content {
      padding 10px 0
      height 90px
      width 100%
      border-top: 1px solid #f1eded;
      border-bottom: 1px solid #f1eded;
      display flex
      align-items center
      justify-content space-between
      .contentLift {
        width: calc(100% - 80px);
        height 100%
        display flex
        align-items center
        .leftImg {
          width 70px
          height 100%
          img {
            width 100%
            height 100%
          }
        }
        .leftText {
          padding 8px 10px
          width: calc(100% - 70px);
          height 100%
          display flex
          flex-direction column
          justify-content space-between
          .titer {
            font-size 14px;
            font-weight 500
          }
          span {
            width 100%
            display block
            text-overflow:ellipsis
            white-space: nowrap
            overflow: hidden;
          }
        }
      }
      .contentRight {
        width 80px
        height 100%
        display flex
        justify-content center
        align-items center
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
  .explain {
    margin-top 10px
    padding 10px
    background-color #fff
    .box-text {
      width: 100%;
      height 100%
      margin-top 8px
      border-radius: 6px;
      p {
        text-align: right;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
}
  .btm-btn {
    position fixed;
    left 0;
    right 0;
    bottom 0;
    height: 50px;
    color #fff
    font-size: 16px;
    font-weight 600
    display flex;
    justify-content center
    align-items center
    .tab {
      flex 1
      height 100%
      display flex;
      align-items center
      justify-content center
      background-color #0e80ff
    }
    .refundReason {
      background-color #80bbfa
    }
  }
</style>
