<template>
  <div>
    <nav-top :noBack="true"></nav-top>
    <nav-content class="container">
      <div class="top-info">
        <img src="./images/share-page-bg.png" alt="" class="bg">
        <div class="info-c">
          <p class="wish-msg">{{ infoData.wishMsg }}</p>
          <img src="./images/default-avatar.png" alt="" class="avatar default-a" v-if="!infoData.shareUserHeadUrl">
          <img :src="infoData.shareUserHeadUrl" alt="" class="avatar user-a" v-else>
          <p class="user-name">{{ infoData.shareUserNickName }}</p>
        </div>
      </div>
      <div class="prod-contaienr">
        <div class="item" v-for="(item, index) in infoData.productItemList" :key="index">
          <p class="title">
            <span class="mechan">{{ item.ouName }}</span>
          </p>
          <div class="prod-content">
            <img :src="item.phPictureUrl" alt class="prod-img" />
            <div class="right">
              <p class="prod-name">{{ item.skuName }}</p>
              <span class="sort-name">{{ dealWithFeature(item.featureValues) }}</span>
              <p class="price">￥<span class="num">{{ dealWithPrice(item.price)[0] }}</span>.{{ dealWithPrice(item.price)[1] }}</p>
            </div>
          </div>
          <span class="detail-btn" v-if="infoData.isYourSelf == 1" @click="toPay(item)">送给自己</span>
          <span class="detail-btn" v-else @click="toPay(item)">我要送TA</span>
        </div>
        <span class="more-tips">没有更多了~</span>
      </div>
      <div class="btm-btn" v-if="infoData.isYourSelf == 1" @click="openSharePop">邀请TA来买单</div>
      <div class="btm-btn" v-else @click="toDownApp">我也要玩</div>
    </nav-content>

    <!-- 请他买单弹窗 -->
    <pop-view v-if="showPop" @closeEvent="showPop = false" :popHeight="410" class="share-pop">
      <p class="title">设置分享信息</p>
      <div class="shipping-address public-box" @click="choseAddress">
        <div v-if="$store.state.mall2.selectAddress.id > 0">
          <p class="per-info"><span class="per-name">{{ $store.state.mall2.selectAddress.receiverName }}</span><span class="per-phone">{{ $store.state.mall2.selectAddress.mobile }}</span></p>
          <p class="detail-address">{{ $store.state.mall2.selectAddress.addressFull }}</p>
        </div>
        <div v-else class="no-address-tip">请设置收货信息</div>
        <i class="iconfont mall-gengduojiantou more-icon"></i>
      </div>
      <!-- <div class="self-address public-box">
        <div class="item">
          <p class="label">提货人姓名</p>
          <input type="text" class="form-input" placeholder="请输入提货人姓名" v-model="params.pickuperName" @input="userInput">
        </div>
        <div class="item">
          <p class="label">提货人手机号</p>
          <input type="text" class="form-input" placeholder="请输入提货人手机号" v-model="params.pickuperMobile" @input="phoneInput">
        </div>
      </div> -->
      <div class="leave-message public-box">
        <div class="top-title">
          <p class="msg-title">我想说的话</p>
          <span class="another-btn" @click="getWishText()">随机换一句</span>
        </div>
        <div class="msg-input-c">
          <van-field type="textarea" class="msg-input" v-model="params.wishMsg"/>
        </div>
      </div>
      <span class="next-btn" :class="{ disabled: (params.userAddressId < 0 || !params.wishMsg) }" @click="nextClick">下一步</span>
    </pop-view>
    <!-- 请他买单弹窗end -->

    <!-- 选择分享途径弹窗 -->
    <pop-view
      v-if="isShowShareType"
      @closeEvent="isShowShareType = false"
      :popHeight="190"
      class="chose-share-pop">
      <p class="title">邀请好友为你买单</p>
      <div class="share-btn-c">
        <div class="item" @click="shareToWechat">
          <img src="./images/icon-weixin.png" alt="" class="icon"/>
          <p class="text">微信好友</p>
        </div>
        <div class="item">
          <img src="./images/icon-pengyouquan.png" alt="" class="icon"/>
          <p class="text">朋友圈</p>
        </div>
      </div>
      <span class="cancel-btn" @click="isShowShareType = false">取消</span>
    </pop-view>
    <!-- 选择分享途径弹窗end -->
  </div>
</template>
<script>
import Config from '@/api/config'
export default {
  components: {
  },
  data() {
    return {
      infoData: {},
      showPop: false,
      isShowShareType: false,

      params: {
        userAddressId: '',
        wishMsg: '',
        // pickuperMobile: this.$store.state.login.phone,
        // pickuperName: this.$store.state.mall2.pickUpUser,
      }
    };
  },
  mounted() {
    this.initPageInfo();

    if (
      this.$store.state.mall2.pickUpUser == undefined ||
      this.$store.state.mall2.pickUpUser == ""
    ) {
      this.$store.state.mall2.pickUpUser = this.$store.state.login.nickName;
    }
    this.params.userAddressId = this.$store.state.mall2.selectAddress.id;
  },
  methods: {
    initPageInfo() {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/getWishOrderShareList', {
        shareNo: this.$route.query.shareNo
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.infoData = data.data;
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 去支付
    toPay(prodInfo) {
      if (this.$store.state.login.token == '') {
        this.$util.toLogin();
      } else {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token,
          carts: [{
            skuId: prodInfo.skuId,
            storeOuCode: prodInfo.storeOuCode,
            number: prodInfo.saleNumBegin,
            selfActivityId: '',
            checked: '1',
          }],
          deliveryType: prodInfo.deliverType,
          wishNo: prodInfo.wishNo, // 心愿编号
          userAddressId: this.infoData.userAddressId,
          provinceId: this.infoData.provinceId,
          cityId: this.infoData.cityId,
          countryId: this.infoData.countryId
        };
        if (prodInfo.deliverType == 12) {
          paramsData.deliveryType  = 2;
        }

        this.$http.post('/app/json/app_cart/SettleCart', paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.$router.push({
              name: '填写订单',
              query: {
                entryType: 'wish'
              },
              params: {
                res: data.data,
                deliveryType: prodInfo.deliverType,
                paramsData: paramsData,
                wishProdInfo: {
                  saleNumMax: prodInfo.saleNumMax,
                  saleNumStep: prodInfo.saleNumStep,
                  saleNumBegin: prodInfo.saleNumBegin
                }
              }
            })
          } else {
            this.$Toast(data.info);  
          }
          this.$Loading.close();
        }).catch(err => {
          this.$Toast(err);
          this.$Loading.close();
        })
      }
    },
    // 我也要玩
    toDownApp() {
      this.$router.push('/usercenter/downloadshare');
    },
    choseAddress() {
      this.$router.push({
        path: "/mall2/addresslist"
      });
    },
    getWishText(isDefault = '') {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/getRandomWishOrderConfig', {
        type: 1,
        isDefault,
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.params.wishMsg = data.data.wishMsg;
        } else {
          this.$Toast(data.info);  
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    shareToWechat() {
      this.$Loading.open();
      this.$http.post('/app/json/wish_order/addWishOrderShare', this.params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          let that = this;
          that.$bridgefunc.wechatShare({
            title: data.data.shareLinkTitle,
            sharetext: data.data.shareLinkContent,
            imageurl: data.data.shareLinkIcon,
            detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/wish_share_page?shareNo=${data.data.shareNo}`
          },(res) => {
            this.$Toast('分享成功！');
            this.isShowShareType = false;
          })
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err);
        this.$Loading.close();
      })
    },
    // 打开分享弹窗
    openSharePop() {
      if (!this.params.wishMsg) { // 未存在心愿留言
        this.getWishText(1);  
      }
      this.showPop = true;
    },
    // 手机号输入
    phoneInput() {
      this.params.pickuperMobile = this.params.pickuperMobile.replace(/[^\d]/g, '')
    },
    // 提货人姓名输入
    userInput() {
      this.$store.state.mall2.pickUpUser = this.params.pickuperName;
    },
    // 下一步点击
    nextClick() {
      if (this.params.userAddressId > 0 && this.params.wishMsg) {
        this.showPop = false;
        this.isShowShareType = true;
      }
    },
    // 处理规格信息
    dealWithFeature(featureList) {
      let result = '';
      if ((featureList instanceof Array) && (featureList.length > 0)) {
        featureList.forEach(item => {
          result += `${item.featureName}: ${item.featureValue} `;
        });
      }
      return result;
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum];
    },
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  .top-info {
    position relative;
    height 165px;
    .bg {
      display block;
      width 100%;
      height 165px;
      position absolute;
      top 0
      left 0
      right 0;
    }
    .info-c {
      height 100%;
      position relative;
      z-index 2;
    }
    .wish-msg {
      font-size 15px;
      color #fff;
      text-align center;
      padding 65px 25px 0;
      line-height 18px;
    }
    .avatar {
      display block;
      width 65px;
      height 65px;
      border-radius 50%;
      position absolute;
      left 50%;
      bottom 0;
      transform translate(-50%, 50%);
      box-shadow 0 0 5px #ddd;
    }
    .user-name {
      font-size 15px;
      text-align center;
      position absolute;
      bottom 0;
      left 0
      right 0;
      transform translateY(55px);
    }
  }
  
  .prod-contaienr {
    position absolute
    left 0
    right 0
    bottom 50px;
    top 230px;
    overflow-y auto;
    padding 8px;
    .item {
      padding: 15px 10px;
      box-shadow: 0 0 5px #ddd;
      border-radius: 4px;
      margin-top: 10px;
      position relative;
      &:first-child {
        margin-top 0;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .mechan {
          font-size: 14px;
        }

        .deliver {
          font-size: 12px;
          color: $color-theme-r;
        }
      }

      .prod-content {
        display: flex;
        margin-top: 12px;
        padding-bottom 15px;

        .prod-img {
          display: block;
          width: 75px;
          height: 80px;
        }

        .right {
          flex: 1;
          padding-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .prod-name {
            font-size: 15px;
            line-height: 18px;
            ellipse-2();
          }

          .sort-name {
            font-size: 12px;
            padding-top: 8px;
            color: $color-text-d;
          }

          .price {
            color: $color-theme-r;
            padding-top: 8px;
            font-weight: 700;
            font-size: 13px;
            line-height 15px;
            .num {
              font-size: 18px;
              font-weight: 700;
            }
          }
        }
      }
      
      .detail-btn {
        display block;
        height 26px;
        line-height 26px;
        padding 0 10px;
        color $color-theme-r;
        font-size 13px;
        position absolute;
        right 10px;
        bottom 10px;
        border 1px solid $color-theme-r;
        border-radius 13px;
        &:before {
          content: ''
          position: absolute
          top: -10px
          left: -10px
          right: -10px
          bottom: -10px
        }
      }
    }
    
    .more-tips {
      font-size 13px;
      text-align center;
      display block;
      padding 15px 0;
      color $color-text-d;
    }
  }

  .btm-btn {
    font-size 18px;
    color #fff;
    height 50px;
    line-height 50px;
    text-align center;
    background-color: $color-theme-r;
    position absolute;
    left 0
    right 0
    bottom 0;
    z-index 10;
  }
}

.share-pop {
  .public-box {
    border-radius 4px;
    box-shadow 0 0 5px #ddd;
    padding 10px 8px;
    margin 0 10px;
  }
  .title {
    font-size 16px;
    text-align center;
    padding 15px 0;
    font-weight 700;
  }
  .shipping-address {
    min-height 60px;
    position relative;
    .per-info {
      font-size 15px;
      .per-name {
      }
      .per-phone {
        padding-left 10px;
      }
    }
    .detail-address {
      font-size 13px;
      color $color-text-d;
      padding-top 10px;
      line-height 15px;
      padding-right 20px
    }
    .more-icon {
      font-size 12px;
      color $color-text-d;
      position absolute;
      right 10px;
      top 50%;
      transform translateY(-50%);
    }

    .no-address-tip {
      font-size 13px;
      position absolute
      left 10px;
      top 50%;
      transform translateY(-50%)
      color $color-text-d
    }
  }
  .self-address {
    margin-top 10px;
    .item {
      display flex;
      justify-content space-between
      font-size 13px;
      color #333;
      align-items center;
      &:last-child {
        padding-top 10px;
      }
      .form-input {
        font-size 14px;
        text-align right;
      }
    }
  }
  .leave-message {
    margin-top 10px;
    .top-title {
      display flex;
      justify-content space-between
      padding-top 8px;
      font-size 13px;
      color #333;
      .another-btn {
        display block;
        color $color-text-l;
        extend-click();
      }
    }
    .msg-input-c {
      background-color #f6f6f6
      border-radius 5px;
      margin-top 10px;
      padding 15px 10px;
      .msg-input {
        background-color #f6f6f6;
        padding 0;
        width 100%;
      }
    }
  }
  .next-btn {
    position absolute
    left 0;
    right 0
    bottom 0;
    font-size 18px;
    text-align center;
    color #fff;
    height 50px;
    line-height 50px;
    background-color $color-theme-r;
    box-shadow 0 0 5px #ddd;
    &.disabled {
      background-color #cacbca
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
