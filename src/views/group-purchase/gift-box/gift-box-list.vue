<template>
  <div>
    <nav-top title="我的礼盒" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="giftBox-content">
      <div class="giftBox-tab">
        <p :class="tabsIndex == item.type ? 'active' : ''" v-for="(item, index) in tabs" :key="index"
           @click="TabsHandle(item)">{{item.title}}</p>
      </div>
      <div class="giftBox-list">
        <div class="giftList-item" v-for="(item, index) in giftBoxList" :key="index">
          <div class="item-top" @click="giftBoxItemHandle(item)">
            <img :src="item.proImgUrl" width="50" height="50" alt="">
            <div class="goods-info">
              <p class="goods-title">{{item.proName}}</p>
              <p class="goods-number">数量:<span>{{item.totalNum}}</span></p>
            </div>
          </div>
          <div class="item-bottom">
            <div class="bottom-left">
              <p>“好东西，齐分享”</p>
            </div>
            <div class="bottom-right" v-if="tabsIndex == 1">
              <p v-if="item.sendState == 1" class="gift-number">剩余<span>{{item.surplusNum}}</span>份
                共<span>{{item.totalNum}}</span>份</p>
              <div v-if="item.sendState == 1" class="shareFriends" @click="shareFriendsHandle(item)">分享给好友</div>
              <img v-if="item.sendState == 2" class="gift-state" src="../images/ylw.png" alt="" width="65"
                   height="65">
              <img v-if="item.sendState == 3" class="gift-state" src="../images/yjs.png" alt="" width="65"
                   height="65">
            </div>
            <div class="bottom-right" v-if="tabsIndex == 2">
              <div class="gift-form">
                <!-- <img src="../images/list-icon.png" alt="" width="25" height="25"> -->
                <van-icon name="user-circle-o" size="18"/>
                <p>来自<span class="fromUser">{{item.realName}}</span>的礼单</p>
              </div>
              <div class="gift-btns">
                <p class="shareFriends" @click="giftBoxItemHandle(item)">订单详情</p>
              </div>
            </div>
          </div>
        </div>
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
        tabsIndex: 1,
        tabs: [
          {
            type: 1,
            title: '我送的礼'
          }, {
            type: 2,
            title: '我收的礼'
          }
        ],
        giftBoxList: []
      }
    },
    mounted() {
      this.getGiftBoxData()
    },
    methods: {
      TabsHandle(item) {
        this.giftBoxList = []
        this.tabsIndex = item.type
        this.getGiftBoxData()
      },
      getGiftBoxData() {
        this.$request.post('/app/json/app_send_gift_order/getSendGiftList', {
          giftType: this.tabsIndex
        }).then((res) => {
          if (res.status === 0) {
            this.giftBoxList = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      giftBoxItemHandle(item) {
        if (item.sendState != 0) {
          this.$router.push({
            path: '/gift-order-details',
            query: {
              userId: item.userId,
              orderId: item.paymentId,
              orderType: item.orderType,
              giftType: this.tabsIndex,
              giftData: JSON.stringify(item)
            }
          })
        }
      },
      // 分享给好友
      shareFriendsHandle(item) {
        let goodsDetails = {
          goodsName: item.proName,
          goodsImg: item.proImgUrl
        }
        let shareData = {
          title: `来自${item.realName}的礼单`,
          sharetext: item.proName,
          imageurl: item.proImgUrl,
          detailurl: this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `/receive-gift?userId=${item.userId}&orderId=${item.orderId}&goodsDetails=${Base64.encode(JSON.stringify((goodsDetails)))}`
        }
        console.log(shareData)
        this.$bridgefunc.wechatShare(shareData);
      },
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  
  .giftBox-content {
    .fromUser {
      color: #8b8b8b;
      font-weight: bold;
      font-style: italic;
      margin: 0 5px;
    }
    
    .giftBox-tab {
      margin: 0 10px 0;
      background: #FEE8EA;
      border-radius: 20px;
      display: flex;
      justify-content: space-around;
      text-align: center;
      height: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 14px;
      
      p {
        width: 50%;
        border-radius: 20px;
        color: #FD4153;
      }
      
      .active {
        background: #FE0018;
        color: #fff;
      }
    }
    
    .giftBox-list {
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 10px;
      padding: 10px;
      padding-bottom: 50px;
      
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
            
            .goods-title {
              font-size: 14px;
              line-height: 15px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            
            .goods-number {
              line-height: 20px;
              color: #8B8B8B;
            }
          }
        }
        
        .item-bottom {
          display: flex;
          justify-content: space-between;
          height: 70px;
          padding-top: 10px;
          font-size: 14px;
          position: relative;
          
          .bottom-right {
            text-align: center;
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
    }
  }
</style>
