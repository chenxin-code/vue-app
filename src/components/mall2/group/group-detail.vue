<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" :bgImg="bg"></nav-top>
    <nav-content class="group-detail-container" v-if="loaded">
      <div class="group-detail">
        <div class="info">
          <div class="pro-info">
            <img class="media-object" :src="getItemImg(groupDetail)" alt="" />
            <div class="media-content">
              <div class="name">
                <span class="group-num"
                  >{{ groupDetail.groupBuyNumOfPerson }}人团</span
                >
                {{ groupDetail.skuName }}
              </div>
              <div class="price-wrapper">
                <span class="price">
                  <span class="unit">￥</span>
                  {{ groupDetail.leaderPrice }}
                </span>
                <span class="line-through">￥12</span>
              </div>
            </div>
          </div>
          <div class="group-state">
            <p class="state-msg">{{ getStateText() }}</p>
            <div
              class="state-sub-msg"
              v-if="
                myGroupDetail.state == undefined ||
                myGroupDetail.state == 2 ||
                myGroupDetail.state == 4
              "
            >
              <span class="text"
                >还差{{
                  groupDetail.groupBuyNumOfPerson -
                  groupDetail.currentNumOfPerson
                }}人！距结束</span
              >
              <div class="count-down">
                <countdown
                  class="count-down-con"
                  :hiddenDay="true"
                  :endTime="$util.getDateFromString(groupDetail.endTime)"
                  type="theme_bg_red"
                ></countdown>
              </div>
            </div>
            <div class="state-sub-msg" v-else>
              <span class="text">{{ getStateSubText() }}</span>
            </div>
            <div class="member-list">
              <div
                class="member-item"
                v-for="(member, idx) in groupDetail.orderItemList"
                v-if="idx < groupDetail.groupBuyNumOfPerson"
              >
                <div class="member-avatar-wrapper">
                  <div class="member-avatar">
                    <img
                      class="img"
                      :src="
                        member.userAvatar
                          ? member.userAvatar
                          : 'static/images/defaultImg.png'
                      "
                      mode="widthFix"
                      alt=""
                    />
                  </div>
                  <span class="tit" v-if="idx == 0">团长</span>
                </div>
                <div class="member-name ellipsis single-line">
                  {{ member.userNickName }}
                </div>
              </div>
              <div class="member-item" v-if="groupDetail.state == '2'">
                <div class="member-avatar">
                  <img class="img" src="static/image/mall2/addp.png" />
                </div>
                <div class="member-name ellipsis">待邀请</div>
              </div>
            </div>
            <div
              class="btn"
              v-if="myGroupDetail.state == undefined && groupDetail.state < 6"
              @click="toAddGroup"
            >
              立即参团
            </div>
            <div
              class="btn"
              v-else-if="myGroupDetail.state == 2"
              @click="shareForOpenWXMiniProgramsharegoods"
            >
              邀请好友
            </div>
            <div
              class="btn"
              v-else-if="myGroupDetail.state == 4"
              @click="toPay"
            >
              去付款
            </div>
            <!--myGroupDetail.state == 9 || myGroupDetail.state == 10 || myGroupDetail.state == 6-->
            <div class="btn" v-else @click="toDetail">重新开团</div>
            <div class="btn-2" @click="toList">查看更多团购商品</div>
          </div>
        </div>
      </div>
      <div class="group-process">
        <div class="group-title">
          <span class="text">拼团流程</span>
          <span class="rule" @click="showagreement">规则明细</span>
        </div>
        <div class="group-process-content">
          <div class="group-process-item">
            <img class="img" src="./image/group_icon1.png" alt="" />
            <p class="text">团长开团</p>
          </div>
          <div class="group-process-item">
            <img class="img" src="./image/group_icon2.png" alt="" />
            <p class="text">邀请好友</p>
          </div>
          <div class="group-process-item">
            <img class="img" src="./image/group_icon3.png" alt="" />
            <p class="text">拼团成功</p>
          </div>
          <div class="group-process-item">
            <img class="img" src="./image/group_icon4.png" alt="" />
            <p class="text">等待发货</p>
          </div>
        </div>
      </div>
    </nav-content>
    <groupsuccess
      @closeEvent="isGroupSuccess = false"
      :successType="successType"
      @shareGroup="sharegoods"
      @toOrderList="toOrderList"
      v-if="formPaySuccess != '0' && isGroupSuccess && $store.state.webtype != '2' && $store.state.webtype != '3'"
    ></groupsuccess>
    <van-popup v-model="shareView" class="stateBox">
      <img src="static/image/microShop/jiantou@2x.png" alt="" />
      <p>请点击右上角进行分享</p>
    </van-popup>
  </div>
</template>

<script type="text/ecmascript-6">
import Countdown from "@/components/Vendor/countdown/countdown";
import { Dialog } from "vant";
import groupsuccess from "./group-success";
import Config from "@/api/config";
import wxfunc from "@/utils/wxfunc";
import appShare from "@zkty-team/x-engine-module-share";


export default {
  name: "",
  data() {
    return {
      orderId: "", // id
      mktGroupBuyId: "", // 分享id
      groupDetail: "", // 详情
      myGroupDetail: {},
      isLeader: {
        // true 是团长，false是团员
        type: Boolean,
        default: true,
      },
      isGroupSuccess: false,
      successType: 1,
      loaded: false,
      myTimeout: null,
      loadTimes: 0,
      formPaySuccess: "0",
      shareView: false,
      wxOrderInfoKey:"",
      wxOrderInfo:{},
    };
  },
  components: {
    Countdown,
    groupsuccess,
  },
  computed: {
    bg() {
      return require("./image/group_bg_top.png");
    },
    couponDetail() {
      let coupon = {};
      if (this.groupDetail.leaderUserAward || this.groupDetail.userAward) {
        if (this.isLeader) {
          coupon = this.groupDetail.leaderUserAward[0] || {};
        } else {
          coupon = this.groupDetail.userAward[0] || {};
        }
      }
      return coupon;
    },
    residueNum() {
      return (
        this.groupDetail.groupBuyNumOfPerson -
        this.groupDetail.currentNumOfPerson
      );
    },
  },
  mounted() {
    if(this.$route.query.wxOrderInfoKey){
      this.wxOrderInfoKey = this.$route.query.wxOrderInfoKey;
      this.getOrderInfo()
    }else{
      this.orderId = this.$route.query.orderId;
      this.mktGroupBuyId = this.$route.query.mktGroupBuyId;
      this.formPaySuccess = this.$route.query.formPaySuccess
        ? this.$route.query.formPaySuccess
        : "0";
      this.queryGroupDetail();
    }
    // this.queryAll() // 暂时用来获取id的
  },
  destroyed() {
    if (this.myTimeout) {
      clearTimeout(this.myTimeout);
      this.myTimeout = null;
    }
  },
  methods: {
    getOrderInfo(){
      this.$http.post('/app/json/home/getVueAppTempData',{tempKey:this.wxOrderInfoKey}).then(res=>{
        if(res.data.status==0){
          this.wxOrderInfo = JSON.parse(res.data.data);
          this.orderId = this.wxOrderInfo.orderId;
          this.mktGroupBuyId = this.wxOrderInfo.mktGroupBuyId;
          this.formPaySuccess = this.wxOrderInfo.formPaySuccess;
          this.queryGroupDetail();
        }
      })
    },
    toAddGroup: function () {
      this.$router.push({
        path: "/groupproduct",
        query: {
          groupId: this.groupDetail.id,
          productType: this.groupDetail.orderItemList[0].productType,
          mktGroupBuyId: this.groupDetail.mktGroupBuyId,
          spuId: this.groupDetail.spuId,
          isAddGroup: "1",
          skuId: this.groupDetail.orderItemList[0].skuId,
          deliverType: this.groupDetail.orderItemList[0].deliverType,
        },
      });
    },
    toDetail: function () {
      this.$router.push({
        path: "/groupproduct",
        query: {
          skuId: this.myGroupDetail.skuId,
          productType: this.myGroupDetail.productType,
          groupId: this.groupDetail.id,
          mktGroupBuyId: this.groupDetail.mktGroupBuyId,
          spuId: this.groupDetail.spuId,
          deliverType: this.myGroupDetail.deliverType,
        },
      });
    },
    toList: function () {
      this.$router.push("/grouplist");
    },
    setWxShareArgs: function () {
      let shareData = {};
      shareData.title = this.groupDetail.skuName;
      shareData.sharetext = this.groupDetail.groupBuyName;
      shareData.imageurl = this.groupDetail.leaderUserAward[0].gameAwardPic;

      if (this.$store.state.webtype == 2) {
        shareData.detailurl =
          this.$store.state.globalConfig.wxBaseUrl +
          Config.shareUrl +
          "/group_detail?orderId=" +
          this.orderId;
        shareData.detailurl +=
          "&mktGroupBuyId=" + this.groupDetail.mktGroupBuyId;
        shareData.detailurl += "&spuId=" + this.groupDetail.spuId;

        if (
          this.$store.state.login.token &&
          this.$store.state.login.token != ""
        ) {
          shareData.detailurl =
            shareData.detailurl +
            "&recommend=" +
            this.$store.state.userInfo.userId;
          shareData.detailurl =
            shareData.detailurl +
            "&recommendPhone=" +
            this.$store.state.login.phone;
        }

        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            wxfunc.wxSetShareData(shareData);
          } else {
            console.log("签名失败");
          }
        });
      } else if (this.$store.state.webtype == 3) {
        // let path = wxfunc.wxmpPath(this.$route)
        shareData.detailurl =
          Config.shareUrl + "/group_detail?orderId=" + this.orderId;
        shareData.detailurl +=
          "&mktGroupBuyId=" + this.groupDetail.mktGroupBuyId;
        shareData.detailurl += "&spuId=" + this.groupDetail.spuId;
        if (
          this.$store.state.login.token &&
          this.$store.state.login.token != ""
        ) {
          shareData.detailurl =
            shareData.detailurl +
            "&recommend=" +
            this.$store.state.userInfo.userId;
          shareData.detailurl =
            shareData.detailurl +
            "&recommendPhone=" +
            this.$store.state.login.phone;
        }

        let shareData = {
          title: shareData.title,
          path: shareData.detailurl,
          imageUrl: shareData.imageurl,
          rfrCode: this.$store.state.userInfo
            ? this.$store.state.userInfo.userId
            : "",
        };
        wx.miniProgram.postMessage({ data: JSON.stringify(shareData) });
      }
    },
    shareForOpenWXMiniProgramsharegoods: function () {
      //分享
      console.log('触发分享------------')
      if (this.$store.state.webtype == 2 || this.$store.state.webtype == 3) {
        this.shareView = true;
        return;
      }
      this.isGroupSuccess = false;
      let shareData = {};
      shareData.title = this.groupDetail.skuName;
      shareData.sharetext = this.groupDetail.groupBuyName;
      shareData.imageurl = this.groupDetail.leaderUserAward[0].gameAwardPic;
      // skuId=15034&groupId=240&mktGroupBuyId=166&spuId=1144
      shareData.detailurl =
        this.$store.state.globalConfig.wxBaseUrl +
        Config.shareUrl +
        "/group_detail?orderId=" +
        this.orderId;
      shareData.detailurl += "&mktGroupBuyId=" + this.groupDetail.mktGroupBuyId;
      shareData.detailurl += "&spuId=" + this.groupDetail.spuId;

      console.log('分享appShare-------------------',appShare)
      console.log({
        skuId:this.$route.query.skuId,
        productType:this.$route.query.productType,
        groupId:this.$route.query.groupId,
        mktGroupBuyId:this.groupDetail.mktGroupBuyId,
        spuId:this.groupDetail.spuId,
      })
      appShare
        .shareForOpenWXMiniProgram({
          userName: "gh_28d617271c97",
          path: `pages/common/home/index?redirect=${encodeURIComponent(
            `/app-vue/app/index.html#/groupproduct?skuId=${this.$route.query.skuId}&productType=${this.$route.query.productType}&groupId=${this.$route.query.groupId}&mktGroupBuyId=${this.groupDetail.mktGroupBuyId}&spuId=${this.groupDetail.spuId}`
          )}`,
          title: shareData.title,
          desc: shareData.sharetext,
          link: "https://www.baidu.com",
          imageurl:shareData.imageurl,
          miniProgramType: 2,
          __event__: (res) => {},
        })
        .then((res) => {
          // document.getElementById("debug_text").innerText = res;
          console.log("shareThenRes----------", JSON.stringify(res));
        });
      console.log('执行完毕-------------------')
      // this.$bridgefunc.wechatShare(shareData);
    },
    toPay: function () {
      let payInfo = {
        tradeNo: this.myGroupDetail.payTradeNo,
        payAmount: this.myGroupDetail.payAmount,
        orderType: this.myGroupDetail.payOrderType,
        orderId: this.myGroupDetail.payOrderId,
      };
      let occurOuCode = this.myGroupDetail.payOccurOuCode;
      // this.$router.push({
      //   name: '收银台',
      //   params: {
      //     payInfo: payInfo,
      //     occurOuCode: occurOuCode,
      //     isGroup: '1',
      //     orderId: this.groupDetail.orderId,
      //     mktGroupBuyId: this.groupDetail.mktGroupBuyId
      //   }
      // })
      this.$router.push({
        path: "/mall2/checkstand",
        query: {
          payInfo: JSON.stringify(payInfo),
          occurOuCode: occurOuCode,
          isGroup: "1",
          orderId: this.groupDetail.orderId,
          mktGroupBuyId: this.groupDetail.mktGroupBuyId,
        },
      });
    },
    getStateText: function () {
      let state = this.myGroupDetail.state;
      let str = "";
      if (state == 2) {
        str = "开团中，邀请好友加入";
      } else if (state == 4) {
        str = "待支付，请您尽快付款";
      } else if (state == 9) {
        str = "拼团成员不足，开团失败";
      } else if (state == 10) {
        str = "拼团成员已满，开团成功";
      } else if (!state || state == undefined) {
        str = "拼团进行中！立即参团？";
      }
      return str;
    },
    getStateSubText: function () {
      let state = this.myGroupDetail.state;
      let str = "";
      if (state == 9) {
        str = "试试开团自己抢拼团商品吧";
      } else if (state == 10) {
        str = "试试开团自己抢拼团商品吧";
      }
      return str;
    },
    getLessMember: function (item) {
      return item.groupBuyNumOfPerson - item.currentNumOfPerson;
    },
    getItemImg: function (item) {
      // let arr = item.orderList
      // if (arr.length > 0) {
      //   let act = arr[0]
      let leaderUserAward = item.leaderUserAward;
      if (leaderUserAward.length > 0) {
        let gameAwardPic = leaderUserAward[0].gameAwardPic;
        return gameAwardPic;
      }
      // }
      return "";
    },
    // queryGroupDetail() {
    //   this.$http.post('/app/json/app_fight_group_order/detail', {
    //     orderId: this.orderId,
    //     mktGroupBuyId: this.mktGroupBuyId
    //   }).then(res => {
    //     if (res.status === 0) {
    //       this.groupDetail = res.data
    //       if (this.groupDetail && this.groupDetail.orderItemList && this.groupDetail.orderItemList instanceof Array) {
    //         const num = this.groupDetail.groupBuyNumOfPerson - this.groupDetail.currentNumOfPerson
    //         for (let i = 0; i < num; i++) {
    //           this.groupDetail.orderItemList.push('')
    //         }
    //       }
    //     }
    //     wx.stopPullDownRefresh()
    //   })
    // },
    queryGroupDetail() {
      console.log('this.formPaySuccessthis.formPaySuccessthis.formPaySuccessthis.formPaySuccess',this.formPaySuccess)
      // 详情
      if (this.loaded == false) {
        this.$Loading.open();
      }
      let paramsData = {
        token: this.$store.state.login.token,
        groupBuyType: 1,
        orderId: this.orderId,
        // orderId: 239,
        mktGroupBuyId: this.mktGroupBuyId,
        // mktGroupBuyId: 82
      };
      this.$http
        .post("/app/json/app_fight_group_order/detail", paramsData)
        .then((res) => {
          let data = res.data;
          this.$Loading.close();
          if (data.status == 0) {
            this.groupDetail = data.data;
            let arr = this.groupDetail.orderItemList;
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].userId == this.$store.state.userInfo.userId) {
                this.myGroupDetail = arr[i];
                break;
              }
            }
            this.loaded = true;

            console.log(
              this.$store.state.userInfo.userId,
              this.groupDetail.leaderUserId
            );

            if (this.groupDetail.state != "9") {
              // 一定是支付成功了再进来的，如果没有明确的失败信息就是成功了。因为服务器成功状态的不确定性
              if (this.formPaySuccess == "1") {
                if (this.groupDetail.state == 10) {
                  this.successType = 3;
                } else if (
                  this.$store.state.userInfo.userId ==
                  this.groupDetail.leaderUserId
                ) {
                  this.successType = 1;
                } else {
                  this.successType = 2;
                }
                this.groupDetail.state = "2";
                this.isGroupSuccess = true;
              }
            }

            if (
              this.$store.state.webtype == 2 ||
              this.$store.state.webtype == 3
            ) {
              this.setWxShareArgs();
            }
            // if (this.myTimeout) {
            //   clearTimeout(this.myTimeout);
            //   this.myTimeout = null
            // }
            // if (this.groupDetail.state == '2' || this.groupDetail.state == '4') {
            //   if (this.groupDetail.state == '2') {
            //     this.isGroupSuccess = true
            //   }
            //   this.loadTimes ++;
            //   if (this.loadTimes >= 5) {
            //     return ;
            //   }
            //   this.myTimeout = setTimeout(() => {
            //     this.queryGroupDetail();
            //   }, 1000)
            // }
          } else {
            this.$Toast(data.info);
          }
        });
    },
    queryAll() {
      // 暂时用来 获取id的
      this.$Loading.open();
      let paramsData = {
        token: this.$store.state.login.token,
      };
      this.$http
        .post("/app/json/app_fight_group_order/queryAll", paramsData)
        .then((res) => {
          let data = res.data;
          if (data.status == 0) {
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
        });
    },
    showagreement() {
      this.$request
        .post("/app/json/news/getNewsList", { values: 20 })
        .then((res) => {
          if (res.status == 0) {
            Dialog.alert({
              title: res.data[0].title,
              message: res.data[0].content,
            }).then(() => {
              // on close
            });
          }
        });
    },
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.group-detail-container {
  .group-detail {
    padding: 8px;
    background: url('./image/group_bg_bottom.png') no-repeat;
    background-size: 100% 100%;

    .info {
      border-radius: 5px;
      padding: 11px;
      background: #fff;
    }

    .pro-info {
      overflow: hidden;
      padding-bottom: 10px;
    }

    .media-object {
      width: 90px;
      height: 90px;
      float: left;
    }

    .media-content {
      overflow: hidden;
      padding-left: 8px;
      position: relative;

      .name {
        font-size: 15px;
        line-height: 19px;

        .group-num {
          font-size: 10px;
          border: 0.5px solid $color-theme-r;
          color: $color-theme-r;
          padding: 0 6px;
          border-radius: 20px;
          float: left;
          line-height: 14px;
          display: inline-block;
          margin-right: 6px;
        }
      }

      .price-wrapper {
        padding-top: 10px;
        color: $color-theme-r;

        .price {
          font-size: 20px;
        }

        .unit {
          display: inline-block;
          margin-right: -2px;
          font-size: 12px;
        }

        .line-through {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

.group-state {
  bdr-t();
  padding: 10px;
  text-align: center;

  .state-msg {
    font-size: 16px;
    padding-bottom: 10px;
  }

  .state-sub-msg {
    padding-bottom: 10px;

    .text {
      vertical-align: middle;
    }

    .count-down {
      align-items: center;
      display: inline-block;
      vertical-align: middle;

      .count-down-con {
        justify-content: flex-start;
      }

      .text {
        flex-shrink: 0;
        font-size: 12px;
      }
    }
  }

  .btn {
    color: #fff;
    background: $color-theme-r;
    border-radius: 30px;
    padding: 10px;
    font-size: 16px;
    font-weight: 500;
    width: 80%;
    display: block;
    margin: 0 auto;
  }

  .btn-2 {
    color: $color-theme-r;
    border-radius: 30px;
    border: 1px solid $color-theme-r;
    padding: 9px;
    font-size: 16px;
    font-weight: 500;
    width: 80%;
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
}

.member-list {
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;

  .member-item {
    width: 20%;
    float: left;
    padding: 0 10px;
    flex-shrink: 0;
    box-sizing: border-box;

    .member-avatar-wrapper {
      position: relative;

      .tit {
        position: absolute;
        left: 50%;
        display: inline-block;
        transform: translateX(-50%) scale(0.9);
        bottom: 0;
        font-size: 10px;
        color: #fff;
        background: $color-theme-r;
        padding: 4px 6px;
        border-radius: 15px;
        width: 88%;
        text-align: center;
      }
    }

    .member-avatar {
      width: 100%;
      padding-bottom: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: #e0e0e0;
      position: relative;

      .img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .member-name {
      padding-top: 3px;
      text-align: center;
      font-size: 12px;
    }
  }
}

.group-process {
  padding: 15px;

  .group-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;

    .rule {
      color: $color-theme-r;
    }
  }

  .group-process-content {
    background: #fefaf9;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    justify-content: space-between;

    .group-process-item {
      flex: 1;
      text-align: center;
      position: relative;

      & + .group-process-item {
        &:after {
          content: '';
          position: absolute;
          top: 30px;
          width: 50%;
          background: #fff1d8;
          height: 1px;
          left: -25%;
        }
      }

      .img {
        width: 30px;
      }

      .text {
        padding-top: 6px;
        font-size: 12px;
      }
    }
  }
}

>>>.stateBox {
  z-index: 2001;
  width: 80%;
  text-align: center;
  font-size: 16px;
  color: white;
  top: 200px;

  img {
    width: 80px;
    margin: 0 0 15px 160px;
  }
}

>>>.van-popup {
  background: transparent;
}

>>>.van-overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
