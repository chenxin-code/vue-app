<template>
  <div class="friend-class">
    <div class="logo-class">
      <img src="../image/logo.png"/>
      <span>中石油河北销售公司</span>
    </div>
    <div style="text-align:center;margin-top: 10px">
      <h3 v-if="friend"
          style="font-size:20px">帮好友助力</h3>
      <h3 v-if="false"
          style="font-size:20px">发起成功</h3>
      <h3 v-if="false"
          style="font-size:20px">拼团成功</h3>
      <h3 v-if="false"
          style="font-size:20px">拼团失败</h3>
    </div>
    <div style="text-align: center;margin-top: 10px;">
      <van-image width="100%"
                 height="auto"
                 :src="buddyBackgroundImage"/>
    </div>
    <div style="margin-top: 15px">{{desc}}</div>
    <div style="width:80% ;margin-top: 15px; text-align:center">
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
    <div style="text-align: center; margin-top: 15px;"
         v-if="friend">
      <van-image width="120px"
                 height="45px"
                 @click="helpFriend"
                 :src="buddyButtonImage"></van-image>
      <van-image width="120px"
                 height="45px"
                 style="margin-left:10px"
                 @click="Ipin"
                 :src="buddyGroupImage"></van-image>
    </div>

    <div style="font-weight:900;padding-top:10px;align-self: flex-start">拼团活动规则</div>
    <div style="margin-top:5px">
      <div v-html="activityDesc"
           style="line-height:20px;"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Image as VanImage, Popup} from 'vant';

  Vue.use(VanImage).use(Popup);
  import config from '@/api/config'
  // import wx from "weixin-js-sdk";
  import avtdef from "../image/group/90.png"
  import wxfunc from "../../../../utils/wxfunc";

  export default {
    data() {
      return {
        needUser: '3',//拼团人数
        friend: true,//判断自己还是好友助力
        activityNo: '',
        desc: '参与成功，你可以点击链接或者分享海报给好友，邀请参加！',
        activityDesc: '',
        homeBackgroundImage: '',
        buddyButtonImage: '',//帮助好友助力按钮图
        buddyGroupImage: '', //我也要拼团按钮
        groupFailIcon: '',
        buddyBackgroundImage: '',
        avtUrldef: avtdef,//默认头像
        listTemp: [],
        pNum: '3',
        show: false,
        pinSuccess: '0',//判断拼团是否成功  0-拼团中，1-成功，2-失败
        successDes: '',
        helpFailureMsg: "本周机会已用完，请下周再来！",
        helpSuccessMsg: "助力成功！您页可以发起拼团，领取优惠券！",
        buddyHelpMsg: '',
        orderNo: '',
        fshow: false,
        sshow: false,
        shareDesc: "拼团送券分享描述",
        shareIcon: "",
        shareTitle: "拼团送券分享标题",
        shareImage: '',
      }
    },
    methods: {
      //获取活动详情
      handelName() {
        let list = [{
          activityId: 3,
          avtUrl: "",
          id: '',
          idLong: 21,
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
        if (!this.$store.state.login.token) {
          let token = this.$util.getUrlParam(window.location.href, "token");
          this.$store.commit("setToken", token);
        }
        if (!this.orderNo) {
          this.orderNo = this.$util.getUrlParam(window.location.href, "orderNo");
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
              if (res.data.data.initiator) {
                this.$router.push({
                  path: '/groupInvite',
                  name: '邀请好友',
                  query: {
                    orderNo: this.orderNo,
                    secondStatus: false
                  }
                })
              } else {
                this.helpSuccessMsg = res.data.data.groupActivity.helpSuccessMsg
                this.helpFailureMsg = res.data.data.groupActivity.helpFailureMsg
                this.buddyHelpMsg = res.data.data.groupActivity.buddyHelpMsg
                this.activityNo = res.data.data.groupActivity.activityNo
                this.activityDesc = res.data.data.groupActivity.activityDesc
                this.buddyBackgroundImage = res.data.data.groupActivity.buddyBackgroundImage
                this.homeBackgroundImage = res.data.data.groupActivity.homeBackgroundImage
                this.buddyButtonImage = res.data.data.groupActivity.buddyButtonImage
                this.buddyGroupImage = res.data.data.groupActivity.buddyGroupImage
                this.pinSuccess = '5'
                this.needUser = res.data.data.groupActivity.needUser
                this.successDes = res.data.data.groupActivity.groupSuccessMsg
                this.pNum = res.data.data.groupActivity.needUser - res.data.data.memberVoList.length
                this.groupFailIcon = res.data.data.groupActivity.groupFailIcon
                this.shareDesc = res.data.data.groupActivity.shareDesc
                this.shareIcon = res.data.data.groupActivity.shareIcon
                this.shareImage = res.data.data.groupActivity.shareImage
                this.shareTitle = res.data.data.groupActivity.shareTitle
                for (let i = 0; i < this.needUser; i++) {
                  if (i < res.data.data.memberVoList.length) {
                    this.listTemp.push(res.data.data.memberVoList[i]);
                  } else {
                    this.listTemp.push(list[0]);
                  }
                }
                this.setShareConfig()
              }
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

      },
      Ipin() {
        this.$router.push({
          path: '/groupIndex',
          name: '拼团',
          query: {
            activityNo: this.activityNo
          }
        })
      },
      helpFriend() {
        this.$MessageBox.confirm(this.buddyHelpMsg, '提示', {
          confirmButtonText: '助力'
        }).then(() => {
          this.yhelp();
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
      showPopup() {
        this.show = true;
      },
      yhelp() {
        if (!this.orderNo) {
          this.orderNo = this.$util.getUrlParam(window.location.href, "orderNo");
        }
        this.$http.post(
          '/platform/json/group_buy/joinGroup',
          {
            token: this.$store.state.login.token,
            orderNo: this.orderNo
          })
          .then(res => {
            if (res.data.status == 0) {
              this.listTemp = []
              this.handelName();
              this.$MessageBox.alert(this.helpSuccessMsg, '提示');
            } else {
              this.helpFailureMsg = res.data.info
              this.$MessageBox.alert(this.helpFailureMsg, '提示');

            }
          });
      }

    },
    created() {
      this.orderNo = this.$util.getUrlParam(window.location.href, "orderNo");
      if (!this.$store.state.login.token) {
        let token = this.$util.getUrlParam(window.location.href, "token");
        this.$store.commit("setToken", token);
      }
      if (this.$store.state.login.token) {
        this.handelName()
      } else {
        // 路由 参数   redirectRouter代表需要跳转的路由
        let redrectUrl = window.location.origin + window.location.pathname + "#/groupHelp?orderNo=" + this.orderNo

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
