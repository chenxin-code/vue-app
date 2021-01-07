<template>
  <div>
    <nav-top title="分享优惠券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="box" v-if="list.length>0">
        <div class="img">
          <img src="static/image/microShop/banner@2x.png" alt="">
        </div>
        <div class="couponDiv" v-for="(item,index) in list" :key="index">
          <div class="div">
            <!--              <div class="coupon-left" :style="{backgroundImage:'url('+couPic+')'}">-->
            <!--              </div>-->
            <!--            <div class="coupon-left" :style="{backgroundImage:'url('+(item.couPic?item.couPic: item.couPicReal)+')'}">-->
            <!--            </div>-->
            <div class="divPic">
              <div class="price-info"><span class="unit">￥</span><span class="price">{{item.couFaceValue}}</span></div>
              <div class="msg">满{{item.couFaceValue}}元可用</div>
            </div>
            <div class="coupon-right">
              <div class="double-line"><span class="text">{{item.couTypeTitle}}</span></div>
              <div class="time-wrapper"><span class="time">{{item.startDate}}-{{item.endDate}}</span></div>
              <div class="status"></div>
              <div class="used" @click="share(item.couNo)">
                <img src="static/image/microShop/fenxiangico.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="nodata" v-if="list.length==0">暂无数据</div>
    </nav-content>
    <!-- 点击去分享弹框-->
    <div v-if="show" class="tip tip2">
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
    <div class="boxModel" v-if="sharedView" @click="close">
      <div class="shared">
        <img src="./image/bg1-2@2x.png" alt="">
        <i class="icon iconfont mall-guanbi" @click="close"></i>
        <p class="p">分享成功</p>
        <div class="prizes">
          <p v-for="(item,index) in parzeList" :key="index">恭喜您获得{{item.awardName}}{{item.awardNum}}</p>
        </div>
      </div>
    </div>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="">
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script>
  import Config from '@/api/config'
  import api from './api'

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        list: [],
        couPic: 'static/image/microShop/succee-icon.png',
        show: false,
        sharedView: false,
        shareData: {}, //分享
        sharemiMrssage: '', //分享
        shareView: false, //分享遮罩
        parzeList: '', //奖品列表
        couNo: '', //分享后自动领取奖励接口需要的入参
        awardNum: ''
      }
    },
    created() {

    },
    mounted() {
      this.loadIndex()
    },
    methods: {
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token
        }

        that.listData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            that.list = res.data.data || []
          }
        })
      },
      share(data) {
        console.log(data);
        let that = this
        that.couNo = data
        let params = {
          token: this.$store.state.login.token,
          couNo: data //券号
        }

        that.sharecont(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            that.shareData = {
              title: res.data.data.title,
              sharetext: res.data.data.subTitle,
              imageurl: res.data.data.imageUrl,
              detailurl: `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/user_center/sharePage?couNo=${data}`
            }
            that.awardNum = res.data.data.awardNum
            that.show = true
          } else {
            that.$toast(res.data.info)
          }
        })
      },
      close() {
        this.show = false
        this.sharedView = false
      },
      sharePage() {
        let that = this
        that.show = false
        console.log('hhhhh', that.shareData);
        that.$bridgefunc.wechatShare(that.shareData, (res1) => {
          console.log('分享', res1);
          if (res1 == '1') {
            let params = {
              token: that.$store.state.login.token,
              couNo: that.couNo //券号
            }

            that.prize(params).then(res => {
              console.log(res);
              if (res.data.result === 'success') {
                that.parzeList = res.data.data.mktAwardModelList || []
                if (that.parzeList.length > 0) {
                  that.sharedView = true
                }
              }
            })
          } else {
            that.$toast('分享失败')
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .box {
    .img {
      width 100%
      margin-bottom 20px;

      img {
        width 100%;
      }
    }

    .p {
      font-size 16px
      padding: 0.213333rem;
    }

    .couponDiv {
      padding: 0.213333rem;
      box-shadow: 0 0 0.24rem 0 rgba(197, 197, 197, 0.3);
      border-radius: 0.106667rem;
      overflow: hidden;
      display: flex;
      margin: 0 6px;
      margin-bottom: 15px;

      .div {
        width 100%
        display: flex;
        justify-content space-between
        height: 2.666667rem;

        .coupon-left {
          width: 3rem;
          text-align: center;
          padding: 0.373333rem 0.266667rem;
          color: #fff;
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
          flex-direction: column;
          justify-content: space-between;

          .double-line {
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            display: flex;
            line-clamp: 2;
            box-orient: vertical;
            font-size: 16px;
            font-weight: 600;

            .text {
              vertical-align: middle;
              line-height: 0.533333rem;
            }
          }

          .time-wrapper {
            padding-top: 0.16rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .time[data-v-fd3c4848] {
              font-size: 0.32rem;
              color: #999;
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
  }

  .divPic {
    background: #999;
    color white;
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
    margin-left: 0px;
  }

  .tip {
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
  }

  .tip2 {
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
      font-size: 18px;
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
        display: flex;
        margin-bottom: 6px;
      }
    }
  }

  .shared {
    position: fixed;
    z-index 2009
    bottom: 40%;
    width: 80%;
    left: 10%;
    height 30%
    background-size: 100% 100%

    .p {
      position: absolute;
      width: 100%;
      top: 10%;
      color: #ffd895;
      font-size: 16px;
      text-align: center;
    }
    /*background-image: url('./image/bg1-2@2x.png')*/
   img {
     position: absolute;
     top: 0;
     width: 100%;
     left: 0;
   }
    .iconfont {
      top: 5%;
      right: 3%;
      color: #ffd895;
    }

    p:nth-child(2) {
      top 15%
    }
  }

  .shareBox {
    text-align center
    background white !important

    .firendimg {
      width: 50px;
      height: 50px;
      display: flex;
      margin: 10px auto;
      border-radius: 50%;
    }
  }

  .boxModel {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 99;
    position: relative;
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
      display flex;
      margin-bottom 8px;
      color: #ffd895;
      line-height: 30px;
      font-size: 15px
    }
  }

  .nodata {
    font-size: 20px;
    margin: 80px auto;
    text-align: center;
  }

  /deep/ .nav-content {
    overflow-y auto !important;
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
