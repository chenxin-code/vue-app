<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="share-container">
        <div class="layout-top">
          <img class="avatar" v-if="$store.state.userInfo.headImg" :src="$store.state.userInfo.headImg" alt="">
          <img class="avatar" v-else src="./assets/image/icon1@2x.png" alt="">
          <template>
            <div class="content" v-if="!couponView">
              <p>好友给您分享了一张{{awardActivity.awardAmount}}元{{awardActivity.awardName}}</p>
              <p>点击领取看看手气吧</p>
            </div>
            <!--抢 按钮-->
            <img class="btn" @click="robIndex" v-if="coupon" src="./assets/image/button2@2x.png" alt="">
          </template>
          <!--领取成功-->
          <template>
            <div class="content" v-if="couponView">
              <p>领取成功</p>
              <p class="primary-info">{{money}}元代金券</p>
            </div>
            <!--邀请好友助力 按钮-->
            <img class="btn" src="./assets/image/button@2x.png" alt="" v-if="shareBtn" @click="AssistanceBtn">
            <!--            <p class="link">券已打入您的有路账户，<span class="text">前往使用</span>吧</p>-->
          </template>
          <template>
            <div class="content">
              <p class="tip">{{tipData}}</p>
            </div>
          </template>
        </div>
        <div class="layout-bottom">
          <div class="title" v-if="awardActivity.awardPerson-list.length>0">{{list.length ||
            0}}人已领取，还差{{(awardActivity.awardPerson-list.length)>=0?(awardActivity.awardPerson-list.length):0}}人领取奖励即可到账
          </div>
          <div class="title" v-if="awardActivity.awardPerson-list.length==0">{{list.length || 0}}人已领取，代金券即将到账</div>
          <div class="list">
            <div class="item" v-for="item in list" v-if="list.length>0">
              <img class="avatar" :src="item.joinUserAvtUrl" v-if="item.joinUserAvtUrl" alt="">
              <img class="avatar" src="./assets/image/icon1@2x.png" v-else alt="">
              <div class="content">
                <div class="info">
                  <div class="name">{{item.joinUserNickName}}</div>
                  <div class="time">{{item.awardtime}}</div>
                </div>
                <div class="prize">{{item.awardAmount}}元代金券</div>
              </div>
            </div>
            <div class="item" v-if="list.length==0">
              <p>暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'
  import wechatOP from '../../utils/WechatOP'
  import api from './api'

  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        awardActivity: {},
        list: [],
        money: '',
        shareView: false, //分享遮罩
        couponView: false,
        coupon: true,
        tipData: '',
        shareBtn: false, //分享按钮
      }
    },
    mounted() {
      this.awardActivity = JSON.parse(decodeURIComponent(this.$route.query.awardActivity))
      console.log(this.awardActivity.activityPromotionalPic);
      this.receiveList()
      if (this.$store.state.login.token && this.$store.state.login.token.length) {
        this.receiveState()
      }
      this.Assistance()
    },
    methods: {
      robIndex() { //抢
        let that = this
        if (!this.$store.state.login.token) {
          if (this.$store.state.webtype == 2) {
            this.$util.wechatBind();
          } else if (this.$store.state.webtype == 3) {
            this.$util.toLogin()
            // wx.miniProgram.redirectTo({url: `/pages/register/main?redirectUrl=${encodeURIComponent(Config.shareUrl + this.$route.fullPath)}`})
          }
        } else {
          that.robDatas()
        }
      },
      robDatas() { //接口方法
        this.$Loading.open();
        let that = this
        let params = {
          token: this.$store.state.login.token,
          activityId: that.awardActivity.activityId,
          orderId: that.awardActivity.orderId
        }

        that.robData(params).then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            that.money = res.data.data.mktAwardModelList[0].awardAmount || 0
            that.couponView = true
            that.coupon = false
            that.receiveList()
          } else {
            this.$Toast(res.data.info);
          }
        })
      },
      Assistance() { //分享
        console.log(this.awardActivity.activityDesc);
        let shareData = {
          title: this.awardActivity.activityTitle,
          sharetext: this.awardActivity.activityDesc,
          imageurl: this.awardActivity.activityPromotionalPic,
          detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/share-gift/share-list?awardActivity=` + encodeURIComponent(JSON.stringify(this.awardActivity))
        }
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            wxfunc.wxSetShareData(shareData);
          } else {
            console.log('签名失败');
          }
        });
      },
      AssistanceBtn() {
        this.shareView = true
      },
      receiveList() { //列表
        let that = this
        let params = {
          activityId: that.awardActivity.activityId,
          orderId: that.awardActivity.orderId
        }

        that.profitData(params).then(res => {
          if (res.data.status == 0) {
            that.list = res.data.data.awardList || []
            let num = that.awardActivity.awardPerson - that.list.length
            if (num > 0) {
              that.shareBtn = true
            } else {
              that.shareBtn = false
            }
          } else {
            this.$Toast(res.data.info);
          }
        })
      },
      receiveState() { //抢的状态
        let that = this
        let params = {
          token: this.$store.state.login.token,
          activityId: that.awardActivity.activityId,
          orderId: that.awardActivity.orderId
        }

        that.receivestateData(params).then(res => {
          let showData = res.data.data || {}
          if (showData.canJoin == true) {
            that.coupon = true
          } else {
            that.coupon = false
            that.tipData = showData.msg
          }
          let moneyCoupon = showData.awardModel || {}
          if (moneyCoupon.awardAmount) {
            that.money = moneyCoupon.awardAmount
            that.couponView = true
          } else {
            that.couponView = false
          }
        })
      },
      backEvent: function () {
        if (this.$store.state.webtype == 3 && window.history.length === 1) {
          wx.miniProgram.reLaunch({url: `/pages/common/home/index`})
        } else {
          this.$router.go(-1);
        }
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .share-container {
    height 100%
    background: url('./assets/image/bg@2x.png') no-repeat
    -webkit-background-size: 100% 100%
    background-size: 100% 100%
    padding: 15px;
    display flex
    flex-direction column

    .layout-top {
      text-align: center
      padding 15px 0 25px 0
      flex none

      .avatar {
        width 60px;
        border-radius 50%
      }

      .content {
        padding 10px 0 20px 0
        color: #fff;
        line-height: 21px;
        font-size 14px;

        .primary-info {
          font-size: 20px;
          padding-top: 12px;
        }
      }

      .link {
        color: #fff;

        .text {
          color: #e3b950
          text-decoration underline
        }
      }

      .btn {
        width 140px;
        display: block;
        margin: 20px auto;
      }

      .tip {
        font-size: 12px;
        color: #e3b950
      }
    }

    .layout-bottom {
      flex 1
      background: linear-gradient(to bottom, #a87aff, #8a25ff)
      box-shadow 0 0 10px 4px rgba(0, 0, 0, 0.1)
      border-radius 10px;
      padding 15px 11px 0 11px;
      color: #fff;
      display flex
      flex-direction column

      .title {
        text-align: center
        padding 4px 0 10px 0
        flex none
      }

      .list {
        flex 1
        overflow-y auto
        -webkit-overflow-scrolling touch

        .item {
          display flex
          align-items center

          p {
            margin-top: 30px;
            text-align: center;
            width: 100%;
            font-size: 16px;
          }

          .avatar {
            width 40px;
            border-radius 50%
            flex-shrink 0
          }

          .content {
            flex 1
            display flex
            align-items center
            padding 15px 0;
            margin-left: 8px;
            border-bottom: 0.5px solid rgba(255, 255, 255, 0.78);

            .info {
              flex 1

              .name {
                padding-bottom: 6px;
              }

              .time {
                font-size: 12px;
              }
            }

            .prize {
              flex-shrink 0
              font-size: 15px;
            }
          }
        }
      }

    }
  }

  >>> .stateBox {
    z-index: 2001;
    /*height: 180px;*/
    /*line-height: 180px;*/
    width: 80%;
    text-align: center;
    font-size: 16px;
    color white;
    top 200px;

    img {
      width 80px;
      margin 0 0 15px 160px;
    }
  }

  >>> .van-popup {
    background transparent;
  }

  >>> .van-overlay {
    background-color rgba(0, 0, 0, 0.6)
  }
</style>
