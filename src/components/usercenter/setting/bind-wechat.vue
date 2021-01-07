/**Created by steven on 2018/11/20.*/

<template>
  <div class="bind-wechat login2">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content>
      <div class="wechat">
        <div class="warm-prompt mine-box-shodow">
          <h2 class="warm-title">温馨提示</h2>
          <p class="unorder">1.销售APP账号与微信号需互相唯一；</p>
          <p class="unorder">2.当前账号绑定新微信需先解绑当前账号；</p>
          <p class="unorder">3.如微信号已绑定另外账号，需回原账号解绑.。</p>
        </div>
        <div class="bind-warp">
          <div class="bind-logo">
            <img src="static/image/setting/bindwechat.png"/>
          </div>
          <p class="bound" v-if="bindType == 1">已绑定账号:<span class="chart-name">{{wechatInfo.wxNickName}}</span></p>
        </div>
        <div class="common-btn theme_bg_red theme_font_white mt100" v-if="bindType != -1" @click="wechatOp">{{bindType
          == 2?'马上绑定微信':'解绑微信'}}
        </div>
      </div>
    </nav-content>


  </div>
</template>

<script>

  export default {
    name: "setting",
    components: {},
    data() {
      return {
        wechatInfo: null,
        bindType: -1,  // -1未知   1 已绑定微信 2未绑定微信
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },

      wechatOp: function () {

        if (this.bindType == 2) {
          this.$bridgefunc.wxAuth((codeStr) => {
            if (codeStr == '') {
              this.$Toast('微信授权失败');
            } else {
              this.wxLogin(codeStr)
            }
          });
        } else if (this.bindType == 1) {
          this.unBindWechat();
        }

      },
      unBindWechat: function () {
        this.$Loading.open()
        let url = '/app/json/user/unBindThirdUser';
        let params1 = {
          token: this.$store.state.login.token,
          regChannel:5
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.$Toast('解绑成功');
            this.bindType = 2;
          } else {
            this.$Toast(data.info);
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },

      wxLogin: function (codeStr) {
        this.$Loading.open();
        let url = '/app/json/user/getWechatThirdId';
        let paramsData = {
          code: codeStr,
          token: this.$store.state.login.token,
        };
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {//去绑定或者快速注册
              let authDic = {};
              authDic.user_id = data.data;
              authDic.auth_code = codeStr;
              this.bind(authDic);
            } else {
              this.$Toast(data.info);
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      bind: function (authDic) {
        this.$router.push({
          path: '/usercenter/bindphone',
          isnativetop: '1',
          query: {
            thirdUserId: authDic.user_id,
            code: authDic.auth_code,
            regChannel: '3',
            bindType:3
          }
        })
      },

      getWechatInfo: function () {
        this.$Loading.open()
        let url = '/app/json/user/getWechatUserInfo';
        let params1 = {
          token: this.$store.state.login.token,
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.wechatInfo = data.data;
            this.bindType = 1;
          } else {
            if (data.errorCode == 1037) {//去绑定或者快速注册
              this.bindType = 2;
            } else {
              this.$Toast(data.info);
              this.bindType = -1;
            }
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
    },
    created() {
      this.getWechatInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "../css/usercenter.styl"

  .bind-wechat {
    width 100%
    height 100%
    overflow hidden;
    .wechat {
      padding: 0px 10px;
      .warm-prompt {
        padding: 10px 10px;
        border-radius: 5px;
        .warm-title {
          font-size: $font-size-medium;
          color: #333;
          font-weight: 600;
          padding: 10px 0px;
        }
        .unorder {
          font-size: $font-size-small;
          color: #333;
          padding: 5px 0px;
        }
      }
      .bind-warp {
        padding-top: 68px;
        .bind-logo {
          width: 100%;
          text-align: center;
          img {
            display inline-block;
            width: 50px;
            height: 49px;
          }
        }
        .bound {
          margin-top: 40px;
          text-align: center
          font-size: $font-size-small;
          color: #666;
          .chart-name {
            display: inline-block;
            font-size: $font-size-medium;
            color: #333;
            font-weight: 600;
          }
        }
      }
      .mt100 {
        margin-top: 15px;
      }
    }
  }

</style>
