<template>
  <div class="login login-about">
    <div class="radius-form outLine">
      <form class="form">
        <div class="cells">
          <div class="cell">
            <div class="cell__hd">
              <div class="icon">
                <img class="full-img" src="@/assets/login/login-icon1.png">
              </div>
            </div>
            <div class="cell__bd">
              <input type="text" @input="inputChange" placeholder="请输入用户名或手机号" v-model="phone">
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
          </div>
        </div>
      </form>
    </div>

    <div class="btn-box" @click="bindClick">
      <div class="btn">
        确认绑定
      </div>
    </div>

    <div class="col">
      <div class="col-cell">
        <div class="col-item" @click="goToRegister">账号注册</div>
        <!--<div class="col-item fast" @click="goToForgetPwd">-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui';
  import {MP} from '@/utils/map'
  import {mapGetters} from 'vuex'

  export default {
    name: 'login',
    components: {
      Indicator,
      Toast
    },
    computed: {
      ...mapGetters([
        'location',
        'login'
      ]),
    },
    data() {
      return {
        phone: '',
        aliOpenId: '',
        userPwd: '',
        savePwdStatus: false,
        province: '',
        city: ''
      };
    },
    created() {
    this.aliOpenId = this.$route.query.aliOpenId ? this.$route.query.aliOpenId : ''

    },
    methods: {
      inputChange:function(e){
        var value = e.target.value ;
        var reg =/[\u4e00-\u9fa5]/g;
        let str1 = value.replace(reg, "")
        this.phone = str1;
        // return str1;
      },
      // 绑定
      bindClick: function () {
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
        Indicator.open('绑定中');
        let pwd = this.userPwd;
        let url = '/app/json/login/aliBind';

        let params = {
          aliOpenId: this.aliOpenId,
          phone: this.phone,
          userPwd: pwd,
        };
        let _this = this
        this.$http.post(url, params).then(res => {
            Indicator.close();
            let data = res.data;
            if (data.status == 0) {
              // 保存密码 or 清除保存的密码
              _this.login.phone = _this.phone
              if (this.savePwdStatus == true) {
                _this.login.password = _this.userPwd
                _this.login.savePWD = _this.savePwdStatus ? '1' : '0'
              } else {
                _this.login.password = ''
                _this.login.savePWD = _this.savePwdStatus ? '1' : '0'
              }

              _this.$store.state.indexData.province = _this.province
              _this.$store.state.indexData.city = _this.city

              _this.$userCenter.retsetToIndex(data.data);

            } else {
              Toast({
                message:data.info ? data.info : '绑定失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            Indicator.close();
            console.log('绑定失败', error);
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
          path: '/register3',
          isnativetop:'1'
        });
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
  .outLine{
    margin-top 20px
  }
</style>

