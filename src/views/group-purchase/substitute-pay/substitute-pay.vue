<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <!-- 顶部背景 -->
      <div class="top-content">
        <img src="../../../components/mall2/ranking/images/Leaderboard-bg.png" alt="" class="top-bg">
        <p class="top-text">{{ remarks }}</p>
      </div>
      <!-- 商品信息 -->
      <div
        class="public-block prod-info"
        v-for="(item, index) in payOrderInfo.itemAbstracts"
        :key="index">
        <img :src="item.phPictureUrl" alt="" class="prod-img">
        <div class="right">
          <p class="prod-name">{{ item.skuName }}</p>
          <p class="prod-price">
            <span class="price">￥<i>{{ dealWithPrice(item.realPrice)[0] }}</i>.{{ dealWithPrice(item.salePrice)[1] }}</span>
            <span class="count">x{{ item.number }}</span>
          </p>
        </div>
      </div>
      <!-- 运费模板 -->
      <div class="public-block freight-template">
        <div class="item">
          <p class="name">商品金额</p>
          <p class="price">￥{{ dealWithPrice(payOrderInfo.payAmount - payOrderInfo.freightAmount)[2] }}</p>
        </div>
        <div class="item">
          <p class="name">运费</p>
          <p class="price red">+￥{{ dealWithPrice(payOrderInfo.freightAmount)[2] }}</p>
        </div>
        <div class="item">
          <p class="name"></p>
          <p class="price red"><span class="spec-name">共{{ payOrderInfo.itemAbstracts.length }}种商品实付款：</span>+￥{{ dealWithPrice(payOrderInfo.payAmount)[2] }}</p>
        </div>
      </div>
      <!-- 代付记录-多人代付显示 -->
      <div class="public-block pay-recording" v-if="$route.query.payType == 1 && payOrderInfo.payOrderDetailModels.length > 0">
        <p class="title">代付记录</p>
        <ul class="payment-history">
          <li class="item" v-for="(item, index) in payOrderInfo.payOrderDetailModels" :key="index">
            <p class="personal-name">{{ item.userName }}</p>
            <p class="time">{{ item.payTime }}</p>
            <p class="num">￥{{ dealWithPrice(item.payAmount)[2] }}</p>
          </li>
        </ul>
        <div class="payment-progress">
          <p class="pay-text">已付款：￥{{ dealWithPrice(payOrderInfo.paidAmount)[2] }}</p>
          <p class="pay-text">剩余待付：<span class="red">￥{{ dealWithPrice(payOrderInfo.unPaidAmount)[2] }}</span></p>
        </div>
        <div class="progress">
          <p class="pro-title">代付进度</p>
          <div class="progress-bar">
            <span class="progress-portion" :style="{width: dealPaySchedule() + '%'}"></span>
          </div>
        </div>
      </div>
      <!-- 添加留言 -->
      <div class="public-block add-message" v-if="!isShareOpen">
        <p class="title">添加留言</p>
        <van-field v-model="remarks" placeholder="请填写留言信息" class="message-input" type="textarea"/>
      </div>
    </nav-content>
    <div class="bottom-btn" v-if="isShareOpen">
      <div class="btn" v-if="payOrderInfo.state == 2" @click="helpToPay">帮他付款</div>
      <div class="btn gray" v-if="payOrderInfo.state == 3">已有好友帮他完成付款</div>
      <div class="btn gray" v-if="payOrderInfo.state == 7">订单已取消</div>
    </div>
    <div class="bottom-btn" v-else>
      <div class="btn yellow" v-if="$route.query.payType == 1" @click="openPayModal">我先付点</div>
      <div class="btn" @click="openShareModal">喊朋友来帮忙</div>
    </div>
    <!-- 选择分享途径弹窗 -->
    <pop-view
      v-if="isShowShareModal"
      @closeEvent="isShowShareModal = false"
      :popHeight="190"
      class="chose-share-pop">
      <p class="title">找好友帮忙</p>
      <div class="share-btn-c">
        <div class="item" @click="shareToWechat">
          <img src="../images/icon-weixin.png" alt="" class="icon"/>
          <p class="text">微信好友</p>
        </div>
      </div>
      <span class="cancel-btn" @click="isShowShareModal = false">取消</span>
    </pop-view>
    <!-- 选择分享途径弹窗end -->
    <PayModal v-model="isShowPayModal" @amountConfirm="getPayAmount" :orderInfo="orderInfo"></PayModal>
    <van-popup v-model="shareView" class="state-box">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>
<script>
import PayModal from './components/pay-modal'
import Config from '@/api/config'
import wxfunc from '@/utils/wxfunc'

export default {
  components: {
    PayModal,
  },
  data() {
    return {
      remarks: '特别喜欢你英姿飒爽的样子，帅帅哒~',
      isShowShareModal: false,
      isShowPayModal: false,
      // 订单状态 state 2 支付中 3 已完成 7 已取消
      payOrderInfo: {
        itemAbstracts: [],
        payOrderDetailModels: []
      },
      orderInfo: {},

      isShareOpen: 0, // 是否付款方打开页面
      payAmount: 0, // 代付人付款金额-单人为订单金额，多人为手动设置金额
      shareView: false,
    }
  },
  mounted() {
    this.initPayOrderInfo();
    this.isShareOpen = this.$route.query.isShareOpen || 0;
  },
  methods: {
    // 获取支付信息
    initPayOrderInfo() {
      this.$Loading.open();
      this.$http.post('/app/json/app_replace_pay_order/queryReplacePayOrderInfo', {
        idCode: this.$route.query.payInfo
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          if (data.data.remark) {
            this.remarks = data.data.remark;
          }
          this.payOrderInfo = data.data || {};
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`initPayOrderInfo err ${err}`);
        this.$Loading.close();
      })
    },
    // 计算付款进度
    dealPaySchedule() {
      return (this.payOrderInfo.paidAmount / this.payOrderInfo.payAmount) * 100;
    },
    openShareModal() {
      if (this.$store.state.webtype !== 3) {
        this.saveRemark();
        // 小程序分享
        console.log('小程序分享信息', {
          title: '好友的代付求助',
          path: `${Config.shareUrl}/substitute_pay?payInfo=${this.$route.query.payInfo}&isShareOpen=1&payType=${this.$route.query.payType}`,
          imageUrl: this.payOrderInfo.itemAbstracts[0].phPictureUrl,
        })
        wxfunc.wxmpShare({
          title: '好友的代付求助',
          path: `${Config.shareUrl}/substitute_pay?payInfo=${this.$route.query.payInfo}&isShareOpen=1&payType=${this.$route.query.payType}`,
          imageUrl: this.payOrderInfo.itemAbstracts[0].phPictureUrl,
        })
        this.shareView = true
      } else {
        this.isShowShareModal = true
      }
    },
    // 分享
    shareToWechat() {
      // app分享
      this.saveRemark();
      console.log('app分享信息', {
        title: '好友的代付求助',
        sharetext: this.payOrderInfo.itemAbstracts[0].skuName,
        imageurl: this.payOrderInfo.itemAbstracts[0].phPictureUrl,
        detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/substitute_pay?payInfo=${this.$route.query.payInfo}&isShareOpen=1&payType=${this.$route.query.payType}`
      })
      this.$bridgefunc.wechatShare({
        title: '好友的代付求助',
        sharetext: this.payOrderInfo.itemAbstracts[0].skuName,
        imageurl: this.payOrderInfo.itemAbstracts[0].phPictureUrl,
        detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/substitute_pay?payInfo=${this.$route.query.payInfo}&isShareOpen=1&payType=${this.$route.query.payType}`
      })
    },
    // 支付金额输入完成
    getPayAmount(amount) {
      this.payAmount = amount;
      this.isShowPayModal = false;
      this.toPay();
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
    helpToPay() {
      if (this.$route.query.payType == 0) { // 单人
        this.toPay();
      } else { // 多人
        this.openPayModal(); 
      }
    },
    // 代付人去付款
    toPay() {
      if (this.$route.query.payType == 0) { // 单人
        this.payAmount = this.payOrderInfo.payAmount
      }
      this.$router.push({
        path: '/mall2/checkstand',
        query: {
          isSubstitutePay: 1,
          occurOuCode: this.payOrderInfo.ouCode,
          payInfo: JSON.stringify({
            tradeNo: this.payOrderInfo.mainTradeNo,
            orderType: this.payOrderInfo.orderType,
            orderId: this.payOrderInfo.id,
            payAmount: this.payAmount,
          })
        }
      })
    },
    openPayModal() {
      this.isShowPayModal = true;
      this.orderInfo = {
        payAmount: this.payOrderInfo.payAmount,
        unPaidAmount: this.payOrderInfo.unPaidAmount,
      }
    },
    // 存储留言
    saveRemark() {
      this.$http.post('/app/json/app_replace_pay_order/updateRemark', {
        idCode: this.$route.query.payInfo,
        remark: this.remarks
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          console.log(data)
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`updateRemark err ${err}`);
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
/deep/ .state-box {
  z-index: 2001;
  width: 80%;
  background-color: transparent;
  color #fff;
  font-size 16px;
  text-align center;
  top 200px;
  img {
    width 80px;
    margin 0 0 15px 160px;
  }
}
.container {
  overflow-y auto;
  padding-bottom 55px;
  .public-block {
    box-shadow 0 0 5px #ddd;
    border-radius 5px;
    padding 10px;
    margin 10px 10px 0;
  }
  .top-content {
    position relative;
    .top-bg {
      display block;
      width 100%;
    }
    .top-text {
      position absolute;
      left 0
      right 0;
      top 50%;
      transform translateY(-50%);
      text-align center;
      color #fff;
      font-size 14px;
      line-height 18px;
    }
  }
  .prod-info {
    display flex;
    .prod-img {
      display block;
      width 80px;
      height 90px;
      border 1px dashed #ccc;
      border-radius 4px;
    }
    .right {
      flex 1;
      padding-left 15px;
      display flex;
      flex-direction column;
      justify-content space-around
      .prod-name {
        font-size 15px;
        line-height 18px;
      }
      .prod-price {
        display flex;
        justify-content space-between;
        align-items center;
        .price {
          font-size 13px;
          color $color-theme-r;
          font-weight 700
          i {
            font-style normal;
            font-weight 700;
            font-size 20px;
          }
        }
        .count {
          font-size 13px;
          color #333;
        }
      }
    }
  }
  .freight-template {
    .item {
      display flex;
      justify-content space-between
      font-size 13px;
      margin-top 10px;
      &:first-child {
        margin-top 0;
      }
      .name {
        color #404040;
      }
      .price {
        font-size 12px;
        &.red {
          color $color-theme-r;
        }
        .spec-name {
          color #404040;
        }
      }
    }
  }
  .pay-recording {
    .title {
      font-size 14px;
      color #404040;
    }
    .payment-history {
      .item {
        display flex;
        justify-content space-between
        font-size 13px;
        color #404040;
        margin-top 8px;
        .personal-name {
          flex 1
        }
        .time {
          flex 3
          text-align center;
        }
        .num {
          flex 1;
          text-align right;
        }
      }
    }
    .payment-progress {
      text-align right;
      .pay-text {
        font-size 12px;
        color #404040;
        margin-top 10px;
        .red {
          color $color-theme-r;
        }
      }
    }
    .progress {
      margin-top 10px;
      .pro-title {
        font-size 13px;
        color #404040;
      }
      .progress-bar {
        height 12px;
        background-color #f6f6f6
        border-radius 6px;
        width 100%;
        margin-top 10px;
        position relative;
        .progress-portion {
          position absolute;
          left 0
          top 0;
          height 100%;
          background-color $color-theme-r;
          border-radius 6px;
        }
      }
    }
  }
  .add-message {
    .title {
      font-size 14px;
      color #404040;
    }
    .message-input {
      background-color #f6f6f6;
      margin-top 10px;
      border-radius 5px;
      font-size 13px;
      height 80px;
    }
  }
}
.bottom-btn {
  position fixed;
  left 0;
  right 0;
  bottom 0;
  height 50px;
  line-height 50px;
  text-align center;
  display flex;
  .btn {
    flex 1;
    font-size 18px;
    color #fff;
    background-color $color-theme-r;
    &.yellow {
      background-color #f0b800;
    }
    &.gray {
      background-color #cacaca
    }
  }
}
.chose-share-pop {
  .title {
    font-size 16px;
    text-align center;
    padding 15px 0;
    font-weight 700;
  }
  .share-btn-c {
    display flex;
    padding 0 15px;
    .item {
      padding 0 15px;
      .icon {
        display block;
        width 40px;
        margin 0 auto;
      }
      .text {
        color #333;
        text-align center;
        padding-top 10px;
        font-size 12px;
      }
    }
  }
  .cancel-btn {
    position absolute
    left 0;
    right 0
    bottom 0;
    font-size 18px;
    text-align center;
    height 50px;
    line-height 50px;
    box-shadow 0 0 5px #ddd;
  }
}
</style>