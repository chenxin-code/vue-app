<template>
  <div>
    <div class="boxModel" v-if="sharedView" @click="close">
      <div class="tip shared">
        <i class="icon iconfont mall-guanbi" @click="close"></i>
        <p style="line-height: 15px;">
          <span>恭喜您已使用优惠券可进行分享，分享后可得优惠券奖励，好友点击后也可领取优惠券。可分享优惠券如下</span>
        </p>
        <div class="box">
          <div class="couponDiv" v-for="item in list">
            <div class="div">
<!--              <div class="coupon-left" :style="{backgroundImage:'url('+(item.couPic?item.couPic: item.couPicReal)+')'}">-->
<!--              </div>-->
              <div class="divPic">
                <div class="price-info"><span class="unit">￥</span><span class="price">{{item.couFaceValue}}</span></div>
                <div class="msg">满{{item.couFaceValue}}元可用</div>
              </div>
              <div class="coupon-right">
                <div class="double-lines"><span class="text">{{item.couTypeTitle}}</span></div>
                <div class="time-wrapper"><span class="time">{{item.startDate}}-{{item.endDate}}</span></div>
                <div class="status"></div>
                <div class="used" @click="share(item.couNo)">
                  <img src="static/image/microShop/fenxiangico.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        <img class="btm-img" @click="toshare" src="static/image/microShop/button@2x.png" alt="">
      </div>
    </div>
    <!-- 点击去分享弹框-->
    <div v-if="show" class="tip1">
      <i class="icon iconfont mall-guanbi" @click="close"></i>
      <p>优惠券分享有礼</p>
      <p>
        <span>温馨提示：</span>
        <span>首次分享已使用券，您将获得优惠券{{awardNum}}张,好友点击后，也同样可以获得优惠券。</span>
      </p>
    </div>
    <van-popup @click="sharePage" class="shareBox" v-model="show" position="bottom" :style="{ height: '15%' }">
      <img class="firendimg" src="static/image/microShop/zhifu2.png" alt="">
      <p>微信好友</p>
    </van-popup>
    <!--分享成功弹框 -->
    <div class="boxModel1" v-if="shareshow" @click="close">
      <div class="shared1">
        <img src="./image/bg1-2@2x.png" alt="">
        <i class="icon iconfont mall-guanbi" @click="close"></i>
        <p class="p">分享成功</p>
        <div class="prizes">
          <p v-for="(item,index) in parzeList" :key="index">恭喜您获得{{item.awardName}}{{item.awardNum}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Config from '@/api/config'
  export default {
    name: "sharing-box",
    data() {
      return {
        sharedView: false,
        show: false,
        shareshow: false,
        list: [],
        shareData: {},
        couPic: 'static/image/microShop/succee-icon.png',
        couNo: '', //分享后自动领取奖励接口需要的入参
        parzeList: [],
        awardNum: ''
      }
    },
    mounted() {
      this.loadIndex()
    },
    methods: {
      share(data) {
        let that = this
        that.couNo = data
        let params = {
          token: this.$store.state.login.token,
          couNo: data //券号
        }
        let url = '/app/json/fission_activity/share'
        this.$http.post(url, params).then(
          res => {
            that.shareData = {
              title: res.data.data.title,
              sharetext: res.data.data.subTitle,
              imageurl: res.data.data.imageUrl,
              detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/user_center/sharePage?couNo=${data}`
            }
            that.awardNum = res.data.data.awardNum
            that.sharedView = false
            that.show = true
          },
          error => {
            this.$Toast(res.data.info)
          }
        );
      },
      close() {
        this.show = false
        this.sharedView = false
      },
      toshare() {
        this.$router.push({
          path: '/user_center/shareList'
        })
      },
      loadIndex() {
        if (this.$store.state.login.token == '') {
          return ;
        }
        let that = this
        let params = {
          token: this.$store.state.login.token
        }
        let url = '/app/json/fission_activity/getShareUsedCoupons'
        this.$http.post(url, params).then(
          res => {
            that.list = res.data.data || []
            if (that.list.length>0) {
              that.sharedView = true
            }
          },
          error => {
            this.$Toast(res.data.info)
          }
        );
      },
      sharePage() {
        let that = this
        that.show = false
        that.$bridgefunc.wechatShare(that.shareData,(res)=>{
          console.log(res)
          let params = {
            token: this.$store.state.login.token,
            couNo: that.couNo //券号
          }

          let url = '/app/json/fission_activity/sharedReceiveAward'
          that.$http.post(url, params).then(
            res => {
              if (res.data.result === 'success') {
                that.parzeList = res.data.data.mktAwardModelList || []
                if (that.parzeList.length>0) {
                  that.sharedView = false
                  that.shareshow = true
                }
              }
            },
            error => {
              this.$Toast(res.data.info)
            }
          )
        })

      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .boxModel {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    z-index: 9999;
    position: absolute;
    top 0
    buttom: 0
    left 0
  }
  .divPic {
    background: #f2ba67;
    color: white;
    flex-direction: column;
    display flex;
    padding: 0 8px;
    border-radius: 6px;
  }
  .msg {
    font-size: 12px;
    padding-top: 0.16rem;
    line-height: 0.373333rem;
    margin auto
  }
  .price-info {
    margin auto
  }
  .unit {
    font-size: 24px;
  }
  .price {
    font-size: 28px;
    font-weight: 600;
    margin-left: 0;
  }
  .tip {
    position: fixed;
    z-index: 2009;
    bottom: 30%;
    width: 84%;
    left: 8%;
    height: 58%;
    background-size: 100% 100%;

    .iconfont {
      position: absolute;
      top: -20%;
      right: 0;
      font-size: 16px;
      color: white;
    }

    p {
      position: absolute;
      width: 100%;
    }

    p:nth-child(2) {
      width: 84%;
      left: 8%;
      font-size 12px;
      line-height: 15px;
      color #c4321e

      span:nth-child(1) {
        display: block;
        margin-bottom: 6px;
      }
    }
  }

  .tip1 {
    position: fixed;
    z-index 2009
    bottom: 40%;
    width: 80%;
    left: 10%;
    height 175px
    background-image: url('./image/bg1-1@2x.png')
    background-size: 100% 100%

    .iconfont {
      position: absolute;
      top: -20%;
      right: 0;
      font-size: 16px;
      color: white;
    }

    p {
      position: absolute;
      width: 100%;
    }

    p:nth-child(2) {
      top: 20px;
      color: #ffd895;
      font-size: 16px;
      text-align: center;
    }

    p:nth-child(3) {
      width: 84%;
      left: 8%;
      top 70px
      font-size 14px;
      line-height: 22px;
      color #c4321e

      span:nth-child(1) {
        display: block;
        margin-bottom: 6px;
      }
    }
  }

  .shared {
    background-image: url('./image/ss.png')

    .iconfont {
      top: 5%;
      right: 3%;
      color: #ffd895;
    }

    p:nth-child(2) {
      top 24%
      text-align left;
      color white
    }
  }

  .box {
    position: absolute;
    top: 40%;
    width 90%;
    left: 5%
    height 160px;
    overflow-y: auto;
  }

  .btm-img {
    width: 90%;
    position: absolute;
    bottom: -15%;
    left: 5%;
  }

  .couponDiv {
    padding: 0.213333rem;
    box-shadow: 0 0 0.24rem 0 rgba(197, 197, 197, 0.3);
    border-radius: 0.106667rem;
    /*overflow: hidden;*/
    display: flex;
    margin: 0 6px;
    margin-bottom: 15px;
    background: #fffae7;

    .div {
      width 100%
      display: flex;
      justify-content space-between
      /*height: 50px;*/

      .coupon-left {
        width: 50px;
        text-align: center;
        padding: 0.373333rem 0.266667rem;
        color: #e42c2f;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        background: radial-gradient(circle, #ffb507, #ff8a09);

        .price-info {
          flex-shrink: 0;

          .unit {
            font-size: 0.64rem;
          }

          .price {
            font-size: 1.2rem;
            font-weight: 600;
            margin-left: -0.213333rem;
          }
        }

      }

      .coupon-right {
        padding: 0.213333rem;
        padding-right: 0.48rem;
        flex: 1;
        font-size: 0.373333rem;
        position: relative;
        overflow: hidden;
        min-height: 100%;
        display: flex;
        color #e13335
        flex-direction: column;
        justify-content: space-between;

        .double-lines {
          display: flex;
          line-clamp: 2;
          box-orient: vertical;
          font-size: 16px;
          font-weight: 600;
          line-height: 22px;

          .text {
            vertical-align: middle;
          }
        }

        .time-wrapper {
          padding-top: 0.16rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time {
            font-size: 0.32rem;
          }
        }

        .status {
          font-size: 0.266667rem;
          color: #999;
          padding-top: 0.213333rem;
          display: flex;
          justify-content: space-between;
        }

        .used {
          position: absolute;
          right: 0.266667rem;
          top: 50%;
          transform: translateY(-50%);
          width 25px;

          img {
            width 100%;
          }
        }

      }
    }
  }
  .shareBox {
    text-align center

    .firendimg {
      width: 50px;
      height: 50px;
      display: block;
      margin: 10px auto;
      border-radius: 50%;
    }
  }
  //分享成功弹框
  .boxModel1 {
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    z-index: 99;
    position: relative;
    .tip2 {
      position: fixed;
      z-index 2009
      bottom: 40%;
      width: 80%;
      left: 10%;
      height 30%
      background-image: url('./image/bg1-1@2x.png')
      background-size: 100% 100%

      .iconfont {
        position: absolute;
        top: -20%;
        right: 0;
        font-size: 16px;
        color: white;
      }

      .p {
        position: absolute;
        width: 100%;
        top: 10%;
        color: #ffd895;
        font-size: 16px;
        text-align: center;
      }
      .prizes {
        width: 100%;
        position: absolute;
        top: 35%;
        height: 110px;
        font-size 14px;
        overflow-y: auto;
        p {
          text-align center;
          width 100%;
          display block;
          margin-bottom 8px;
          color: #ffd895;
        }
      }
    }
    .shared1 {
      position: fixed;
      z-index 2009
      bottom: 40%;
      width: 80%;
      left: 10%;
      height 30%
      background-size: 100% 100%
      img {
        position: absolute;
        top: 0;
        width: 100%;
        left: 0;
      }
      .p {
        position: absolute;
        width: 100%;
        top: 10%;
        color: #ffd895;
        font-size: 16px;
        text-align: center;
      }
      .prizes {
        width: 100%;
        position: absolute;
        top: 31%;
        font-size 14px;
        overflow-y: auto;
        height 80px;
        p {
          text-align center;
          width 100%;
          display block;
          margin-bottom 8px;
          color: #ffd895;
          line-height: 30px;
          font-size: 15px
        }
      }
      /*background-image: url('./image/bg1-2@2x.png')*/
      .iconfont {
        top: 5%;
        right: 3%;
        color: #ffd895;
      }
    }
  }
</style>
