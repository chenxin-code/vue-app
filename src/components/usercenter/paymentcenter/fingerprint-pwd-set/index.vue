<template>
  <div class="gestures-pwd-set">
    <nav-top title="指纹密码" @backEvent="backEvent"></nav-top>
    <nav-content class="gestures-pwd-set-container">
      <div class="table-view list">
        <div class="table-view-cell item">
          <div class="table-view-cell-text">
            <div class="left">指纹密码</div>
            <div class="right">
              <van-switch size="20px" @change="change" active-color="#F80F16" v-model="checked" />
            </div>
          </div>
        </div>
      </div>
      <!--        弹框 未设置指纹密码提示-->
<!--      <van-dialog-->
<!--        v-model="show"-->
<!--        title="提示"-->
<!--        @confirm="show = false"-->
<!--        confirmButtonText="知道了"-->
<!--      >-->
<!--        <div class="content">该手机尚未设置指纹，<br />请在手机系统设置内设置指纹！</div>-->
<!--      </van-dialog>-->
    </nav-content>
  </div>
</template>

<script>
  import DigitalPwd from '@/components/mall2/common/digital-pwd'
  import MD5 from '@/utils/md5.js'

  export default {
    data() {
      return {
        digitalPWD: '',
        fingerprintPayPwdState: '', // 0未设置支付密码 1支付密码已锁定 2已设置支付密码
        defaultPayPwdMode: '', // 默认开启的支付密码方式 11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
        checked: false,
        state: 0
      }
    },
    mounted() {
      /**
       * 0未设置支付密码 1支付密码已锁定 2已设置支付密码
       */
      this.defaultPayPwdMode = this.$route.query.defaultPayPwdMode
      this.fingerprintPayPwdState = this.$route.query.fingerprintPayPwdState
      this.checked = this.defaultPayPwdMode == 14 ? true : false
      this.state = this.defaultPayPwdMode == 14 ? 1 : 0
    },
    destroyed() {
      DigitalPwd.close()
    },
    methods: {
      backEvent() {
        this.$router.go(-1)
      },
      change() {
        // 切换开关
        if (this.state == 1) { // 去关闭
          this.closeUserSpecialPayPwd()
        } else { // 开启 、 设置

          if (this.fingerprintPayPwdState == 0) { // 去设置
            this.$bridgefunc.fingerPrintRe((result) => {
              if (result == '1') {
                this.setUserSpecialPayPwd(14)
              } else {
                this.checked = false
                this.$Toast('指纹识别失败')
              }
            })
          } else { // 2已设置 去开启
            DigitalPwd.open({
              initData: {
                payPwdState: 2,
                title: '开启指纹密码',
                tips: '请先输入6位数字支付密码已验证身份'
              },
              toSettingPwd: () => {
                this.$router.push({
                  path: '/usercenter/nosetpwd',
                  query: {
                    isSet: 2
                  }
                })
                DigitalPwd.close();
              },
              inputFinished: (value) => {
                this.digitalPWD = value
                DigitalPwd.close();
                this.$bridgefunc.fingerPrintRe((result) => {
                  if (result == '1') {
                    this.openUserSpecialPayPwd(14, this.digitalPWD)
                  } else {
                    this.checked = false
                    this.$Toast('指纹识别失败')
                  }
                })
              }
            })
          }
        }
      },
      closeUserSpecialPayPwd() {
        // 关闭指纹支付
        this.$request.post('/app/json/user/closeUserSpecialPayPwd', {
          payPwdMode: 14 // 密码类型
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('指纹支付关闭成功');
            this.checked = false
          } else {
            this.checked = true
            this.$Toast(res.info ? res.info : '指纹支付关闭失败')
          }
        })
      },
      async setUserSpecialPayPwd(userPwdMode) {

        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$Loading.open('请求中')
        let url = '/app/json/user/setUserSpecialPayPwd';
        let token = this.$store.state.login.token;
        let timestamp = (new Date()).valueOf();

        let params1 = {
          token: token,
          payPwdMode: userPwdMode,
          userPayPwd: timestamp,
          deviceId: nArgs.deviceId
        }


        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.pwdStates.touchPwd = data.data;
            this.$bridgefunc.vuexStorage();
            this.checked = true
            this.$Toast({
              message: data.info ? data.info : '打开成功！',
              position: 'bottom',
              duration: 2000,
            })
            this.checked = true
          } else {
            this.checked = false
            this.$Toast({
              message: data.info ? data.info : '打开失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          this.$Loading.close();
          this.checked = false
          this.$Toast({
            message: '打开失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
      async openUserSpecialPayPwd(userPwdMode, originalPwd) {

        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$Loading.open('请求中')
        let url = '/app/json/user/openUserSpecialPayPwd';
        let token = this.$store.state.login.token;

        let params1 = {
          token: token,
          payPwdMode: userPwdMode,
          userPayPwd: this.$store.state.pwdStates.touchPwd,
          deviceId: nArgs.deviceId,
          originalPwd: MD5(originalPwd) // 数字密码
        }


        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.$store.state.pwdStates.touchPwd = data.data;
            this.$bridgefunc.vuexStorage();
            this.checked = true
            this.$Toast({
              message: data.info ? data.info : '打开成功！',
              position: 'bottom',
              duration: 2000,
            })
            this.checked = true
          } else {
            this.checked = false
            this.$Toast({
              message: data.info ? data.info : '打开失败！',
              position: 'bottom',
              duration: 2000,
            })
          }
        }, error => {
          this.checked = false
          this.$Loading.close();
          this.$Toast({
            message: '打开失败！',
            position: 'bottom',
            duration: 2000,
          });
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .gestures-pwd-set {
    .gestures-pwd-set-container {
      background-color: #f8f8f8 !important
      padding: 11px 15px
      .list {
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
        border-radius 4px
        margin-bottom: 10px
        background #fff
        padding: 1px
        .item {
          .left {
            display flex
            justify-content left
            align-items center
            .img {
              padding-right: 5px
              img {
                width 30px
              }
            }
          }
        }
        .special {
          padding: 15px
        }
      }
    }
  }
  .content {
    padding: 30px
    text-align center
    line-height 20px
  }
  /deep/ .van-button--default {
    background $color-theme-r
    color: #fff
  }
</style>
