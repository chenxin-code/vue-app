/**Created by liaoyingchao on 2018/11/11.*/

<template>
  <div class="index login2">
    <nav-top :noTitle="true" :no-back="true">
      <div class="right-btn" style="right: 0px; height: 44px; top: 0px; padding-right: 10px; font-size: 12px;"
           @click="backEvent">
        <img style="margin-top: 7px;width: 28px;" src="static/image/mall/close.png"/>
      </div>
    </nav-top>
    <nav-content v-if="!$store.state.login.gestureID || !$store.state.login.gestureNumbers || isNeedAccountLogin">
      <div class="app-info">
        <div class="logo">
          <img :src="require('../../../../static/image/mall2/logo_xingxuan.jpg')"/>
        </div>
        <div class="title">{{loginTitle}}</div>
      </div>
      <div class="login-div" v-if="$store.state.globalConfig.login_mode_default == 'sms'">
        <div class="text-input">
          <div class="left">手机号</div>
          <div class="cell-phone left-10">
            <van-field
              v-model="phone"
              type="tel"
              placeholder="请输入手机号码"
              maxlength="11"
              autosize
              clearable
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              pattern="[0-9]*"
              @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
              @blur="phoneBlur"
            />
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_standard_font" @getSmsEvent="getMsgCode" :phone="phone"
                          ref="countBtn"></count-button>
          </div>
        </div>
        <div class="passwords-input-new"
             v-if="$store.state.globalConfig.user_register_referrer_input != '0' && isRegister != '1'">
          <div class="left-img">
            <img src="static/image/login2/registe5.png" alt="">
          </div>
          <div class="passwords">
            <input placeholder="请输入推荐码" v-model="referrer"/>
          </div>
          <div class="show-passwords" @click="scanCodeFunc">
            <img src="static/image/setting/icon-scan.png" class="scancode"/>
          </div>

        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="getCheckOutFun()">提交</div>
        <div class="login-way">
          <div class="btn-extend" @click="jumpJustLogin()">账号密码登录</div>
          <div class="btn-extend" @click="jumpNewUser()">新用户注册</div>
        </div>
      </div>
      <div class="login-div" v-else>
        <div class="text-input">
          <div class="cell-phone">
            <van-field
              v-model="phone"
              type="tel"
              placeholder="请输入手机号码"
              maxlength="11"
              autosize
              clearable
              onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
              pattern="[0-9]*"
              @input="phone = /^\d+/.exec(phone) ? /^\d+/.exec(phone)[0] : ''"
            >
            </van-field>
            <!--<input placeholder="请输入手机号" @input="inputChange" v-model="phone" type="number"/>-->
          </div>
        </div>
        <div class="passwords-input">
          <div class="passwords">
            <input placeholder="请输入密码" :type="isShowPwd?'text':'password'" v-model="passwords"/>
          </div>
          <div class="show-passwords">
            <img :src="isShowPwd?'static/image/login2/see-icon.png':'static/image/login2/icon-eye.png'"
                 @click="showPassword()"/>
          </div>
          <div class="forget-btn" @click="forgetPwd">忘记密码?</div>
        </div>
        <div class="passwords-input" v-if="$store.state.globalConfig.user_pwdLogin_verify_sms == 'true'">
          <div class="passwords">
            <input placeholder="请输入短信验证码" v-model="msgCode"/>
          </div>
          <div class="forget-btn">
            <count-button class="theme_standard_font" @getSmsEvent="getMsgCode" :phone="phone"
                          ref="countBtn"></count-button>
          </div>
        </div>
        <div class="common-btn theme_standard_bg theme_font_white mt100" @click="checkOutFun()">登录</div>
        <div class="common-btn shanyan-btn" @click="shanyanLogin" v-if="showShanyan">本机号码一键登录</div>
        <div class="login-way">
          <div class="btn-extend" @click="jumpCodeLogin()">短信验证码登录</div>
          <div class="btn-extend" @click="jumpNewUser()">新用户注册</div>
        </div>
      </div>
      <!--为了审核暂时去掉-->
      <!-- <div class="third-login"
           v-if="$store.state.globalConfig.isShowWXLoginBtn == '1' || $store.state.globalConfig.isShowAliLoginBtn == '1'">
        <div class="title-row">
          <div class="line theme_bg_white_ef"></div>
          <div class="text theme_font_gray">第三方登录</div>
          <div class="line theme_bg_white_ef"></div>
        </div>
        <div class="third-items">
          <div class="item" @click="thirdLogin(1)" v-if="$store.state.globalConfig.isShowWXLoginBtn == '1'">
            <div class="icon">
              <img src="static/image/login2/weixin.png"/>
            </div>
            <div class="title theme_font_gray">微信(建议使用)</div>
          </div>
          <div class="item" @click="thirdLogin(2)" v-if="$store.state.globalConfig.isShowAliLoginBtn == '1'">
            <div class="icon">
              <img src="static/image/login2/zhifubao.png"/>
            </div>
            <div class="title theme_font_gray">支付宝</div>
          </div>
        </div>
      </div>-->
    </nav-content>
    <!-- <nav-content v-else>
      <div class="gesturelogin">
        <div class="gesturediv">
          <gcanvas ref="gcanvas" @getGesture="getGesture"></gcanvas>
        </div>
        <p class="accountlogin" @click="isNeedAccountLogin = true"> 密码登录</p>
      </div>
    </nav-content> -->
    <Mark v-if="isShow"></Mark>
  </div>
</template>

<script>
  import Mark from './mark'
  import {Toast} from 'mint-ui'
  import MD5 from '@/utils/md5.js'
  import gcanvas from '../gesture/gcanvas'
  import CountButton from '@/components/commonui/count-button';
  import Verify from '@/components/commonui/common-verify/index'
  import PopupTip from './popupTip/index'

  export default {
    name: "index",
    components: {
      Mark,
      Toast,
      gcanvas,
      CountButton
    },
    data() {
      return {
        loginTitle: this.$store.state.globalConfig.projectName,
        isShow: false,
        phone: '',
        passwords: '',
        isShowPwd: false,
        isNeedAccountLogin: false,
        thirdItems: [{
          icon: 'static/image/login2/weixin.png',
          title: '微信',
          id: 1
        },
          {
            icon: 'static/image/login2/zhifubao.png',
            title: '支付宝',
            id: 2
          },
          // {
          //   icon: 'static/image/login2/tianyi.png',
          //   title: '天翼',
          //   id:3
          // }
        ],
        msgCode: '',
        isRegister: '1',  //1已经注册 0未注册
        referrer: '',
        scanCode: '',
        showShanyan: false
      }
    },
    watch: {
      msgCode(val) {
        this.msgCode = this.$util.checkVerifyCodeLenght(this.msgCode);
      }
    },
    methods: {
      shanyanLogin: function () {
        // app上 闪验
        this.$bridgefunc.shanyanLogin(res => {
          if (res.result == '0') {
            // 调用闪验失败，不管何种情况失败的。都调用vue的login
            // router.push({
            //   path: '/usercenter/login',
            // });
          } else if (res.result == '-1') {
            // 取消登录，不做任何处理
            // console.log('取消登录')
          } else if (res.result == '1') {
            // 闪验授权成功
            let token = res.token
            if (token == '') {
              Toast('闪验授权失败');
              return;
            }
            this.$util.shanyanLogin(token)
          } else if (res.result == '2') {
            // 微信授权
            console.log('去做微信登录')
            this.thirdLogin(1)
          } else if (res.result == '3') {
            // 支付宝授权
            console.log('去做支付宝登录')
            this.thirdLogin(2)
          } else {
            // 其他情况。都调用vue的login
            // router.push({
            //   path: '/usercenter/login',
            // });
          }
        })
      },
      phoneBlur: function () {
        if (!this.$util.checkMobile(this.phone) || this.$store.state.globalConfig.user_register_referrer_input == '0') {
          return;
        }

        let url = '/app/json/login/getPreRegReferrerByPhone';
        let params1 = {
          phone: this.phone
        };
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          // console.log(data);
          if (data.status == 0) {
            this.referrer = data.data && data.data != '' ? data.data.referrer : '';
            this.isRegister = data.data && data.data != '' ? data.data.isRegister : '0';
          } else {
            this.$Toast(data.info)
          }
        }, error => {
        });

      },
      scanCodeFunc: function () {

        this.$bridgefunc.scanCode((dic) => {

          let code = dic.code
          if (dic.code && (dic.code.indexOf('http') > -1)) { // 兼容微信扫码我的二维码跳转到下载地址
            code = this.$util.getUrlParam(dic.code, 'qrCode')
          }
          this.scanCode = code;
          this.referrer = code;
        });
      },
      smsLoginFun: function () {
        this.$Loading.open();
        let url = '/app/json/login/smsLogin';
        let params = {
          phone: this.phone,
          smsVerifyCode: this.msgCode
        };
        if (this.referrer && this.referrer.length) {
          params['rfrCode'] = this.referrer;
        }
        // 1 手动输入  2扫一扫
        if (this.referrer == this.scanCode) {
          params['rfrCodeType'] = 2;
        } else {
          params['rfrCodeType'] = 1;
        }

        this.$http.post(url, params).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast(data.info ? data.info : '登录成功')
              this.$userCenter.retsetToIndex(data.data, 1);
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '登录失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },

      getCheckOutFun: function () {
        let mobileReg = /^1\d{10}$/;
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
          return
        } else if (!mobileReg.test(this.phone)) {
          this.$Toast('手机号格式不对!')
          return
        } else if (this.msgCode == '') {
          this.$Toast('验证码不能为空!')
          return
        }

        this.$store.state.globalConfig.user_privacy_ask_flag = 'true'

        if (this.$store.state.globalConfig.user_privacy_ask_flag == 'true') {
          let result = localStorage.getItem('user_privacy_ask_flag')
          if (result == 'true') {
            this.smsLoginFun()
          } else if (result == 'false') {
            this.smsLoginFun()
          } else {
            let message = `${this.$store.state.globalConfig.downloadName}APP将会采集当前手机的地理位置信息，如果您不同意，APP的部分功能可能会受限，如果您同意请点击下面同意按钮`
            this.$messagebox.confirm(message, '提示', {confirmButtonText: '同意', cancelButtonText: '不同意'}).then(action => {
              localStorage.setItem('user_privacy_ask_flag', 'true')
              this.smsLoginFun()
            }).catch(action => {
              localStorage.setItem('user_privacy_ask_flag', 'false')
              // 重制app为默认地址
              let locationinfo = {}
              locationinfo.province = this.$store.state.globalConfig.province
              locationinfo.city = this.$store.state.globalConfig.city
              locationinfo.district = this.$store.state.globalConfig.district
              locationinfo.longitude = this.$store.state.globalConfig.longitude
              locationinfo.latitude = this.$store.state.globalConfig.latitude
              let tempLocDic = this.$util.bd_decrypt(locationinfo.longitude, locationinfo.latitude);
              this.$store.state.currentLocation.posx = tempLocDic.gg_lon;
              this.$store.state.currentLocation.posy = tempLocDic.gg_lat;
              this.$store.state.indexData.province = locationinfo.province;
              this.$store.state.indexData.city = locationinfo.city;
              this.$bridgefunc.vuexStorage(function () {
              })

              this.smsLoginFun()
            });
          }
          return;
        }

        this.smsLoginFun()
      },
      //获取短信验证码
      getMsgCode: function (imgVerifyCode, uuid) {
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
          return
        } else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone: this.phone,
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              console.log(data)
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      getGesture: function (lastPoints) {
        if (this.isEqual(this.getIndexArr(lastPoints))) {
          this.otherLogin(2);
          this.$refs.gcanvas.reset();

        } else {
          this.$Toast('手势错误');
          this.$refs.gcanvas.reset();
        }
      },
      faceOrTouchLogin: function () {
        if (this.$store.state.login.faceID && this.$store.state.login.facePwd) {
          this.$bridgefunc.faceIDRe((result) => {
            if (result == 1) {
              this.otherLogin(3);
            }
          })
        } else if (this.$store.state.login.touchID && this.$store.state.login.touchPwd) {
          this.$bridgefunc.fingerPrintRe((result) => {
            if (result == 1) {
              this.otherLogin(4);
            }
          })
        }

      },
      isEqual: function (lastPoints) {
        let p1 = '',
          p2 = '';
        for (var i = 0; i < this.$store.state.login.gestureNumbers.length; i++) {
          p1 += this.$store.state.login.gestureNumbers[i];
        }
        for (var i = 0; i < lastPoints.length; i++) {
          p2 += lastPoints[i];
        }
        return p1 === p2;
      },
      getIndexArr: function (lastPoints) {
        let arr = [];
        for (let i = 0; i < lastPoints.length; i++) {
          let index = lastPoints[i].index;
          arr.push(index);
        }
        return arr;
      },
      // userPwd  设置指纹  面部 手势返回的密码
      // 密码验证类型，1：普通登录密码；2：手势登录密码；3:刷脸登录密码；4：指纹登录密码
      async otherLogin(userPwdMode) {
        let nArgs = await this.$bridgefunc.getArgsWithPromise();
        this.$Loading.open('请求中')
        let url = '/app/json/login/userDevicePwdLogin';
        let token = this.$store.state.login.token;
        let timestamp = (new Date()).valueOf();
        let pwdCode = '';
        if (userPwdMode == 2) {
          pwdCode = this.$store.state.login.gesturePwd;
        } else if (userPwdMode == 3) {
          pwdCode = this.$store.state.login.facePwd;
        } else if (userPwdMode == 4) {
          pwdCode = this.$store.state.login.touchPwd;
        }
        let params = {
          userPwdMode: userPwdMode,
          pwdCode: pwdCode,
          deviceId: nArgs.deviceId,
        }

        this.$http.post(url, params).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast(data.info ? data.info : '登录成功');
              this.$store.state.login.phone = this.phone;
              // 记住的是MD5后的密码
              this.$store.state.login.password = MD5(this.passwords);
              this.$userCenter.retsetToIndex(data.data);
            } else {
              this.$Toast(data.info ? data.info : '登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      numberInput: function (value) {
        this.phone = this.phone + '' + value
      },
      // 仅输入数字
      inputChange: function (e) {
        let value = e.target.value;
        this.phone = this.$util.onlyNumber(value);
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      thirdLogin: function (id) {
        if (id == 1) {
          this.$bridgefunc.wxAuth((codeStr) => {
            if (codeStr == '') {
              this.$Toast('微信授权失败');
            } else {
              this.wxLogin(codeStr)
            }
          });
        } else if (id == 2) {
          this.getAliLoginCodeStr();
        }
      },
      getAliLoginCodeStr: function () {

        this.$Loading.open();
        let url = '/app/json/login/getAliLoginCodeStr';
        this.$http.post(url, {}).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.aliAuth(data.data, (str) => {
                let authDic = JSON.parse(decodeURIComponent(str));
                if (authDic.user_id == '') {
                  this.$Toast('支付宝授权失败');
                } else {
                  this.zhifubaoLogin(authDic.auth_code)
                }
              });
            } else {
              this.$Toast(data.info ? data.info : '支付宝授权登录失败');
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("支付宝授权登录失败");
          }
        )
      },
      async zhifubaoLogin(codeStr) {
        this.$Loading.open();
        let url = '/app/json/login/aliLogin';
        let params = {
          code: codeStr,
        };
        this.$http.post(url, params).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('登录成功');
              this.$userCenter.retsetToIndex(data.data);
              window.localStorage.setItem('hobby', 1)
            } else {

              if (data.errorCode == 1034) {//去绑定或者快速注册
                let authDic = {};
                authDic.user_id = data.info;
                authDic.auth_code = codeStr;
                this.bind(authDic, '6');
              } else {
                this.$Toast(data.info ? data.info : '支付宝授权登录失败');
              }
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )

      },
      wxLogin: function (codeStr) {
        this.$Loading.open();
        let url = '/app/json/login/wechatLogin';
        let params = {
          code: codeStr,
        };

        this.$http.post(url, params).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('登录成功');
              this.$userCenter.retsetToIndex(data.data);
              window.localStorage.setItem('hobby', 1)
            } else {

              if (data.errorCode == 1034) {//去绑定或者快速注册
                let authDic = {};
                authDic.user_id = data.info;
                authDic.auth_code = codeStr;
                this.bind(authDic, '3');
              } else {
                this.$Toast(data.info ? data.info : '微信授权登录失败');
              }
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      bind: function (authDic, regChannel) {
        this.$messagebox.confirm('是否已有账号？', '提示', {confirmButtonText: '去绑定', cancelButtonText: '去注册'}).then(action => {
          this.$router.push({
            path: '/usercenter/loginbinding',
            query: {
              thirdUserId: authDic.user_id,
              code: authDic.auth_code,
              regChannel: regChannel,
              bindType: 1
            }
          })
        }).catch(action => {
          this.$router.push({
            path: '/usercenter/loginbindingpw',
            query: {
              thirdUserId: authDic.user_id,
              code: authDic.auth_code,
              regChannel: regChannel,
              bindType: 2
            }
          })
        });
      },
      registerEvent: function () {

      },
      forgetPwd: function () {
        this.$router.push({
          path: '/usercenter/forgetpassword',

        })
      },
      //跳转短信登录
      jumpCodeLogin: function () {
        this.$router.push({
          path: '/usercenter/codeverify',
        })
      },
      jumpJustLogin: function () {
        this.$router.push({
          path: '/usercenter/justlogin',
        })
      },
      //跳转新用户注册
      jumpNewUser: function () {
        this.$router.push({
          path: '/usercenter/register',
        })
      },

      showPassword: function () {
        if (this.isShowPwd) {
          this.isShowPwd = false
        } else {
          this.isShowPwd = true
        }
      },
      //账号密码登录
      checkOutFun: function () {
        if (this.phone == '') {
          this.$Toast('账号不能为空!')
          return
        } else if (this.passwords == '') {
          this.$Toast('密码不能为空!')
          return
        } else if (!this.$util.checkMobile(this.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }

        if (this.$store.state.globalConfig.user_pwdLogin_verify_sms == 'true') {
          if (this.msgCode == '') {
            this.$Toast('验证码不能为空!')
            return
          }
        }

        if (this.$store.state.globalConfig.verify_checkcode_login_enable == 'true') {
          Verify.open({
            type: 'login',
            sureFunc: this.loginFun,
            vertifyCancelEvent: () => {
            },
            paras: {
              phone: this.phone
            }
          })
        } else {
          this.loginFun()
        }
      },
      loginFun: async function (verifyCode, uuid) {
        let url = '/app/json/login/login';
        let paramsData = {
          phone: this.phone,
          userPwd: MD5(this.passwords),
          smsVerifyCode: this.msgCode
        };

        if (this.$store.state.globalConfig.user_loginPwd_type == '1') {
          // 明文密码
          paramsData.userPwd = this.passwords
        }

        if (verifyCode && uuid) {
          paramsData.imgVerifyCode = verifyCode
          paramsData.uuid = uuid
        }

        // 存手机号防止原设备ID为空，作为设备ID
        this.$store.state.login.phone = this.phone
        //调试状态下  设备号为手机号
        if (process.env.NODE_ENV !== 'production') {
          this.$store.state.commonArgs.data.deviceId = MD5(this.phone);
          this.$bridgefunc.vuexStorage();
        }
        this.$Loading.open();

        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            console.log(res.data)
            let data = res.data;
            if (data.status == 0) {
              if (this.$store.state.globalConfig.ComplexPwd == 1 && !this.$util.checkPassWord(this.passwords, false)) {
                this.$messagebox.alert('密码过于简单，请重新设置密码。', '提示', {confirmButtonText: '确定'}).then(action => {
                  this.$router.push({
                    path: '/usercenter/forgetpassword',
                    query: {
                      title: '重新设置密码',
                      phone: this.phone
                    }
                  })
                })
                return;
              }
              this.$Toast(data.info ? data.info : '登录成功');
              this.$store.state.login.phone = this.phone;
              window.localStorage.setItem('hobby', 1)
              // 记住的是MD5后的密码
              this.$store.state.login.password = MD5(this.passwords);
              this.$userCenter.retsetToIndex(data.data);
            } else {
              if (data.info.indexOf('注销') > -1) {
                PopupTip.open({
                  cancellationText: data.info || '该账号已注销!'
                })
              } else {
                this.$Toast(data.info ? data.info : '登录失败');
              }
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      }
    },
    mounted() {
      this.faceOrTouchLogin();

      let shanyanInitResult = sessionStorage.getItem('shanyanInitResult')
      if (shanyanInitResult == '1') {
        this.showShanyan = true
      }
    },
    created() {
      console.log('pppppppppppllllll', this.$store.state.globalConfig)
      let uPhone = this.$store.state.login.phone
      if (this.$util.checkMobile(uPhone)) {
        this.phone = uPhone;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    width 100%
    height 100%
    overflow hidden

    .gesturelogin {
      width 100%
      height 100%
      overflow hidden
      display flex
      flex-direction column
      justify-content center

      .gesturediv {
        margin-top -30px
        width 375px;
        height 375px;
      }

      .accountlogin {
        width 100%
        text-align center
        font-size 16px;
        margin-top 30px
        color $color-text-d
      }
    }

    .app-info {
      text-align center;
      margin-top 15px;

      .logo {
        img {
          width 50px;
          height 50px;
        }
      }

      .title {
        margin-top 10px;
        font-size 18px;
        font-weight 500;
      }
    }

    .login-div {
      margin 30px 20px;
      /*.text-input {
        border-bottom: 1px solid #dedede;
        padding: 20px 0px 5px 0px;
        .cell-phone {
          width: 100%;
          .van-cell {
            padding 3px 0 !important;
          }
        }

      }*/

      .text-input {
        border-bottom: 1px solid #dedede;
        padding: 24px 0px 10px 0px;
        display: flex;
        justify-content: end;
        align-items: center;

        .left {
          font-size: $font-size-medium;
        }

        .cell-phone {
          flex 1;

          .van-cell {
            padding 0 !important;
          }

          /*input{
            display:block;
            font-size:$font-size-medium;
            width:100%;
          }*/
        }

        .left-10 {
          padding-left: 10px;
        }

      }

      .passwords-input {
        border-bottom: 1px solid #dedede;
        padding: 20px 0px 5px 0px;
        display: flex;
        justify-content: space-between;
        align-items center;

        .passwords {
          width: 70%;

          input {
            color #323233;
            height 30px;
            display: block;
            width: 100%;
            font-size: $font-size-medium;
          }
        }

        .show-passwords {
          width: 25px;
          height: 14px;
          padding-right: 10px;
          border-right: 1px solid #dedede;
          padding-top: 4px;
          extend-click()

          img {
            display: block;
            width: 100%;
          }
        }

        .forget-btn {
          extend-click()
          text-align right;
          line-height: 1;
        }
      }

      .mt100 {
        margin-top: 50px;
      }

      .shanyan-btn {
        margin-top 20px;
        background-color #F09169;
        color white;
      }

      .login-way {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;

        .btn-extend {
          extend-click()
          font-size: $font-size-medium-s;
        }
      }
    }

    .third-login {
      margin-top 15px;

      .title-row {
        display flex;
        align-items center;
        font-size $font-size-small;

        .line {
          flex 1;
          height 1px;
          background-color: #efefef;
        }

        .text {
          margin 0 10px;
        }
      }

      .third-items {
        margin-top 15px;
        display flex;
        align-items center;
        justify-content space-between;

        .item {
          flex 1
          text-align center;

          .icon {
            img {
              width 35px;
              height 35px;
            }
          }

          .title {
            margin-top 6px;
            font-size $font-size-medium-s;
          }
        }
      }
    }

    .left-img {
      width 23px
      height 23px
      margin-right 5px

      img {
        width 100%
        height 100%
      }
    }

    .passwords-input-new {
      border-bottom: 1px solid #dedede;
      padding: 20px 0px 5px 0px;
      display: flex;
      align-items center;
      justify-content: space-between;

      .passwords {
        flex 1

        input {
          height 30px;
          display: block;
          width: 100%;
          font-size: $font-size-medium-s;
        }
      }

      .show-passwords {
        extend-click()

        img {
          display: block;
          // margin-top:4px;
        }

        .see-icon {
          width: 15px;
          height: 10px;
        }

        .scancode {
          width: 15px;
          height: 15px;
        }

      }

      .forget-btn {
        border-left: 1px solid #dedede;
        padding-left 10px
        line-height: 1;
      }
    }

    input:

    :-webkit-input-placeholder { /* WebKit browsers */
      color: #999;
    }

    /deep/ .van-popup {
      width: 76%;
      font-size: 14px;
      color: #8c8c8c;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popupCard {
      height: 160px;
      flex-direction: column;
      line-height: 26px;

      .popupCardText {
        height 110px
        padding 14px 20px

        .content {
          overflow-y auto
          height 100%
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }

      .popupCardBtn {
        width: 100%;
        color: #000;
        height: 50px;
        display: flex;
        justify-content: center;
        font-size 14px
        border-top 0.5px solid #e0e0e0

        span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        > :first-child {
          color blue;
          border-right 0.5px solid #e0e0e0
        }
      }
    }
  }
</style>
