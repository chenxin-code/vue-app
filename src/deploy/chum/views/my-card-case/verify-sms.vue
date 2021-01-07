<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="info-alert">
        <img src="./images/icon-bells.png" alt="" class="alert-icon">
        <span class="text">为了您的账号安全，需要验证您的身份</span>
      </div>
      <div class="user-info">
        当前手机号： {{ phone }}
      </div>
      <div class="captcha-container">
        <input class="verify-input" type="text" placeholder="请输入验证码" v-model="captcha"
               @input="captcha = /^\d{1,6}/.exec(captcha) ? /^\d{1,6}/.exec(captcha)[0] : ''">
        <count-button class="send-btn" @getSmsEvent="getMsgCode" :phone="phone"
                      ref="countBtn"></count-button>
      </div>
      <div class="chum-public-btn submit-btn">
        <van-button
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="submitHandler">下一步
        </van-button>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import CountButton from '@/components/commonui/count-button';

  export default {
    data() {
      return {
        phone: '',
        captcha: '',
      }
    },
    components: {
      'count-button': CountButton
    },
    mounted() {
      this.phone = this.$store.state.login.phone;
    },
    methods: {
      getMsgCode(imgVerifyCode, uuid) {
        if (this.phone == '') {
          this.$Toast('手机号不能为空!')
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
            let data = res.data;
            if (data.status == 0) {
              this.$Toast('获取验证码成功');
            } else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info ? data.info : '获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast(`发送短信失败 ${err}`)
          }
        )
      },
      submitHandler() {
        if (!this.captcha) {
          this.$Toast('请输入验证码')
        } else {
          this.$Loading.open()
          this.$http.post('/app/json/equity_card/verifySmsCode', {
            verifyCode: this.captcha
          }).then(res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.$router.replace({
                path: '/presentation_card',
                query: {
                  equityCardName: this.$route.query.equityCardName,
                  backgroundPic: this.$route.query.backgroundPic,
                  userId: this.$route.query.userId,
                  cardId: this.$route.query.cardId,
                  equityCardId: this.$route.query.equityCardId
                }
              })
            } else {
              this.$Toast(data.info)
            }

            // this.$router.replace({
            //   path: '/presentation_card',
            //   query: {
            //     equityCardName: this.$route.query.equityCardName,
            //     backgroundPic: this.$route.query.backgroundPic,
            //     userId: this.$route.query.userId,
            //     cardId: this.$route.query.cardId,
            //     equityCardId: this.$route.query.equityCardId
            //   }
            // })

          }).catch(err => {
            this.$Loading.close()
            this.$Toast(`verifySmsCode err ${err}`)
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .info-alert {
    height 40px;
    line-height 40px;
    background-color: #FBF8D9;
    display flex;
    align-items center;
    padding 0 20px

    .alert-icon {
      display inline-block;
      width 14px;
      height 14px;
      margin-right 5px;
    }

    .text {
      font-size 12px;
      color #F59B27
    }
  }

  .user-info {
    font-size 16px;
    font-weight 500
    padding 10px 20px;
  }

  .captcha-container {
    height 50px;
    border-radius 5px;
    border 1px solid #ccc;
    margin 5px 20px 0;
    display flex;
    justify-content space-between;
    align-items center;

    .verify-input {
      flex 1;
      font-size 16px;
      padding-left 10px;
    }

    .send-btn {
      font-size 16px
      font-weight 400;
      color #C9A063;
      line-height 50px;
      width 100px;
      text-align center;
    }
  }

  .submit-btn {
    position fixed
    left 20px;
    right 20px;
    bottom 10px;
  }
</style>
