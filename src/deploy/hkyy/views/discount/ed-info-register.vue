<template>
  <div class="ed-rigister-page">
    <nav-top title="专属优惠" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="ed-register">
        <div class="item-div-class">
          <span>姓名</span>
          <input type="text" class="input-class" v-model="userInfo.name" placeholder="请输入姓名">
        </div>
        <div class="item-div-class" v-if="false">
          <span>证件类型</span>
          <input type="text" class="input-class" placeholder="请输入姓名">
        </div>
        <div class="item-div-class" v-if="false">
          <span>身份证号码</span>
          <input type="text" class="input-class" v-model="userInfo.identityCode" placeholder="请输入证件号">
        </div>
        <div class="item-div-class">
          <span>手机号</span>
          <input type="text" class="input-class" placeholder="请输入手机号" v-model="userInfo.phone">
        </div>
        <div class="item-div-class">
          <span>验证码</span>
          <input type="text" class="input-class" v-model="userInfo.verifyCode" style="width: 42%" placeholder="请输入验证码">
          <button class="sendsms-class" :disabled="disabled" @click="sendCheckCode">
            {{sendBtnText}}
          </button>
        </div>
      </div>
      <button class="submit_button" @click="applyExclusiveMemberHandle">立即认证</button>
    </nav-content>
  </div>
</template>

<script>
  import {Popup, Dialog, Toast} from "vant";
  import CountButton from '@/components/commonui/count-button';

  export default {
    name: "ed-info-register",
    components: {
      Popup,
      Dialog,
      Toast,
      CountButton
    },
    data() {
      return {
        totalTime: 60,
        disabled: false,
        interval: null,
        userInfo: {
          name: '',
          phone: '',
          identityCode: '',//身份证号码
          verifyCode: ''//验证码
        },
        sendBtnText: '发送验证码'
      }
    },
    methods: {
      //获取验证码
      sendCheckCode() {
        if (!this.userInfo.phone || this.userInfo.phone == '') {
          this.$Toast('手机号不能为空');
          return;
        }
        if (!this.$util.checkMobile(this.userInfo.phone)) {
          this.$Toast('请输入正确的手机号码');
          return;
        }
        this.$Loading.open()
        let url = '/platform/json/wechat/sendCheckCode';
        let params = {
          token: this.$store.state.login.token,
          phone: this.userInfo.phone,
          type: 5
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status === 0 && data.data && data.data == 'success') {
            this.$Toast('验证码发送成功，请查收')
            this.interval = setInterval(() => {
              if (this.totalTime > 0) {
                this.disabled = true;
                this.totalTime--
                this.sendBtnText = this.totalTime + 's'
              } else {
                if (this.interval) {
                  this.disabled = false;
                  this.totalTime = 60;
                  this.sendBtnText = '重新发送';
                  clearInterval(this.interval);
                  this.interval = null
                }
              }

            }, 1000)
          } else {
            this.$Toast(data.info || '验证码发送失败，请重新发送')
          }
        }).catch(error => {
          this.$Loading.close()
        });
      },
      //专属会员认证
      applyExclusiveMemberHandle() {
        if (this.userInfo.name.trim() === '') {
          this.$Toast('请输入姓名');
          return
        }
        // if (this.userInfo.identityCode.trim() === '') {
        //   this.$Toast('请输入身份证号码');
        //   return
        // }
        // let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        // if (!reg.test(this.userInfo.identityCode)) {
        //   this.$Toast('请输入正确的身份证号码');
        //   return
        // }
        if (this.userInfo.phone.trim() === '') {
          this.$Toast('请输入手机号');
          return
        }
        if (!this.$util.checkMobile(this.userInfo.phone)) {
          this.$Toast('请输入正确的手机号码');
          return;
        }
        if (this.userInfo.verifyCode.trim() === '') {
          this.$Toast('请输入验证码');
          return
        }
        this.$Loading.open()
        let url = '/platform/json/exclusive_member/applyExclusiveMember'
        let params = {
          token: this.$store.state.login.token,
          name: this.userInfo.name,
          // identityCode: this.userInfo.identityCode,
          phone: this.userInfo.phone,
          verifyCode: this.userInfo.verifyCode,
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status === 0) {
            this.$Toast('专属会员认证成功');
            //认证成功
            this.$bridgefunc.customPush({
              path: "/hkedstation",
              query: {}
            });
          } else {
            this.$Toast(data.info || '专属会员认证失败');
          }
        }).catch(error => {
          this.$Loading.close()
          this.$Toast('专属会员认证异常');
        })
      }
    },
    created() {
    },
    mounted() {
    },
    destroyed() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  $item-height = 35px
  $item-interval = 10px
  $base-color = #ff3d34
  $border-radius = 5px
  .ed-rigister-page {
    width: 100%;
    height: 100%;
    background-color: red;
    position: relative;
    .ed-register {
      margin-top 10px
      padding 10px 0
      width: 90%;
      margin-left 5%
      border-radius 10px
      border 0.5px solid #e7dbdb
      box-shadow: 0px 0px 5px #e7dbdb;
      display flex
      flex-direction column
      align-items center
      justify-content center
      .item-div-class {
        width 90%
        display flex
        flex-direction row
        line-height $item-height
        justify-content space-between
        margin-top $item-interval
        font-size $font-size-medium-s
        .input-class {
          border 0.8px solid #dddddd
          width: 75%;
          color #333
          outline none
          border-radius $border-radius
          padding-left 5px
          text-shadow: none;
          -webkit-appearance: none;
          -webkit-user-select: text;
          outline-color: transparent;
          box-shadow: none;
          font-size $font-size-medium-s
        }
        span {
          width: 22%;
          text-align right
        }
        .sendsms-class {
          height: 35px;
          background #fb3f19
          width: 29%;
          border-radius 17px
          border 0
          color white
          font-size $font-size-medium-s
          text-align: center
        }
      }
    }
    .submit_button {
      width 90%
      margin-left 5%
      background #fb3f19
      border-radius 20px
      border 0
      height 40px
      margin-top 20px
      color white
      font-size $font-size-medium-x
      font-weight 500
    }
    button:active {
      opacity 0.8
    }
  }
</style>
