<template>
  <div class="body">
    <nav-top :title="obj.title" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="tipDiv">
        <p class="box">银行信息</p>
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_VIPNumber.png" alt="">
                <span>用户姓名</span>
              </div>
              <div class="center"><input type="text" v-model="obj.custName" disabled="disabled"></div>
            </div>
          </div>
          <!-- <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_lei.png" alt="">
                <span>证件类型</span>
              </div>
              <div class="center"><input disabled placeholder="公民身份证" type="text"></div>
            </div>
          </div> -->
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_lei.png" alt="">
                <span>证件号码</span>
              </div>
              <div class="center"><input placeholder="请输入证件号码" type="text" v-model="obj.idcardNum" disabled="disabled"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_ka.png" alt="">
                <span>签约卡类型</span>
              </div>
              <div class="center right1">
                <mt-field v-model="obj.cardStyle" disabled="disabled">
                </mt-field>
              </div>
            </div>
          </div>
          <div class="table-view-cell" v-if="obj.cvn2">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_ka.png" alt="">
                <span>贷记卡CVV2</span>
              </div>
              <div class="center"><input placeholder="请输入贷记卡" type="text"
                                         v-model="obj.cvn2" disabled="disabled"></div>
            </div>
          </div>
          <div class="table-view-cell" v-if="obj.expired">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_ka.png" alt="">
                <span>贷记卡到期日</span>
              </div>
              <div class="center"><input placeholder="格式：0719,代表2019年7月" type="text"
                                         v-model="obj.expired" disabled="disabled"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_NO.png" alt="">
                <span>银行卡号</span>
              </div>
              <div class="center"><input type="text" v-model="obj.cardNo" disabled="disabled"></div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">
                <img class="img1" src="static/image/janePay/icon_code.png" alt="">
                <span>验证码</span>
              </div>
                <input class="int" v-model="inputValue" placeholder='请输入验证码'/>
                <button :disabled="codeBtnStatus" @click="getCode" class="auth-code" v-if="obj.title=='农行签约信息'">{{codeText}}</button>
            </div>
          </div>
<!--          <div class="div">-->
<!--            <input v-model="inputValue" placeholder='请输入验证码'/>-->
<!--            <button :disabled="codeBtnStatus" @click="getCode" class="auth-code">{{codeText}}</button>-->
<!--          </div>-->
          <div class="btns">
            <div class="div2" @click="nextIndex">下一步</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import api from './api'
  export default {
    name: "next-message",
    mixins: [api],
    data() {
      return {
        codeBtnStatus: false,
        sec: 60,
        codeText: '重试',
        inputValue: '', //输入的短信验证码
        obj: {},
        cardStyle: '',
        cardType: '',
      }
    },
      computed: {
    ...mapGetters(["userInfo"])
  },
    mounted() {
      this.obj = this.$route.query.dataParams || {}
      console.log(555,this.obj,this.userInfo.phone);
    },
    methods: {
      nextIndex() {
        let that = this
        if (!that.inputValue) {
          this.$Toast('请输入验证码')
          return
        }
        let paramsData = {
          token: this.$store.state.login.token,
          payModelSub: that.obj.payModelSub?that.obj.payModelSub: '',
          tradeNo: that.obj.tradeNo,
          idCardNo: that.obj.idCardNo,
          plateNo: that.obj.plateNo,
          phone: this.userInfo.phone,
          custName: that.obj.custName,
          signType: that.obj.signType,
          generateKey: that.obj.generateKey,
          cardNo: that.obj.cardNo,
          plateColor: that.obj.plateColor,
          cardType: that.obj.cardType,
          custCertType: that.obj.custCertType,
          returnUrl: window.location.origin + "/app-vue/app/index.html#/jane/complete",
          umsVerifyCode: that.inputValue?that.inputValue:'' // 验证码
        }

        this.$Loading.open()
        that.messageData(paramsData).then(res => {
          this.$Loading.close()
          if (res.data.result == 'success') {
            that.$router.replace({
              path: '/jane/complete',
              query: {
                id: that.obj.signId,
                type: 'nextType'
              }
            })
          } else {
            this.$toast(res.data.info)
          }
        })
      },
      /**
       * 获取验证码
       */
      getCode: function () {
        // this.countDown()
        this.sendPhoneCode()
        this.codeBtnStatus = true
      },
      /**
       * 倒计时展示
       */
      countDown: function () {
        let that = this
        let time = null
        if (that.sec === 0) {
          that.sec = 60
          that.codeBtnStatus = false
          that.codeText = '重试'
          clearTimeout(time)
        } else {
          that.inputValue = ''
          that.sec--
          that.codeText = `${that.sec}s重新发送`
          let time = setTimeout(function () {
            that.countDown()
          }, 1000)
        }
      },
      sendPhoneCode: function () {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          payModelSub: that.obj.payModelSub,
          tradeNo: that.obj.tradeNo,
          cardNo: that.obj.cardNo // 卡号
        }

        that.duanxinData(params).then(res => {
          console.log(111, res);
          if (res.data.result == 'success') {
            this.countDown()
            this.$Toast('发送成功')
          } else {
            this.$Toast(res.data.info || '发送失败！')
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    font-size 16px;

    .tipDiv {
      border-top 1px solid #e5e5e5;

      .box {
        width 94%;
        margin 10px auto;
        padding 10px 8px;
      }

      .carint {
        width 140px;
      }

      /deep/ .table-view .table-view-cell .table-view-cell-text .left {
        width 135px;

        .img1 {
          width 30px;
          vertical-align middle
        }

        /deep/ .mint-field-core {
          font-size: 14px;
          color: #cdcbcc;
        }
      }
    }

    /deep/ .mint-field-core {
      background white
    }

    .btns {
      margin-top 50px;
      margin-bottom 40px;

      /deep/ .van-radio {
        justify-content center
      }

      .div1 {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .div2 {
        width: 200px;
        height: 40px;
        border: 1px solid #e07122;
        border-radius: 23px;
        text-align: center;
        line-height: 40px;
        color: #f76a09;
        font-size: 16px;
        margin: 0 auto;
      }
    }
  }

  /deep/ .van-checkbox {
    justify-content center
  }

  /deep/ .mint-cell-wrapper {
    padding 0
  }

  /deep/ .iconfont {
    margin-right 20px !important;
  }

  /deep/ .mint-field-other {
    /*right 4px;*/
  }

  input:disabled {
    background-color: white;
  }

  .radioBtn {
    .radioBtnDiv {
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
    }
  }

  #xialaView {
    top auto;
    width 100%
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }

  /deep/ .van-radio__label {
    font-size 12px;
    margin-left 3px;
  }
  .int {
    width 100px;
    margin-left 25px
  }
    .auth-code {
      padding-left 6px;
      border: none;
      border-left: 1px solid;
      color: #f76a09;
      font-size 14px;
      background: transparent;
    }
  .div2 {
    width: 200px;
    height: 40px;
    border: 1px solid #e07122;
    border-radius: 23px;
    text-align: center;
    line-height: 40px;
    color: #f76a09;
    font-size: 16px;
    margin: 0 auto;
  }
  .div {
    margin 40px 20px 80px 20px
    display flex;
    height 45px;
    border-bottom: 1px solid #f6f2f2;
    justify-content space-between
    input {
      height: 40px;
      width: 60%;
    }
    button {
      height: 40px;
      padding 0 20px;
      border: none;
      color: #f76a09;
      font-size 14px;
      background: transparent;
    }
  }
</style>
