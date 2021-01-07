<template>
  <div>
    <nav-top title="配置礼盒" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="giftBox-content">
      <div class="giftBox-details">
        <p class="gift-form">来自<span class="fromUser">{{$store.state.userInfo.realName}}</span>的礼单</p>
        <div class="goods-info boxShadow">
          <div class="left">
            <img :src="goodsInfo.phMainUrl" alt="" width="70" height="70">
          </div>
          <div class="right">
            <div class="goods-info-title">{{goodsInfo.skuName}}</div>
            <div class="goods-info-number">
              <p class="goods-price color_r"></p>
              <p class="goods-number">*{{g_num}}</p>
            </div>
          </div>
        </div>

        <div class="isVisible boxShadow">
          <p>收礼人互相可见</p>
          <van-switch v-model="isVisible" active-color="#ee0a24" inactive-color="#ccc" size="14"/>
        </div>

        <div class="receive-mode boxShadow">
          <p>领取方式</p>
          <div class="mode-check">
            <p class="mode-title">{{receiveTitle}}<span>(每人限领一份)</span></p>
            <van-icon name="arrow" size="14" @click="receiveHandle"/>
          </div>
        </div>

        <div class="message-inp boxShadow">
          <p>留言</p>
          <van-field v-model="message" rows="3" autosize type="textarea" maxlength="20" placeholder="请输入留言"
                     show-word-limit/>
        </div>

        <van-popup v-model="receiveModal" position="bottom">
          <van-picker show-toolbar title="领取方式" :columns="columns" value-key="title" @cancel="receiveModal = false"
                      @confirm="onConfirm"/>
        </van-popup>

      </div>

      <div class="btns-receive btns">
        <div @click="shareFriendsHandle">分享给好友</div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import Config from "@/api/config";
  import {Base64} from "js-base64";

  export default {
    data() {
      return {
        isVisible: false, // 收礼人互相可见
        message: '',
        receiveModal: false,
        receiveType: '1',
        receiveTitle: '先到先得',
        columns: [{
          type: 1,
          title: '先到先得'
        }, {
          type: 2,
          title: '拼手气'
        }],
        g_skuId: '',
        g_num: '',
        deliverType: '',
        goodsInfo: {},
        payInfo: {},
        flag: false,
        configGiftBoxData: {},
        wishNo: ''
      }
    },
    mounted() {
      let carts = JSON.parse(this.$route.query.carts)
      this.payInfo = JSON.parse(this.$route.query.payInfo)
      console.log(this.$route.query)
      this.g_skuId = carts[0].skuId
      this.g_num = carts[0].number
      this.deliverType = this.$route.query.deliveryType
      this.$request.post('/app/json/product/getAppProDetail', {
        skuId: this.g_skuId,
        deliverType: this.deliverType
      }).then((res) => {
        if (res.status === 0) {
          this.goodsInfo = res.data
        } else {
          this.$Toast(res.info)
        }
      })
      this.$request.post('/app/json/app_shopping_order/detail',{
        orderId: this.payInfo.orderId,
        orderType: this.payInfo.orderType,
      }).then(res =>{
        if(res.status == 0){
          this.wishNo = res.data.wishNo
        }else{
          this.$Toast(res.info)
        }
      })
      // 获取留言
      this.$request.post('/app/json/app_send_gift_order/getSendGiftRemark', {
        type: '1'
      }).then((res) => {
        if (res.status === 0) {
          this.message = res.data.message
        } else {
          this.$Toast(res.info)
        }
      })
    },
    methods: {
      receiveHandle() {
        this.receiveModal = true
      },
      onConfirm(val) {
        this.receiveModal = false
        this.receiveType = val.type
        this.receiveTitle = val.title
      },
      // 分享给好友
      shareFriendsHandle() {
        let params = {
          wishNo: this.wishNo,
          orderId: this.payInfo.orderId,
          orderType: this.payInfo.orderType,
          proSkuId: this.g_skuId,
          totalNum: this.g_num,
          proImgUrl: this.goodsInfo.phMainUrl,
          proName: this.goodsInfo.skuName,
          receiveType: this.receiveType,
          isVisible: this.isVisible ? 1 : 0
        }
        let goodsDetails = {
          goodsName: this.goodsInfo.skuName,
          goodsImg: this.goodsInfo.phMainUrl
        }
        if (!this.flag) {
          this.$request.post('/app/json/app_send_gift_order/configGiftBox', params).then(res => {
            if (res.status === 0) {
              this.flag = true
              this.configGiftBoxData = res.data
              this.$Toast('配置成功!')
              let shareData = {
                title: `来自${this.$store.state.userInfo.realName}的礼单`,
                sharetext: this.goodsInfo.skuName,
                imageurl: this.goodsInfo.phMainUrl,
                detailurl: this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/receive-gift?userId=${res.data.userId}&orderId=${res.data.orderId}&goodsDetails=${Base64.encode(JSON.stringify((goodsDetails)))}`
              }
              console.log(shareData)
              this.$bridgefunc.wechatShare(shareData);
            } else {
              this.$Toast(res.info)
            }
          })
        } else {
          let shareData = {
            title: `来自${this.$store.state.userInfo.realName}的礼单`,
            sharetext: this.goodsInfo.skuName,
            imageurl: this.goodsInfo.phMainUrl,
            detailurl: this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/receive-gift?userId=${this.configGiftBoxData.userId}&orderId=${this.configGiftBoxData.orderId}&goodsDetails=${Base64.encode(JSON.stringify((goodsDetails)))}`
          }
          console.log(shareData)
          this.$bridgefunc.wechatShare(shareData);
        }

      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .giftBox-content {
    padding: 10px;

    .boxShadow {
      border-radius: 5px;
      box-shadow: 0px 0px 5px #eaeaea;
      background: #fff;
      margin-bottom: 15px;
    }

    .gift-form {
      line-height: 20px;
      font-size: 16px;
      margin: 0 0 7px 10px;
    }

    .color_r {
      color: red;
    }

    .fromUser {
      color: #8b8b8b;
      font-weight: bold;
      font-style: italic;
      margin: 0 5px;
    }

    .goods-info {
      display: flex;
      justify-content: flex-start;
      padding: 10px;

      .right {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;

        & > div {
          line-height: 25px;
        }

        .goods-info-number {
          display: flex;
          justify-content: space-between;

          .goods-price {
            font-size: 12px;

            span {
              font-size: 16px;
            }
          }
        }
      }
    }

    .isVisible {
      padding: 15px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .receive-mode {
      padding: 15px 10px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      .mode-check {
        display: flex;
        align-items: center;
        font-weight: bold;

        span {
          font-size: 12px;
          color: #989898;
        }
      }
    }

    .message-inp {
      padding: 10px;
      font-size: 14px;

      /deep/ .van-cell {
        padding: 10px 0;
      }

      /deep/ .van-field__body {
        background: #f4f4f4;
        border-radius: 6px;
        padding: 5px;
      }
    }

    .btns {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      text-align: center;
      background: red;
      color: #fff;
    }
  }
</style>
