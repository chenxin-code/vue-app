<template>
  <div class="cancel-user login2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="content">
        <div class="haveHand" v-if="!isSuccess">
          <span>短信验证码将发送至 <i>{{phone(userInfo.phone)}}</i></span>
          <van-field v-model="verifyCode" label-width='60px' center size='large' label="验证码" placeholder="请输入验证码" >
            <template #button>
              <count-button class="theme_standard_font"  @getSmsEvent="getMsgCode"  :phone="userInfo.phone" ref="countBtn"></count-button>
            </template>
          </van-field>
          <div class="common-btn theme_bg_red theme_font_white mt100" @click="cancelRequest">确定</div>
        </div>
        <div class="success" v-else>
          <div class="tip">
            <van-icon name="checked" color="#00c200" size="50"/>
            <span>账号<i>{{phone(userInfo.phone)}}</i> 已成功注销</span>
          </div>
          <div class="common-btn theme_bg_red theme_font_white mt100" @click="goHome">前往APP首页</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
 import vercodebtn from '@/components/base/vercodebtn'
 import CountButton from '@/components/commonui/count-button';
  export default {
    name: "authentication",
    components: {
      CountButton
    },
    data() {
      return {
        isSuccess: false,
        verifyCode: ''
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    methods: {
      phone(str) {
        let pat=/(\d{3})\d*(\d{4})/
        return str.replace(pat,'$1****$2');
      },
      getMsgCode(imgVerifyCode,uuid){
        if(this.phone == ''){
          this.$Toast( '手机号不能为空!' )
          return
        }
        else if (!this.$util.checkMobile(this.userInfo.phone)) {
          this.$Toast('请输入正确的手机号码！')
          return
        }
        this.$refs.countBtn.startTime();
        this.$Loading.open();
        let url = '/app/json/login/sendSms';

        let paramsData = {
          smsType: '1020',
          phone: this.userInfo.phone,
          imgVerifyCode: imgVerifyCode,
          uuid: uuid
        };

        this.$http.post(url,paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if(data.status == 0){
              this.$Toast('获取验证码成功');
            }else {
              this.$refs.countBtn.resetClock();
              this.$Toast(data.info?data.info:'获取短信验证码失败')
            }
          },
          err => {
            this.$Loading.close();
            this.$refs.countBtn.resetClock();
            this.$Toast('系统运行过程中遇到问题，请稍候再试')
          }
        )
      },
      cancelRequest: function () {
        if (!this.verifyCode) {
          this.$Toast('请输入验证码')
          return
        }
        this.$Loading.open()
        let url = '/app/json/user/cancelUser';
        let params1 = {
          verifyCode: this.verifyCode,
          token: this.$store.state.login.token,
        };
        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            this.$Toast('注销成功！')
            this.isSuccess = true
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('获取数据失败')
        });
      },
      backEvent() {
        if (this.isSuccess) {
          this.$userCenter.loginOut(-3)
        } else {
          this.$router.go(-1)
        }
      },
      goHome() {
        this.$userCenter.loginOut(-3)
      }
    },
    created() {
    }
  }
</script>
<style lang="stylus" scoped type="text/stylus">
  .cancel-user {
    width 100%
    height 100%
    overflow hidden
    .content {
      padding 20px;
      .mt100 {
        margin-top 40px
      }
      span {
        font-size 12px
        i {
          font-style normal
          margin-left 10px
          font-size 16px
        }
      }
      .haveHand {
        color #868686
        
        /deep/ .van-cell {
          padding 24px 0
        }
        .mt100 {
          margin-top 40px
        }
      }
      .success {
        margin-top 20px
        .tip {
          height 100px
          display flex
          justify-content space-between
          flex-direction column
          align-items center
          // i {
          //   font-size 12px
          // }
        }
      }
    }
  }
</style>
