<template>
  <div class="friend-class">
    <div class="logo-class">
      <img src="../image/logo.png"/>
      <span>中石油河北销售公司</span>
    </div>
    <div style="text-align:center;margin-top: 10px">
      <van-image v-if="(!secondStatus)&&pinSuccess==0"
                 width="50px"
                 height="50px"
                 fit="contain"
                 src="../image/group/u309.png"/>
      <h3 v-if="!secondStatus&&pinSuccess==0"
          style="font-size:20px">发起成功</h3>
      <h3 v-if="pinSuccess==1"
          style="font-size:20px">拼团成功</h3>
      <h3 v-if="pinSuccess==2"
          style="font-size:20px">拼团失败</h3>
    </div>
    <div style="text-align: center;margin-top: 10px;">
      <van-image width="100%"
                 height="auto"
                 :src="homeBackgroundImage"/>
    </div>
    <div style="margin-top: 15px;">{{desc}}</div>
    <div style="width:80%; margin-top: 15px; text-align:center">
      <div style=" width:33.33333% ;float:left;"
           v-for="(item,index) in listTemp"
           :key="index">
        <van-icon v-if="!item.id"
                  name="add-o"
                  size="55"
                  color="#FFDBA6"/>
        <van-image v-else
                   round
                   width="50px"
                   height="50px"
                   :src="item.avtUrl?item.avtUrl:avtUrldef"/>
      </div>
    </div>
    <div style="clear:both"></div>
    <div style=" width:80%; text-align:center">
      <div v-if="pinSuccess==0"
           style="text-align:center;padding-top:10px">
        <span style
              v-if="true">还需邀请{{pNum}}位即可获得优惠券！继续加油哦</span>
      </div>
      <div v-if="pinSuccess==1"
           style="text-align:center;margin-top:10px ; color:red;">
        <div style="text-align: center;">
          <van-image round
                     width="86px"
                     height="86px"
                     style="margin-top:-90px; position: absolute;margin-left: -15%; "
                     :src="groupSuccessImage"></van-image>

        </div>
        <div style="margin-top:50px">
          <span>{{successDes}}</span>
        </div>
      </div>
      <div v-if="pinSuccess==2"
           style="text-align:center;margin-top:10px ; color:red;">
        <div style="text-align: center;">
          <van-image width="86px"
                     height="86px"
                     style="margin-top:-90px; position: absolute; margin-left: -15%;"
                     :src="groupFailIcon"></van-image>

        </div>
        <div style="margin-top:50px"></div>
      </div>
    </div>
    <div v-if="pinSuccess==0">
      <div style="text-align: center; margin-top: 15px;"
           v-if="!friend">
        <van-image width="115px"
                   height="45px"
                   @click="shareImg"
                   :src="initiateButtonImage"></van-image>
      </div>
    </div>
    <div v-if="pinSuccess==1">
      <div style="text-align: center; margin-top: 15px;">
        <van-image width="120px"
                   height="45px"
                   @click="pinCilck"
                   :src="groupSuccessBtn"></van-image>
      </div>
    </div>
    <div v-if="pinSuccess==2">
      <div style="text-align: center; margin-top: 15px;">
        <van-image width="120px"
                   height="45px"
                   @click="againCilck"
                   :src="groupFailBtn"></van-image>
      </div>
    </div>
    <div style="font-weight:900;padding-top:10px;align-self: flex-start">拼团活动规则</div>
    <div style="margin-top:5px">
      <div v-html="activityDesc"
           style="line-height:20px;"></div>
    </div>
    <van-popup v-model="shareShow"
               position="top"
               :style="{ height: '30%' }">
      <van-image width="100%"
                 style=" "
                 :src="shareImage"></van-image>
    </van-popup>
  </div>
</template>

<script>
  // import wx from 'weixin-js-sdk'
  import Vue from 'vue';
  import {Image as VanImage, Popup} from 'vant';
  import wxfunc from "../../../../utils/wxfunc";

  Vue.use(VanImage).use(Popup);
  import avtdef from "../image/group/90.png"

  export default {
    data() {
      return {
        needUser: '3',//拼团人数
        friend: false,//判断自己还是好友助力
        desc: '点击右上角分享链接给好友，邀请好友为你助力！',
        activityDesc: '',
        homeBackgroundImage: '',
        buddyBackgroundImage: '',
        initiateButtonImage: '',//邀请好友按钮图
        groupFailBtn: '',//重新发起按钮图
        groupFailIcon: '',
        avtUrldef: avtdef,//默认头像
        listTemp: [],
        shareShow: false,
        shareImage: '',
        activityNo: '',
        pNum: '3',
        message: 'qwe',
        show: false,
        pinSuccess: '0',//判断拼团是否成功  0-拼团中，1-成功，2-失败
        successDes: '',
        groupSuccessImage: '',
        orderNo: '',
        shareDesc: "拼团送券分享描述",
        shareIcon: "",
        shareImage: "",
        shareTitle: "拼团送券分享标题",
        secondStatus: 'false', //判断是不是第二次进入
        groupSuccessBtn: '',

      }
    },
    methods: {

      //获取活动详情
      handelName() {
        let list = [{
          activityId: 3,
          avtUrl: "",
          id: '',
          idLong: '',
          inAppId: null,
          joinTime: "2020-03-17 16:21:37",
          limitStart: null,
          listIndex: 0,
          nickName: "H",
          objectId: null,
          orderId: 8,
          userId: "646795",
          userPhone: "18502976290"
        }]


        if (!this.orderNo) {
          this.orderNo = this.$util.getUrlParam(window.location.href, "orderNo");
        }

        if (!this.$store.state.login.token) {
          let token = this.$util.getUrlParam(window.location.href, "token");
          this.$store.commit("setToken", token);
        }
        this.$http.post(
          '/platform/json/group_buy/getGroupOrderByNo',
          {
            orderNo: this.orderNo,
            token: this.$store.state.login.token
          }
        )
          .then(res => {
            if (res.data.status == 0) {
              if (res.data.data.status == 0) {
                this.homeBackgroundImage = res.data.data.groupActivity.initiateBackgroundImage
              } else if (res.data.data.status == 1) {
                this.homeBackgroundImage = res.data.data.groupActivity.groupSuccessImage
              } else if (res.data.data.status == 2) {
                this.homeBackgroundImage = res.data.data.groupActivity.groupFailImage
              }

              this.initiateButtonImage = res.data.data.groupActivity.initiateButtonImage
              this.groupSuccessImage = res.data.data.groupActivity.groupSuccessIcon
              this.shareImage = res.data.data.groupActivity.shareImage
              this.groupFailBtn = res.data.data.groupActivity.groupFailBtn
              this.pinSuccess = res.data.data.status
              this.activityNo = res.data.data.groupActivity.activityNo
              this.activityDesc = res.data.data.groupActivity.activityDesc
              this.needUser = res.data.data.groupActivity.needUser
              this.successDes = res.data.data.groupActivity.groupSuccessMsg
              this.pNum = res.data.data.groupActivity.needUser - res.data.data.memberVoList.length
              this.groupFailIcon = res.data.data.groupActivity.groupFailIcon
              this.shareDesc = res.data.data.groupActivity.shareDesc
              this.shareIcon = res.data.data.groupActivity.shareIcon
              this.shareImage = res.data.data.groupActivity.shareImage
              this.shareTitle = res.data.data.groupActivity.shareTitle
              this.groupSuccessBtn = res.data.data.groupActivity.groupSuccessBtn
              for (let i = 0; i < this.needUser; i++) {
                if (i < res.data.data.memberVoList.length) {
                  this.listTemp.push(res.data.data.memberVoList[i]);
                } else {
                  this.listTemp.push(list[0]);
                }
              }
              this.setShareConfig()
              // this.shareImg();
            } else {
              this.$Toast({
                message: res.data.info,
                position: "bottom",
                duration: 2000
              });
            }
          });

      },
      pinCilck() {
        // this.$http.post(
        //   '/platform/json/group_buy/StartGroup',
        //   {          activityNo: this.activityNo,
        //     token: this.$store.state.login.token        })
        //   .then(res => {
        //     if (res.status == 200) {
        //       if (res.data.status == 0) {
        //         this.$router.push({
        //           path: '/groupInvite',
        //           name: '邀请好友',
        //           query: {
        //             orderNo: res.data.data,
        //           }
        //         })
        //       } else {
        //         this.$Toast({
        //           message: res.data.info,
        //           position: "bottom",
        //           duration: 2000
        //         });
        //       }
        //
        //
        //     }
        //   });
        this.$router.push({
          path: '/groupIndex',
          name: '拼团',
          query: {
            activityNo: this.activityNo,
            isgetLastOredr: true
          }
        })

      },
      againCilck() {
        this.$router.push({
          path: '/groupIndex',
          name: '拼团',
          query: {
            activityNo: this.activityNo,
            isgetLastOredr: true
          }
        })
      },
      getSign(signUrl) {
        let _this = this
        return new Promise((resolve, reject) => {

          let url = "/platform/json/weixin_ticket/shareSign"
          let pram = {
            url: signUrl,
          }
          _this.$http.post(url, pram).then(
            res => {
              if (res.data.status == '0') {
                resolve(res.data.data)
              } else {
                reject()
              }
            }, error => {
              reject()
            })
        })
      },
      setShareConfig() {//分享
        let _this = this
        let shareLink = `${window.location.origin}/app/we_chat/goPage?redirectUrl=` + `${encodeURIComponent(window.location.origin + '/app-vue/app/#/groupHelp?orderNo=' + _this.orderNo)}`;
        console.log(JSON.stringify({
          title: _this.shareTitle,
          path: shareLink,
          imageUrl: _this.shareIcon,
          rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
        }))
        wxfunc.wxmpShare({
          title: _this.shareTitle,
          path: shareLink,
          imageUrl: _this.shareIcon,
          rfrCode: this.$store.state.userInfo ? this.$store.state.userInfo.userId : ''
        })
      },
      shareImg() {
        this.shareShow = true
      },
      helpFriend() {
        this.show = true;
      },
      showPopup() {
        this.show = true;
      }

    },
    created() {

      let secondStatus = this.$util.getUrlParam(window.location.href, "secondStatus");
      this.orderNo = this.$util.getUrlParam(window.location.href, "orderNo");
      if (this.$store.state.login.token) {
        if (secondStatus) {
          this.secondStatus = secondStatus
        } else {
          this.secondStatus = false
        }
        this.handelName()
      } else {
        // 路由 参数   redirectRouter代表需要跳转的路由
        let redrectUrl = window.location.origin + window.location.pathname + "#/groupInvite?orderNo=" + this.orderNo
        if (secondStatus) {
          redrectUrl + "&secondStatus=" + secondStatus
        }
        let gopageUrl = `${window.location.origin}/app/we_chat/goPage?redirectUrl=${encodeURIComponent(redrectUrl)}`
        window.location.href = gopageUrl
      }

    },
    components: {}
  }

</script>

<style type="text/stylus" lang="stylus" scoped>
  .friend-class {
    width 100%
    display flex
    flex-direction column
    align-items center
    padding 0 10px
    overflow scroll

    .logo-class {
      display flex
      margin-top 20px
      flex-direction row
      align-self flex-start
      justify-content center
      line-height 40px

      img {
        width 38px
        height 38px
      }
      span {
        margin-left 10px
        font-size $font-size-medium
      }
    }

    span {
      font-size $font-size-medium
    }
  }
</style>
