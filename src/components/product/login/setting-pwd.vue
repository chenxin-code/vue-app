<template>
  <div class="setting-pwd login-about full-view">
    <div class="full-form">
      <form class="form">
        <div class="cells">
          <div class="cell cell-line">
            <div class="cell__hd">
              输入密码
            </div>
            <div class="cell__bd">
              <input type="password" placeholder="请输入密码" v-model.trim="userPwd">
            </div>
          </div>
          <div class="cell cell-line">
            <div class="cell__hd">
              再次输入
            </div>
            <div class="cell__bd">
              <input type="password" placeholder="请输入密码" v-model.trim="userPwdAgain">
            </div>
          </div>
          <div class="cell cell-line cell_access" @click="selectCity">
            <div class="cell__hd">
              位置
            </div>
            <div class="cell__bd font-medium">
              {{province}} &nbsp; {{city}}
            </div>
            <div class="cell__ft">
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="btn-box">
      <div class="btn" @click="signin">
        点击注册
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import CountButton from '@/components/commonui/count-button';

  export default {
    components: {
      Toast,
      CountButton,
    },
    data() {
      return {
        userPwd: '',
        userPwdAgain: '',
        phone: '',
        smsVerifyCode: '',
        province: '',
        city: ''
      };
    },
    created() {
      this.phone = this.$route.query.phone;
      this.smsVerifyCode = this.$route.query.smsVerifyCode;
      this.getLocation();
    },
    mounted() {
      let _this = this;
      this.$bridgefunc.registePageShow(function () {
        _this.$bridgefunc.vuexRead()
      })
    },

    watch: {
      '$store.state.location.login.city': function (val, oldVal) {
        this.setCity()
      },
      // smsVerifyCode(val) {
      //     this.smsVerifyCode = this.$util.checkVerifyCodeLenght(this.smsVerifyCode);
      //   }
    },
    methods: {
      getLocation: function () {
        let _this = this;
        this.$bridgefunc.getLocation(function (locationinfo) {
          _this.province = locationinfo.province;
          _this.city = locationinfo.city;
        })
      },
      setCity: function () {
        this.province = this.$store.state.location.login.province
        this.city = this.$store.state.location.login.city
      },
      signin() {
        if (this.userPwd === '') {
          Toast({
            message: '请输入密码',
            position: 'bottom',
            duration: 2000,
          });
          return false;
        }
        if (this.userPwd !== this.userPwdAgain) {
          Toast({
            message: '两次输入的密码不一致',
            position: 'bottom',
            duration: 2000,
          });
          return false;
        }
        if (!this.$util.checkPassWord(this.userPwd)) {

          return;
        }
        this.$Loading.open();
        let url = '/app/json/login/register';

        let _this = this;
        this.$http.post(url, {
          phone: this.phone,
          userPwd: this.userPwd,
          smsVerifyCode: this.smsVerifyCode,
          city: this.city ? this.city : '',
          province: this.province ? this.province : '',
          regChannel: '01',
          referrer: '',
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$bridgefunc.customPush({
                path: '/login',
              });
            } else {
              _this.$Loading.close();
              Toast({
                message: data.info ? data.info : '注册失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            Toast({
              message: '注册失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );
      },

      selectCity: function () {
        let _this = this
        this.$store.state.location.selectType = '1'
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/cityselector/0',
            isnativetop: '1'
          });
        })
      },
      getSelectCity: function () {
        let _this = this;
        this.$bridgefunc.getItem('SelectCity', function (result) {
          if (result) {
            _this.$bridgefunc.removeItem('SelectCity');
            let dict = JSON.parse(result);
            let tempProvinceName = dict['provinceName'];
            let tempCityName = dict['cityName'];
            if (tempProvinceName && tempCityName) {
              _this.province = tempProvinceName;
              _this.city = tempCityName;
            }
          }
        })
      }
    },
  };
</script>
