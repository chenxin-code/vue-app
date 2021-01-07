<template>
  <div class="container">
    <div class="content">
      <img src="../../assets/images/chum-logo.png" alt class="logo"/>
      <van-form ref="loginForm">
        <div class="field-c">
          <van-field v-model="phone" maxlength="11" pattern="[0-9]*"
                     @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''" name="手机号" placeholder="请输入手机号"
                     type="tel" :border="false" clearable/>
        </div>
        <div class="field-c reset-margin-top">
          <van-field v-model="msgCode" @input="msgCode = $util.checkVerifyCodeLenght(msgCode)" pattern="[0-9]*"
                     name="验证码" type="digit" :border="false" placeholder="请输入验证码" clearable>
            <count-button slot="button" class="verif-code-btn" @getSmsEvent="getMsgCode" :phone="phone"
                          ref="countBtn"></count-button>
          </van-field>
        </div>
        <div class="agreement" @click.stop="viewsTerms">
          <van-checkbox class="agreement-label" v-model="checked" disabled checked-color="#c89f62"
                        shape="square"></van-checkbox>
          <span class="agreement-name">服务条款及隐私政策</span>
        </div>
        <div class="submit-btn chum-public-btn">
          <van-button round block type="info" @click.native="registerFun"
                      color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          >绑定
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
  import {Form} from 'vant';
  import MD5 from '@/utils/md5.js'
  import wxfunc from '@/utils/wxfunc'
  import CountButton from '@/components/commonui/count-button/index'

  export default {
    components: {
      [Form.name]: Form,
      CountButton
    },
    data() {
      return {
        msgCode: "",
        phone: "",
        checked: false,
        isShowRegisterModal: false,
      };
    },
    created() {
      this.thirdUserId = this.$store.state.login.thirdUserId
    },
    activated() {
      this.checked = this.$store.state.isAgreement
    },
    methods: {
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        if (!this.thirdUserId) {
          this.$Toast('该账号无法登录，请联系客服!')
          return;
        }
        if (!this.phone) {
          this.$Toast('手机号不能为空!')
          return;
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let paramsData = {
          phone: this.phone,
          smsType: '1020',
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        }
        this.$http.post('/app/json/login/sendSms', paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取短信验证码成功')
            } else {
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
              this.$refs.countBtn.resetClock();
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.$refs.countBtn.resetClock();
          }
        )
      },
      //绑定
      registerFun: function () {
        if (!this.checked) {
          this.$Toast('请同意服务条款及隐私政策!')
          return;
        }

        if (!this.phone) {
          this.$Toast('手机号不能为空!')
          return;
        }
        if (!this.msgCode) {
          this.$Toast('验证码不能为空!')
          return;
        }
        if (!this.$store.state.isAgreement) {
          this.isShowRegisterModal = true
        }
        let paramsData = {
          phone: this.phone,
          thirdUserId: this.thirdUserId,
          smsVerifyCode: this.msgCode,
          regChannel: 5,
          bindType: 4,
          loginChannel: 6
        }

        if (this.$store.state.rfrCode) { // 推荐人
          paramsData.rfrCode = this.$store.state.rfrCode
          paramsData.rfrCodeType = 1
        }
        if (this.$store.state.enterPriseOuCode) {  // 企业信息
          paramsData.enterPriseOuCode = this.$store.state.enterPriseOuCode
        }
        if (this.$store.state.webtype == 2) {
          // 微信端使用
          this.$Loading.open();
          wxfunc.getWechatSignature((isSignature) => {
            //签名成功
            if (isSignature) {
              wxfunc.wxGetLocation((location) => {
                this.$store.state.currentLocation.posx = location ? location.longitude : '';
                this.$store.state.currentLocation.posy = location ? location.latitude : '';

                this.$mallCommon.addressAnalysis((res) => {
                  this.$Loading.close();
                  paramsData.province = this.$store.state.mall2.selectAddress.provinceName
                  paramsData.provinceCode = this.$store.state.mall2.selectAddress.provinceId
                  paramsData.city = this.$store.state.mall2.selectAddress.cityName
                  paramsData.cityCode = this.$store.state.mall2.selectAddress.cityId
                  paramsData.longitude = this.$store.state.currentLocation.posx
                  paramsData.latitude = this.$store.state.currentLocation.posy;
                  this.apiEvent(paramsData)
                }, location);
              });
            } else {
              this.apiEvent(paramsData)
            }
          });
        } else {
          // 其他端使用
          paramsData.province = this.$store.state.mall2.selectAddress.provinceName
          paramsData.provinceCode = this.$store.state.mall2.selectAddress.provinceId
          paramsData.city = this.$store.state.mall2.selectAddress.cityName
          paramsData.cityCode = this.$store.state.mall2.selectAddress.cityId
          paramsData.longitude = this.$store.state.currentLocation.posx
          paramsData.latitude = this.$store.state.currentLocation.posy;
          this.apiEvent(paramsData)
        }
      },
      // 绑定注册接口调用
      apiEvent: function (paramsData) {
        this.$Loading.open();
        this.$http.post('/app/json/login/bindThirdUser', paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('绑定成功')
              this.$userCenter.retsetToIndex(data.data, 1);
            } else if (data.errorCode == 2002) {
              this.$Toast(data.info ? data.info : '手机号已存在用户已注册')
            } else {
              this.$Toast(data.info ? data.info : '注册失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      // 阅读服务条款
      viewsTerms() {
        console.log('阅读服务条款');
        this.$router.push('/terms_service');
      },
    }
  };
</script>
<style lang="stylus" scoped>
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';

  .container {
    background url('../../assets/images/login-bg.png') no-repeat;
    background-size 100% 100%;

    .content {
      width: 90%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -55%);
      border-radius: 10px;
      background-color: #ECECF0;

      .logo {
        display: block;
        width: 195px;
        margin: 50px auto 0;
      }

      .agreement {
        margin 8px 15px 0;
        display flex
        align-items center

        .agreement-name {
          display inline-block
          padding-left: 6px;
        }
      }

      .field-c {
        margin 43px 15px 0;

        &.reset-margin-top {
          margin-top 20px;
        }

        .van-cell {
          border-radius: 5px;
          border: 1px solid rgba(207, 207, 207, 1);
        }

        .verif-code-btn {
          font-size 15px;
          color #C9A063;
        }
      }

      .submit-btn {
        margin 30px 15px 55px
      }
    }

    .agreement-modal {
      width 82%;
      border-radius 5px;

      .title {
        text-align center;
        font-size 15px;
        margin-top 15px
      }

      .agreement-content {
        margin 20px 0;
        padding 0 25px;
        font-size 14px;
        line-height 18px;
        color #333;

        .terms {
          color #1989fa;
        }
      }

      .btm-btn {
        display flex;

        .btn {
          flex 1;
        }
      }
    }
  }
</style>
