<template>
  <div class="friend-class">
    <div v-show="actValid">
      <div>
        <van-image width="100%"
                   height="auto"
                   fit="contain"
                   :src="homeBackgroundImage" />
      </div>
      <div style="text-align: center;display: flex;">
        <div v-if="threeUserActNo" style="width:50%;margin:0 auto;padding:3px">
          <van-image width="100%"
                     height="auto"
                     @click="threePin"
                     fit="contain"
                     :src="threepin" />
        </div>

        <div v-if="fiveUserActNo" style="width:50%;margin:0 auto;padding:3px">
          <van-image width="100%"
                     height="auto"
                     fit="contain"
                     @click="fivePin"
                     :src="fivepin" />
        </div>
      </div>
      <div style="clear:both"></div>
      <div style="font-weight:900;padding:5px 10px;align-self: flex-start">拼团活动规则</div>
      <div style="margin-top:5px;padding: 0 10px">
        <div v-html="activityDesc"
             style="line-height:20px;"></div>
      </div>
    </div>
    <div v-show="!actValid"
         style="margin-top: 50%;color: #4100ff;font-size: 19px;"
    >
      {{ errorInfo }}
    </div>
  </div>
</template>

<script>
  import threepin from "../image/group/threepin.png"
  import fivepin from "../image/group/fivepin.png"
  import Vue from 'vue';
  import {Image as VanImage, Popup} from 'vant';

  Vue.use(VanImage).use(Popup);
  export default {

    data () {
      return {
        threepin: threepin,
        fivepin: fivepin,
        actValid: true,
        errorInfo: '活动暂未开启，敬请期待！',
        desc: '邀请好友，（共同战役，成功邀请三位好友拼团，即可获取加油券）',
        activityDesc: '',
        homeBackgroundImage: '',
        activityNo: '',
        threeUserActNo: '',
        fiveUserActNo: '',
      }
    },
    methods: {

      handelName () {
        if (!this.activityNo) {
          this.activityNo = this.$util.getUrlParam( window.location.href,"activityNo");
        }
        this.$http.post(
          '/platform/json/group_buy/getGroupActivityByNo',
          {
            activityNo: this.activityNo
          })
          .then(res => {
            if (res.status == 200) {
              if (res.data.status == 0) {
                this.activityNo = res.data.data.activityNo
                this.threeUserActNo = res.data.data.threeUserActNo
                this.activityDesc = res.data.data.activityDesc
                this.fiveUserActNo = res.data.data.fiveUserActNo
                this.homeBackgroundImage = res.data.data.homeBackgroundImage
              } else {
                this.actValid = false;
                this.errorInfo = res.data.info;
                // this.$Toast({
                //   message: res.data.info,
                //   position: "bottom",
                //   duration: 2000
                // });
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
      threePin () {
        this.$http.post(
          '/platform/json/group_buy/StartGroup',
          {          activityNo: this.threeUserActNo,
            token: this.$store.state.login.token
          })
          .then(res => {
            if (res.status == 200) {
              if (res.data.status == 0) {
                this.$router.push({
                  path: '/groupInvite',
                  name: '邀请好友',
                  query: {
                    orderNo: res.data.data,
                    activityNo: this.activityNo
                  }
                })
              } else {
                this.$Toast({
                  message: res.data.info,
                  position: "bottom",
                  duration: 2000
                });

              }
            }
          });
      },
      fivePin () {
        this.$http.post(
          '/platform/json/group_buy/StartGroup',
          {          activityNo: this.fiveUserActNo,
            token: this.$store.state.login.token        })
          .then(res => {
            if (res.status == 200) {
              if (res.data.status == 0) {
                this.$router.push({
                  path: '/groupInvite',
                  name: '邀请好友',
                  query: {
                    orderNo: res.data.data,
                    activityNo: this.activityNo
                  }
                })
              } else {
                this.$Toast({
                  message: res.data.info,
                  position: "bottom",
                  duration: 2000
                });
              }


            }
          });
      },

    },
    created () {
      this.activityNo = this.$util.getUrlParam(window.location.href,"activityNo");
      let isgetLastOredr = this.$util.getUrlParam(window.location.href,"isgetLastOredr");
      let token = this.$util.getUrlParam( window.location.href,"token");
      let tokenS = this.$store.state.login.token;
      if (token || tokenS) {
        if(!tokenS){
          this.$store.commit("setToken", token);
        }
        if (!isgetLastOredr) {
          this.$http.post(
            '/platform/json/group_buy/getLastOrder', { activityNo: this.activityNo, token: this.$store.state.login.token }).then(res => {
            if (res.data.data) {
              this.$router.push({
                path: '/groupInvite',
                name: '邀请好友',
                query: {
                  orderNo: res.data.data.orderNo,
                  secondStatus: false
                }
              })

            } else {
              this.handelName()
            }
          })
        } else {
          this.handelName()
        }
      }else{
        // 路由 参数   redirectRouter代表需要跳转的路由
        let redrectUrl = window.location.origin + window.location.pathname + "#/groupIndex?activityNo="+this.activityNo
        let gopageUrl = `${window.location.origin}/app/we_chat/goPage?redirectUrl=${encodeURIComponent(redrectUrl)}`
        window.location.href = gopageUrl
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" scoped>
  .friend-class
    width 100%
    display flex
    flex-direction column
    align-items center
    overflow scroll
    .logo-class
      display flex
      margin-top 20px
      flex-direction row
      align-self flex-start
      justify-content center
      line-height 40px
      img
        width 38px
        height 38px
      span
        margin-left 10px
        font-size $font-size-medium
    span
      font-size $font-size-medium
</style>
