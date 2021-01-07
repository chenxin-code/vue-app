<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="idcontent-root">
      <div class="tiparea">
        <img src="../userimgs/edit_notice.png"/>
        <div>因会员卡部分权益需要使用您的身份信息，请你务必如实填写。</div>
      </div>
      <div class="info-edit">
        <div class="info-row">
          <div class="inputrow">
            <van-field
              label="普通护照号"
              v-model="idcardNum"
              placeholder="请输入您的护照号"
              @blur="cardCodeBlur"
            />
          </div>
        </div>
        <div class="info-row">
          <div class="inputrow">
            <van-field
              label="公务护照号"
              v-model="pubPassportNum"
              placeholder="请输入您的护照号"
              @blur="cardCodeBlur"
            />
          </div>
        </div>
      </div>
      <div class="chum-public-btn submit-btn">
        <van-button
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="submitHandler">提交
        </van-button>
      </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        idcardNum: "",
        pubPassportNum: '',
      };
    },
    methods: {
      submitHandler() {
        if (this.idcardNum == '' && this.pubPassportNum == '') {
          this.$Toast('请输入普通护照号码或公务护照号码');
          return;
        } else {
          let isPass = true
          if (this.idcardNum) {
            if (this.$util.checkPassport(this.idcardNum) == false) {
              this.idcardNum = ''
              isPass = false
            }
          }
          if (this.pubPassportNum) {
            if (this.$util.checkPassport(this.pubPassportNum) == false) {
              this.pubPassportNum = ''
              isPass = false
            }
          }
          if (isPass) {
            this.$request.post('/app/json/user/passportSubmmit', {
              cateType: 1,
              pubPassportNum: this.pubPassportNum, // 公务护照号
              passportNum: this.idcardNum,// 普通护照号
            }).then(res => {
              if (res.status === 0) {
                this.$router.go(-1);
              } else {
                this.$Toast(res.info ? res.info : '提交失败')
              }
            })
          } else {
            this.$Toast('护照号填写有误');
          }
        }
      },
      cardCodeBlur(event) {
        if (this.$util.checkPassport(event.target.value) == false) {
          this.$Toast('证件号输入错误');
        }
      },
    }
  };
</script>
<style lang="stylus" scoped>
  @import '~@/deploy/chum/assets/stylus/chum-public.styl';

  .idcontent-root {
    display: flex;
    flex-direction: column;

    .tiparea {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
      padding: 5px 20px;
      background-color: #FBF8D9;
      color: #F59B27;
      font-size: 11px;
      font-weight: 600;

      img {
        margin-right: 8px;
        width: 15px;
      }

      div {
        font-weight: 500;
      }
    }

    .info-edit {
      padding: 20px 20px;

      .info-row {
        margin-bottom: 8px;

        .inputrow {
          border: 0.8px solid #CFCFCF;
          border-radius: 5px;
          height: 50px;
          padding: 1px 5px;
        }
      }
    }
  }

  .submit-btn {
    position absolute;
    left 20px;
    right 20px;
    bottom 10px;
  }
</style>
