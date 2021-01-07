<template>
  <div class="login login-about">
    <div class="header">
      <div class="logo">
        <img class="full-img" src="@/assets/refuel/logo.png">
      </div>
      <div class="app-name">中油好客e站</div>
    </div>
    <div class="radius-form">
      <form class="form">
        <div class="cells">
          <div class="cell">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="@/assets/login/login-icon1.png">
              </div>
            </div>
            <div class="cell__bd">
              <!--onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')"-->
              <input type="text"    @input="inputChange"   placeholder="请输入用户名或手机号" v-model="phone">
            </div>
          </div>
          <div class="cell cell-line">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="@/assets/login/login-icon2.png">
              </div>
            </div>
            <div class="cell__bd">
              <input type="password" placeholder="请输入用户密码" v-model.trim="userPwd">
            </div>
            <div class="cell__ft">
              <div class="btn-pass" :class="{'save-pwd-status': savePwdStatus}" @click="savePassword()">
                记住密码
              </div>
            </div>
          </div>
          <div class="cell cell-line cell_access" @click="selectCity">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="@/assets/login/login-icon3.png">
              </div>
            </div>
            <div class="cell__bd font-medium">
              {{province}} &nbsp; {{city}}
            </div>
            <div class="cell__ft"></div>
          </div>
        </div>
      </form>
    </div>

    <div class="btn-box" @click="loginClick">
      <div class="btn">
        登录
      </div>
    </div>

    <div class="col">
      <div class="col-cell">
        <div class="col-item" @click="goToRegister">账号注册</div>
        <div class="col-item fast" @click="goToForgetPwd">
          <span class="text">
            忘记密码?
          </span>
        </div>
      </div>
      <div class="col-cell">
        <div class="col-item"></div>
        <div class="col-item fast" @click="goToSmsLogin">
          <span class="text">
            快捷登录
          </span>
          <img src="@/assets/login/right.png" width="15px" height="15px">
        </div>
      </div>
    </div>

    <div class="login-third">
      <span class="text font-medium-l">
        第三方账号登录
      </span>
    </div>

    <div class="zhifubao-logo" @click="aliFunc">
      <div class="img-cell">
        <img class="full-img" src="@/assets/zhifubao.png">
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui';
  import {MP} from '@/utils/map'
  import { mapMutations,mapGetters } from 'vuex'

  export default {
    name: 'login',
    components: {
      Toast,
    },
    computed: {
      ...mapGetters([
        'location',
        'login',
      ]),
    },
    data() {
      return {
        phone: '',
        userPwd: '',
        savePwdStatus: false,
        province:'',
        city:''
      };
    },
    created() {
      // this.$dmp.uploadTrack("EV_APP_START");
      this.phone = this.login.phone
      this.savePwdStatus = this.login.savePWD == '1' ? true : false
      if(this.savePwdStatus){
        this.userPwd = this.login.password
      }

    },
    mounted() {
      this.$nextTick(function() {
        this.getLocation();
      });
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.vuexRead();
      })

    },
    activated: function () {
      this.vuexRead();
    },
    methods: {
      inputChange:function(e){
        var value = e.target.value ;
        var reg =/[\u4e00-\u9fa5]/g;
        let str1 = value.replace(reg, "")
        this.phone = str1;
        // return str1;
      },
      vuexRead:function () {
        let _this = this;
        this.$bridgefunc.vuexRead(function () {

          if(_this.location.login.province && _this.location.login.city){
            _this.province = _this.location.login.province;
            _this.city =  _this.location.login.city;
            //选完要将这里置空
            _this.location.login.province = '';
            _this.location.login.city = '';
            _this.$bridgefunc.vuexStorage();
          }
        })
      },
      getLocation:function(){
        let _this = this;
        this.$bridgefunc.getLocation(function (locationinfo) {
          _this.province = locationinfo.province
          _this.city = locationinfo.city;
          _this.$bridgefunc.vuexStorage(function () {
            console.log('vuexStorage')
          })
        })
      },
      // 登录
      loginClick: function () {


        if (this.phone == '') {
          Toast({
            message: '请输入账号',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.userPwd == '') {
          Toast({
            message: '请填写密码',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        if (this.province == '' ||  this.city == '') {
          Toast({
            message: '请填写省市',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open();
        let pwd =this.userPwd
        let url = '/app/json/login/login';

        let params = {
          phone: this.phone,
          userPwd: this.$util.md5String(pwd),
          city: this.city ? this.city : '',
          province: this.province ? this.province : '',
        };
        let _this = this
        this.$http.post(url, params).then(res => {
            let data = res.data;
            if (data.status == 0) {
             //登录成功
              // 保存密码 or 清除保存的密码
              _this.login.phone = _this.phone
              window.localStorage.setItem('hobby',1)
              if (_this.savePwdStatus == true) {
                _this.login.password = _this.userPwd
                _this.login.savePWD = _this.savePwdStatus ? '1' : '0'
              } else {
                _this.login.password = ''
                _this.login.savePWD = _this.savePwdStatus ? '1' : '0'
              }

              _this.$store.state.indexData.province = _this.province
              _this.$store.state.indexData.city = _this.city
              let bizCode = data.data.bizCode;//data.data.bizCode
              let bizInfo = data.data.bizInfo;console.log('提示内容', bizInfo);
              if(bizCode == '308'){//进入首页之前，强制修改密码
                _this.$MessageBox.alert(bizInfo, '提示',{confirmButtonText:'立即修改'}).then(action => {
                  _this.forceModifyPwd(token);
                });
              }else if(bizCode == '309'){//进入首页之前，强制校验办卡预留手机号
                _this.$MessageBox.alert(bizInfo, '绑卡校验提示',{confirmButtonText:'确定'}).then(action => {
                  _this.verifyPhone(data.data);
              });

              } else {//直接进入首页
               
                _this.$userCenter.retsetToIndex(data.data);
              }
               

            } else {
              Toast({
                message: data.info,
                position: 'bottom',
                duration: 2000,
              });
            }
            _this.$Loading.close();
          },
          error => {
            _this.$Loading.close();
            console.log('获取', error);
            Toast({
              message: '登录失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },
      // 保存密码
      savePassword: function () {
        this.savePwdStatus = !this.savePwdStatus;
      },

      // 跳转注册
      goToRegister: function () {
        this.$bridgefunc.customPush({
          path: '/register',
          isnativetop:'1',
        });
      },
      // 跳转忘记密码
      goToForgetPwd: function () {
        this.$bridgefunc.customPush({
          path: '/forgetpassword',
          isnativetop:'1',
        });
      },
      // 跳转短信登录（快捷登录）
      goToSmsLogin: function () {
        this.$bridgefunc.customPush({
          path: '/smslogin',
          isnativetop:'1',
        });
      },

      selectCity: function () {
        let _this = this
        this.$store.state.location.selectType = '1'
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/cityselector/0',
            isnativetop:'1'
          });
        })
      },

      aliFunc:function () {//支付宝授权
        let _this = this;
        this.$bridgefunc.aliAuth(function (codeStr) {
          if(codeStr == ''){
            Toast({
              message: '支付宝授权失败',
              position: 'bottom',
              duration: 2000,
            });
          }else {
            _this.zhifubaoLogin(codeStr)
          }
        });
      },
      zhifubaoLogin:function (codeStr){// 支付宝授权登录
        this.$Loading.open();
        let url = '/app/json/login/aliLogin';
        let params = {
          aliOpenId: codeStr,
        }
        let _this = this
        this.$http.post(url, params).then(res => {
          _this.$Loading.close();
          let data = res.data;
          console.log('支付宝登录', data);
          if (data.status == 0) {
            data.data.logintype = 2
            // 如果首页使用的省市不存在，赋值登录的省市给首页
            if (_this.location.index.province == '') {
              _this.location.index.province = _this.province
              _this.location.index.city = _this.city
            }
            _this.$userCenter.retsetToIndex(data.data);

          }else {
            if(data.errorCode==1014){//去绑定或者快速注册

              _this.$bridgefunc.customPush({
                path: '/aliloginbind',
                isnativetop:'1',
                query: {
                  aliOpenId: codeStr,
                }
              })

            }else{
              Toast({
                message: data.info?data.info: '支付宝授权登录失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          }
      }, error => {
          Toast({
            message: '支付宝授权登录失败',
            position: 'bottom',
            duration: 2000,
          });        })
      },
      forceModifyPwd:function (token){//强制修改密码
        let _this = this;
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/forcemodifypass',
            isnativetop:'1',
            query: {
              phone:_this.phone,
              token:token,
            }
          });
        })
      },
      verifyPhone: function (userInfo){//跳转验证绑卡界面
        let _this = this;
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/verifyphone',
            isnativetop:'1',
            query: {
              phone:_this.phone,
              userInfo:encodeURIComponent(JSON.stringify(userInfo)),
            }
          });
        })
      },
    },
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  .save-pwd-status {
    background-color: $color-theme-btn-l !important;
    color: #fff !important;
  }
</style>

