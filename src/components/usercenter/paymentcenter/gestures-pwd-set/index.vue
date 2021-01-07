<template>
  <div class="gestures-pwd-set">
    <nav-top title="手势密码" @backEvent="backEvent"></nav-top>
    <nav-content class="gestures-pwd-set-container">
      <div class="table-view list">
        <div class="table-view-cell item" v-if="$store.state.pwdStates.gesturePwd">
          <div class="table-view-cell-text">
            <div class="left">开启手势密码</div>
            <div class="right">
              <van-switch size="20px" @change="change" active-color="#F80F16" v-model="checked" />
            </div>
          </div>
        </div>
        <div class="table-view-cell item special" @click="openSetgesture">
          <div class="table-view-cell-text">
            <div class="left">修改手势密码</div>
          </div>
          <div class="table-view-cell-arrow"></div>
        </div>
      </div>

    </nav-content>
  </div>
</template>

<script>
  import DigitalPwd from '@/components/mall2/common/digital-pwd'
  import MD5 from '@/utils/md5.js'

  export default {
    data() {
      return {
        checked: false,
        digitalPWD: '',
        defaultPayPwdMode: '' // 默认开启的支付密码方式 11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
      }
    },
    mounted() {
      this.defaultPayPwdMode = this.$route.query.defaultPayPwdMode
      this.checked = this.defaultPayPwdMode == 12 ? true : false
    },
    destroyed() {
      DigitalPwd.close()
    },
    methods: {
      backEvent() {
        this.$router.go(-1)
      },
      openSetgesture() {
        // 修改手势密码 先验证密码
        this.digitalPWD = ''
        DigitalPwd.open({
          initData: {
            payPwdState: 2,
            title: '修改手势密码',
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
            DigitalPwd.close()
            this.validPayPwd(this.digitalPWD) // 先验证密码是否正确 再去修改手势
            // this.$router.push({path: '/usercenter/setgesture-set', query: {type: '2', digitalPWD: this.digitalPWD}}) // 1设置 2修改

          }
        })
      },
      validPayPwd(originalPwd) {
        // 验证密码
        this.$Loading.open()
        let paramsData = {
          token: this.$store.state.login.token,
          originalPwd: MD5(originalPwd), // 密码
          payPwdMode: 11 // 支付密码类型：11：普通支付密码；12：手势支付密码；13:刷脸支付密码；14：指纹支付密码；
        }
        this.$http.post('/app/json/user/validPayPwd', paramsData).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              // 商品列表
              this.$toast('密码验证成功')
              this.$router.push({path: '/usercenter/setgesture-set', query: {type: '2', digitalPWD: this.digitalPWD}}) // 1设置 2修改
            } else {
              // 输入错误的原密码时
              if (data.errorCode == 3007) {
                // 输入超过5次 被锁定
                Dialog.alert({
                  title: '提示',
                  message: '密码已被锁定!',
                }).then(() => {
                  DigitalPwd.close()
                })
              } else {
                this.$toast(data.info)
                DigitalPwd.close()
              }
            }
          },
          error => {
            this.$Loading.close()
            this.$Toast('请求数据失败！')
          })
      },
      change() {
        console.log(this.$store.state.login)
        if (this.checked == false) { // 关闭
          this.closeUserSpecialPayPwd()
        } else { // 开启
          this.digitalPWD = ''
          DigitalPwd.open({
            initData: {
              payPwdState: 2,
              title: '开启手势密码',
              tips: '请先输入6位数字支付密码已验证身份'
            },
            toSettingPwd: () => {
              this.$router.push({
                path: '/usercenter/nosetpwd',
                query: {
                  isSet: 2,
                  source: ''
                }
              })
              DigitalPwd.close();
            },
            inputFinished: (value) => {
              this.digitalPWD = value
              this.openUserSpecialPayPwd(12, this.digitalPWD)
              DigitalPwd.close();
            }
          })
        }
      },
      closeUserSpecialPayPwd() {
        // 关闭手势支付
        this.$request.post('/app/json/user/closeUserSpecialPayPwd', {
          payPwdMode: 12 // 密码类型
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('手势支付关闭成功');
          } else {
            this.$Toast(res.info ? res.info : '手势支付关闭失败')
          }
        })
      },
      async openUserSpecialPayPwd(payPwdMode, originalPwd) {
        // 开启手势支付
        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$request.post('/app/json/user/openUserSpecialPayPwd', {
          payPwdMode: payPwdMode,
          userPayPwd: this.$store.state.pwdStates.gesturePwd,
          deviceId: nArgs.deviceId,
          originalPwd: MD5(originalPwd) // 数字密码
        }).then(res => {
          if (res.status === 0) {
            this.$Toast('手势支付开启成功');
          } else {
            this.checked = false
            this.$Toast(res.info ? res.info : '手势支付开启失败')
          }
        })
      }
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
      font-size 14px
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
</style>
