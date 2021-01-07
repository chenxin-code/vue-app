/**Created by liaoyingchao on 2018/12/29.*/

<template>
  <div class="my-center-header">
    <div class="top-div-1" :style="{height: `${this.barHeight + 44}px`}" v-if="headerData.styleTempl == 7">
      <div style="line-height: 44px;position: absolute;left: 100px;right: 100px;
bottom: 0px;height: 44px;font-size: 18px;text-align: center;color: #fff;">会员中心</div>
    </div>
    <div class="top-div" :style="topDivStyle" v-else>
      <div class="header-div" :style="getTopPaddingStyle()" v-show="scrollSite > 60">
        <img :src="headImg">
      </div>
      <div style="line-height: 44px;position: absolute;left: 100px;right: 100px;
bottom: 0px;height: 44px;font-size: 18px;text-align: center;color: #fff;">我的</div>
    </div>
    <div class="right-btns" :style="getTopMarginStyle()" v-if="headerData.styleTempl == '5'">
      <div class="btn-div" :class="hotareaClass({idCode: headerData.idCode + 'toMessage'})" @click.stop="hotEvent('toMessage');toMessage()" v-if="headerData.hasMessageBtn">
        <p class="msg-div" v-if="$store.state.indexData.msgNumber > 0">{{$store.state.indexData.msgNumber}}</p>
        <img src="static/images/mycenter/message_1.png"/>
      </div>
      <div class="btn-div" :class="hotareaClass({idCode: headerData.idCode + 'toSetting'})" @click.stop="hotEvent('toSetting');toSetting()" v-if="headerData.hasSettingBtn">
        <img src="static/images/mycenter/setting_1.png"/>
      </div>
    </div>
    <div class="right-btns" :style="getTopMarginStyle()" v-else>
      <div class="btn-div" :class="hotareaClass({idCode: headerData.idCode + 'toSetting'})" @click.stop="hotEvent('toSetting');toSetting()" v-if="headerData.hasSettingBtn">
        <img src="static/images/mycenter/setting.png"/>
      </div>
      <div class="btn-div" :class="hotareaClass({idCode: headerData.idCode + 'toMessage'})" @click.stop="hotEvent('toMessage');toMessage()" v-if="headerData.hasMessageBtn">
        <p class="msg-div" v-if="$store.state.indexData.msgNumber > 0">{{$store.state.indexData.msgNumber}}</p>
        <img src="static/images/mycenter/message.png"/>
      </div>
      <div class="btn-div" :class="hotareaClass({idCode: headerData.idCode + 'toMyQrcode'})" @click.stop="hotEvent('toMyQrcode');toMyQrcode()" v-if="headerData.hasMemberCode">
        <img src="static/images/mycenter/qrcode.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "my-center-header",
    components: {},
    props: ['barHeight', 'scrollSite', 'headerData'],
    mixins: [hee],
    data() {
      return {
        topDivStyle: 'height: 64px;opacity: 0;',
      }
    },
    watch: {
      'scrollSite' : function(val, oldVal) {
        if (val > 60) {
          let h = this.barHeight + 44;
          this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + 1 + ';' + 'background-color:' + this.headerData.topBgColor + ';'
        } else {
          let harf = val / 60;
          let h = this.barHeight + 44;
          this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + harf + ';' + 'background-color:' + this.headerData.topBgColor + ';'
        }
      }
    },
    computed: {
      headImg() {
        if (this.$store.state.userInfo.headImg && this.$store.state.userInfo.headImg != 'undefined' && this.$store.state.userInfo.headImg != 'null') {
          return this.$store.state.userInfo.headImg
        } else {
          return this.headerData.headImg
        }
      },
      titleStr () {
        if (this.headerData.styleTempl == 7) {
          return '会员中心'
        } else {
          return '我的'
        }
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.headerData.pgCode, this.headerData.idCode + eKey)
      },
      getFloatTop: function () {
        if (this.usePorpData == true) {
          return 'top: 50px;'
        }
        return ''
      },
      toMessage: function () {
        this.$market.showMsg();
      },
      toSetting: function () {
        this.$market.customPush({
          path: '/usercenter/setting',
        })
      },
      toMyQrcode: function () {
        if (this.headerData.memberCodeType == 2) {
          // 员工邀请预注册
          this.$market.customPush({
            path: '/usercenter/myqrcode?isPreRegiste=true',
          })
        } else if (this.headerData.memberCodeType == 3) {
          // 员工邀请注册
          this.$market.customPush({
            path: '/usercenter/myqrcode?isToRegiste=true',
          })
        } else if (this.headerData.memberCodeType == 4) {
          // 海信会员码
          this.$market.customPush({
            path: '/usercenter/hx-qrcode',
          })
        } else {
          // 会员码
          this.$market.customPush({
            path: '/usercenter/myqrcode',
          })
        }
      },
      getTopPaddingStyle: function() {
        let styleStr = ''
        if(this.barHeight){
          styleStr += "paddingTop: " + this.barHeight + "px;"
        }
        return styleStr
      },
      getTopMarginStyle: function() {
        let styleStr = ''
        if(this.barHeight){
          styleStr += "marginTop: " + this.barHeight + "px;"
        }
        return styleStr
      },
      getMessageNumber: function () {
        if (!this.$store.state.login.token) {
          return ;
        }
        let url = this.$market.apiBaseURL() + '/app/json/message/getUnreadMsgCnt';
        let paramsData = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              this.$store.state.indexData.msgNumber = data.data
              this.$bridgefunc.vuexStorage()
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      if (!this.headerData.topBgColor || this.headerData.topBgColor == null || this.headerData.topBgColor == undefined) {
        this.headerData.topBgColor = '#CF2B3A'
      }
      if (this.headerData.hasMessageBtn) {
        this.getMessageNumber();
      }
      let h = this.barHeight + 44;
      this.topDivStyle = 'height: ' + h + 'px; ' + 'opacity: ' + 0 + ';' + 'background-color:' + this.headerData.topBgColor + ';'
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-center-header {
    position absolute;
    top 0px;
    left 0px;
    right 0px;
    overflow hidden;
    z-index 99;

    .top-div {
      background-color #F63A3C;
      .header-div {
        overflow hidden;
        img {
          margin-top 5px;
          margin-left 10px;
          overflow hidden;
          display block;
          width 34px;
          height 34px;
          border-radius 17px;
        }
      }
      &.top-bg-color-1 {
        background-color #CF2B3A;
      }
    }
    .top-div-1 {
      background-color #29263C;
    }
    .right-btns {
      position absolute;
      bottom 0px;
      right 8px;
      display flex;
      align-items center;
      .btn-div {
        position relative;
        padding 12px 6px;
        img {
          display block;
          width 20px;
          height 20px;
        }
        .msg-div {
          position absolute;
          right 0px;
          top 3px;
          min-width 18px;
          font-size 10px;
          padding 2px 3px;
          border-radius 10px;
          background-color white;
          text-align center;
          color red;
        }
      }
    }
  }
</style>
