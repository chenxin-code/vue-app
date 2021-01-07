<template>
  <div>
    <nav-top title="礼单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="giftOrder-content">
      <div class="giftOrder-details">
        <div class="tips" v-if="tipsTxt">
          <p>{{tipsTxt}}</p>
        </div>
        <!-- 商品详情 -->
        <div class="giftList-item">
          <div class="item-top">
            <img :src="giftOrderGoodsDetails.proImgUrl" width="80" height="80" alt="">
            <div class="goods-info">
              <p class="goods-title">{{giftOrderGoodsDetails.proName}}</p>
              <p class="goods-number">剩余<span>{{giftOrderGoodsDetails.surplusNum}}</span>份
                共<span>{{giftOrderGoodsDetails.totalNum}}</span>份</p>
              <!-- <p class="goods-number">数量:<span>{{giftOrderGoodsDetails.totalNum}}</span></p> -->
            </div>
          </div>
          <div class="item-bottom">
            <div class="bottom-left">
              <p>{{giftOrderGoodsDetails.message}}</p>
            </div>
            <div class="bottom-right">
              <img class="gift-state"
                   v-if="giftOrderGoodsDetails.receiveState && giftOrderGoodsDetails.receiveState != 4"
                   src="../images/ylq.png" alt="" width="60" height="60">
              <img v-else-if="giftOrderGoodsDetails.receiveState == 4" src="../images/lqsb.png" alt="" width="50"
                   height="50">
              <div class="gift-form">
                <!-- <img src="../images/list-icon.png" alt="" width="25" height="25"> -->
                <van-icon name="user-circle-o" size="18"/>
                <p>来自<span class="fromUser">{{giftOrderGoodsDetails.realName}}</span>的礼单</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 领取记录 -->
        <div class="receive-record boxShadow" v-if="getGifyArr.length">
          <p class="title">领取记录</p>
          <div class="record-list">
            <div class="record-item" v-for="(item,index) in getGifyArr" :key="index">
              <div class="record-info">
                <img :src="item.proImgUrl" alt="" width="25" height="25">
                <div class="info-details">
                  <p class="record-name">{{item.receiveName}}</p>
                  <p class="record-time">{{item.receiveTime}}</p>
                </div>
              </div>
              <div class="record-state">{{receiveStateArr[item.receiveState]}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btns-two btns"
           v-if="giftOrderGoodsDetails.receiveState == 1 || giftOrderGoodsDetails.receiveState == 2 || giftOrderGoodsDetails.receiveState == 3">
        <div @click="MeToGift" class="my-receive btn">我也送</div>
        <div @click="shareFriendsHandle" class="show-off btn">炫耀一下</div>
      </div>
      <div class="btns-receive btns" v-else-if="giftOrderGoodsDetails.receiveState == 4">
        <div @click="MeToGift" class="my-receive">我也送</div>
      </div>
      <div class="btns-receive btns" v-else>
        <div @click="receiveGiftBtn">立即领取</div>
      </div>

      <div class="cxf" @click="cxfHandle">
        <p v-if="cxfShow">{{this.$route.query}}</p>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import {Base64} from 'js-base64'
  export default {
    data() {
      return {
        giftOrderGoodsDetails: {},
        getGifyArr: [],
        receiveStateArr: {
          1: '待发货',
          2: '待收货',
          3: '已领取',
          4: '领取失败'
        },
        tipsTxt: '',
        cxfShow: false
      }
    },
    mounted() {
      console.log(this.$route)
      this.getGiftState()
      // 领取记录
      this.$request.post('/app/json/app_send_gift_order/getReceiveGiftList', {
        userId: this.$route.query.userId,
        orderId: this.$route.query.orderId
      }).then((res) => {
        if (res.status === 0) {
          this.getGifyArr = res.data
        } else {
          this.$Toast(res.info)
        }
      })
    },
    methods: {
      cxfHandle() {
        this.cxfShow = !this.cxfShow
      },
      /**
       * 发起人不受领取限制
       * 已领取 - 您已领取过该奖品
       * 领完 - 来晚了,已被领取
       * 超时 - 礼盒已失效
       * 概率 - 换个姿势,下次一定能抢到
       */
      getGiftState() {
        this.$request.post('/app/json/app_send_gift_order/getReceiveGiftDetail', {
          userId: this.$route.query.userId,
          orderId: this.$route.query.orderId
        }).then((res) => {
          if (res.status === 0) {
            this.giftOrderGoodsDetails = res.data
            // sendState 1可赠送 2已领完 3已结束
            if (this.giftOrderGoodsDetails.sendState == 3) {
              this.tipsTxt = '礼盒已失效'
            } else if (this.giftOrderGoodsDetails.sendState == 2) {
              this.tipsTxt = '来晚了,已被领取'
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 立即领取
      receiveGiftBtn() {
        this.$router.push({
          path: '/gift-address',
          query: {
            userId: this.$route.query.userId,
            orderId: this.$route.query.orderId,
            goodsDetails: Base64.decode(this.$route.query.goodsDetails)
          }
        })
      },
      MeToGift() {
        this.$router.replace({
          path: '/common'
        })
      },
      // 分享给好友
      shareFriendsHandle() {
        let shareData = {
          title: `来自${giftOrderGoodsDetails.realName}的礼单`,
          sharetext: giftOrderGoodsDetails.proName,
          imageurl: giftOrderGoodsDetails.proImgUrl,
          detailurl: this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/receive-gift?userId=${giftOrderGoodsDetails.userId}&goodsDetails=${this.$route.query.goodsDetails}`
        }
        this.$bridgefunc.wechatShare(shareData);
      },

    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .giftOrder-content {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 10px;

    .cxf {
      width: 140px;
      height: 50px;
      position: absolute;
      bottom: 200px;
    }

    .boxShadow {
      border-radius: 5px;
      box-shadow: 0px 0px 5px #eaeaea;
      background: #fff;
      margin-bottom: 15px;
    }

    .tips {
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      background: #e9e9e9;
      margin: -10px -10px 10px;
    }

    .fromUser {
      color: #8b8b8b;
      font-weight: bold;
      font-style: italic;
      margin: 0 5px;
    }

    // 商品详情

    .giftList-item {
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0px 0px 5px #eaeaea;
      background: #fff;

      .item-top {
        display: flex;

        .goods-info {
          margin-left: 20px;

          p {
            margin: 10px 0 15px;
          }

          .goods-title {
            font-size: 14px;
            line-height: 15px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .goods-number {
            font-size: 14px;
            line-height: 20px;
            color: #8B8B8B;
          }
        }
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        height: 60px;
        padding-top: 10px;
        font-size: 14px;
        position: relative;

        .bottom-right {
          text-align: right;
          position: absolute;
          right: 0;
          bottom: 0;

          .gift-number {
            margin-top: 10px;

            span {
              color: red;
            }
          }

          .gift-form {
            display: flex;
            align-items: center;

            p {
              margin-left: 5px;
            }
          }

          .gift-btns {
            display: flex;
            justify-content: flex-end;
          }

          .shareFriends {
            color: red;
            border: 1px solid red;
            border-radius: 20px;
            text-align: center;
            margin-top: 10px;
            padding: 6px 10px;
          }
        }
      }
    }

    // 领取记录

    .receive-record {
      padding: 0 0 10px;

      p.title {
        text-align: center;
        line-height: 35px;
        margin: 0;
        font-size: 16px;
      }

      .record-list {
        padding: 0 10px;
        max-height: 150px;
        overflow-y: scroll;

        .record-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;

          .record-info {
            display: flex;
            align-items: center;

            .info-details {
              margin-left: 10px;

              .record-name {
                line-height: 25px;
              }

              .record-time {
                font-size: 12px;
                color: #ccc;
              }
            }
          }
        }
      }
    }

    .btns {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }

    .btns-two {
      display: flex;
      justify-content: space-around;

      .my-receive {
        background: #e1e1e1;
      }

      .show-off {
        background: red;
        color: #fff;
      }

      .btn {
        text-align: center;
        width: 50%;
      }
    }

    .btns-receive {
      text-align: center;
      background: red;
      color: #fff;
    }
  }
</style>
