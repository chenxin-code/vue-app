<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" :bgImg="bg"></nav-top>
    <nav-content>
      <div class="share-container">
        <div class="layout-top">
         <img class="img" src="static/image/microShop/title@2x.png" alt="">
          <p class="p">{{desc}}</p>
          <div class="couponDiv">
            <ul>
              <li>
                <div class="coupon-left" :style="{backgroundImage:'url('+(prizeObj.couPic?prizeObj.couPic: couPic)+')'}">
                </div>
                <div class="coupon-right">
                  <div class="double-line"><span class="text">{{prizeObj.couTypeTitle}}</span></div>
                  <div class="time-wrapper"><span class="time">{{prizeObj.validStartDate}}-{{prizeObj.validEndDate}}</span></div>
                  <div class="status"></div>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn" @click="get" v-if="isReceiveAward">领取优惠券</div>
          <div class="btn" v-else @click="use">立即使用</div>
        </div>
        <div class="layout-bottom">
          <div class="title">已有{{receiveNum?receiveNum:0}}人领取，还剩{{residueNum?residueNum:0}}人可领取</div>
          <div class="list">
            <div class="item" v-for="(item,index) in peopleList" :key="index" v-if="peopleList.length>0">
              <img class="avatar" src="./assets/image/icon1@2x.png" alt="">
              <div class="content">
                <div class="info">
                  <div class="name">{{item.joinUserNickName}}</div>
                </div>
                <div class="time">{{item.createTime}}</div>
              </div>
            </div>
            <div class="item" v-if="peopleList.length==0">
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
    <div class="boxModel" v-if="sharedView" @click="close">
      <div class="tip shared">
        <i class="icon iconfont mall-guanbi" @click="close"></i>
        <p class="p">领取成功</p>
        <div class="prizes">
          <p v-for="(item,index) in getPrize" :key="index">恭喜您获得{{item.awardName}}{{item.awardNum}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'
  import wechatOP from '../../../utils/WechatOP'
  import api from './api'
  export default {
    name: '',
    mixins: [api],
    data() {
      return {
        prizeObj: {},//獎品
        money: '',
        shareView: false, //分享遮罩
        sharedView: false,
        couPic: 'static/image/microShop/succee-icon.png',
        desc: '',
        receiveNum: '',
        residueNum: '',
        peopleList: [],
        isReceiveAward: false, //是否领取过优惠券
        getPrize: []
      }
    },
    mounted() {
      console.log('sssss',this.$route.query.couNo);
      // if (this.$store.state.login.token && this.$store.state.login.token.length) { //登录
        this.loadIndex() //接口传token
      // }
    },
    computed: {
      bg() {
        return require('../../../../static/image/microShop/bg11.png')
      }
    },
    methods: {
      get() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          couNo: this.$route.query.couNo
        }

        that.getData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            let data = res.data.data.mktAwardModelList || []
            if (data.length>0) {
              that.getPrize = data
              // that.isReceiveAward = false
              that.sharedView = true
              that.loadIndex()
            }
          } else {
            that.$toast(res.data.info)
          }
        })
      },
      use() {
       this.$router.replace({
         path: '/coupon_list'
       })
      },
      close() {
        this.sharedView = false
      },
      backEvent: function () {
        if (this.$store.state.webtype == 3 && window.history.length === 1) {
          wx.miniProgram.reLaunch({url: `/pages/common/home/index`})
        } else {
          this.$router.go(-1);
        }
      },
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          couNo: this.$route.query.couNo
        }

        that.detailData(params).then(res => {
          console.log(res);
          if (res.data.result === 'success') {
            let data = res.data.data || {}
           that.desc = data.desc
            that.receiveNum = data.receiveNum?data.receiveNum:0
            that.residueNum = data.residueNum?data.residueNum:0
            that.prizeObj = data.awardSetings[0] || {}
            console.log(that.prizeObj.couPic);
            if (that.prizeObj.couPic.indexOf('%')>=0) {
              that.prizeObj.couPic = that.prizeObj.couPic.slice(6,that.prizeObj.couPic.length-6)
            } else {
              that.prizeObj.couPic = that.prizeObj.couPic
            }
            console.log(that.prizeObj.couPic);
            that.peopleList = data.awards || []
            if (data.isReceiveAward == true) { //true是领过
              that.isReceiveAward = false
            } else {
              that.isReceiveAward = true
            }
          } else {
            that.$toast(res.data.info)
          }
        })
      },
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .share-container {
    height 100%
    background: url('./assets/image/bg2@2x.png') no-repeat
    -webkit-background-size: 100% 100%
    background-size: 100% 100%
    padding: 15px;
    display flex
    flex-direction column

    .layout-top {
      border-radius: 8px;
      margin-bottom: 20px;
      border 1px solid rgb(253,173,122);
      text-align: center
      /*padding 15px 0 25px 0*/
      flex none
      .img {
        width: 70%;
        margin: 10px auto;
      }
      .p {
        width: 90%;
        line-height: 18px;
        margin: 0 auto;
        font-size: 14px;
        text-align: left;
        color: white;
        margin-bottom 20px;
      }
      .btn {
        color white;
        background: linear-gradient(180deg, #f0c26b, #fa720c)
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        width: 90%;
        margin: 15px auto;
        border-radius: 5px;
      }
    }

    .layout-bottom {
      flex 1
      /*background: linear-gradient(to bottom, #a87aff, #8a25ff)*/
      background white;
      box-shadow 0 0 10px 4px #ff8a09 inset;
      border-radius 10px;
      padding 15px 11px 0 11px;
      color: #fd6b60;
      display flex
      flex-direction column

      .title {
        text-align: center
        padding 4px 0 10px 0
        flex none
        font-size: 15px;
        font-weight: 600;
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
            border-bottom: 0.5px solid #fd6b60;
            font-size 15px;

            .info {
              flex 1

              .name {
                /*padding-bottom: 6px;*/
              }
            }

            .prize {
              flex-shrink 0
              font-size: 14px;
            }
            .time {
              font-size: 14px;
              margin-right 6px
            }
          }
        }
      }

    }
  }

  .couponDiv {
    padding: 0.213333rem;
    width 90%
    box-shadow: 0 0 0.24rem 0 #ff8a09 inset;
    border-radius: 0.106667rem;
    overflow: hidden;
    display: flex;
    margin: 0 auto;
    background white;

    ul {
      width 100%

      li {
        display: flex;
        justify-content space-between
        /*height: 2.666667rem;*/

        .coupon-left {
          width: 2rem;
          height 2rem
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
          text-align left;
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
  .tip {
    position: fixed;
    z-index 2009
    bottom: 40%;
    width: 80%;
    left: 10%;
    height 28%
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

  .shared {
    background-image: url('./image/bg1-2@2x.png')
    .iconfont {
      top: 5%;
      right: 3%;
      color: #ffd895;
    }
    p:nth-child(2) {
      top 15%
    }
    p:nth-child(3) {
      bottom: 40%;
      text-align: center;
      color: #ffd895;
    }
  }

</style>
