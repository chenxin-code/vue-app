<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="info-alert">
        <img src="./images/icon-bells.png" alt="" class="alert-icon">
        <span class="text">因会员卡部分权益需要使用您的身份信息,请务必如实填写</span>
      </div>
      <div class="form-container">
        <div class="item">
          <div class="label">真实姓名</div>
          <van-field class="form-input" v-model="formData.name" placeholder="请输入您的真实姓名"/>
        </div>
        <div class="item">
          <div class="label">身份证</div>
          <van-field class="form-input" v-model="formData.idcardNum" placeholder="请输入您的身份证号" @blur="cardCodeBlur"/>
        </div>
        <div class="item">
          <div class="label">出生日期</div>
          <div @click="isShowDatePicker = true">
            <van-field class="form-input" v-model="showBirthday" placeholder="点击选择出生日期" readonly/>
          </div>
        </div>
        <div class="item">
          <div class="label">性别</div>
          <div class="gender-content">
            <div
              class="item"
              @click="choseGender(item, index)"
              :class="{active: index == activeIndex}"
              v-for="(item, index) in genderList" :key="index">{{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="chum-public-btn">
        <div class="protocol-c" @click="isShowProModal = true">
          <img src="../../assets/images/icon-unselected.png" alt="" class="protocol-state" v-if="!isAgree">
          <img src="../../assets/images/icon-select.png" alt="" class="protocol-state" v-else>
          <span>我已阅读并同意</span>
          <span class="red">《CHUM付费会员开通协议》</span>
        </div>
        <van-button
          class="btn"
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="confirmHandler">确定激活
        </van-button>
      </div>
    </nav-content>
    <MemberProtocol v-model="isShowProModal" @getProtocolResult="getProtocolResult"></MemberProtocol>
    <van-popup v-model="isShowDatePicker" position="bottom">
      <van-datetime-picker
        v-model="tempBirthday"
        :min-date="minDate"
        :max-date="maxDate"
        type="date"
        @confirm="confirmChoseBirthday"
        @cancel="isShowDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
  import MemberProtocol from './components/member-protocol.vue'
  import moment from 'moment';
  import {Dialog} from 'vant';

  export default {
    name: "perfect-information",
    data() {
      return {
        formData: {
          name: '',
          idcardNum: '',
          birthDate: '',
          cateType: 0,
        },
        genderList: ['男', '女'],
        activeIndex: 0,
        isAgree: false,
        isShowProModal: false,
        isShowDatePicker: false,
        showBirthday: '',
        tempBirthday: new Date('1990-01-01'),
        minDate: new Date(moment().subtract(70, 'y').format('YYYY-MM-DD')),
        maxDate: new Date(),
      }
    },
    components: {
      MemberProtocol,
    },
    methods: {
      choseGender(item, index) {
        this.activeIndex = index;
      },
      cardCodeBlur() {
        if (this.formData.idcardNum == "") {
          this.$Toast("证件号不能为空");
          return;
        } else if (this.$util.identityCodeValid(this.formData.idcardNum) == false) {
          this.$Toast("证件号输入错误");
          return;
        } else {
          this.showBirthday = this.$util.getBirth(this.formData.idcardNum);
          this.formData.birthDate = this.$util.getBirth(this.formData.idcardNum).replace('年', '-').replace('月', '-').replace('日', '')
        }
      },
      confirmHandler() {
        if (!this.formData.name) {
          this.$Toast('请输入姓名')
          return false;
        } else if (!this.formData.idcardNum) {
          this.$Toast('请输入身份证号码')
          return false;
        } else if (this.$util.identityCodeValid(this.formData.idcardNum) == false) {
          this.$Toast('证件号输入错误')
          return false;
        } else if (!this.formData.birthDate) {
          this.$Toast('请选择出生日期')
          return false;
        } else if (!this.isAgree) {
          this.$Toast('请先阅读并同意协议条款！')
          return false;
        }
        if (this.activeIndex == 0) { // 男
          this.formData.sex = 1
        } else if(this.activeIndex == 1) { // 女
          this.formData.sex = 2
        }
        this.$Loading.open()
        this.$http.post('/app/json/user/identifySubmmit', this.formData).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.toActivationCard();
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`identifySubmmit err ${err}`)
        })
      },
      toActivationCard() {
        this.$Loading.open()
        this.$http.post('/app/json/equity_card/activationCard', {
          id: this.$route.query.cardId
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            Dialog.alert({
              title: '提示',
              message: '激活成功！',
            }).then(() => {
              this.$router.go(-1);
            });
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`activationCard err ${err}`)
        })
      },
      getProtocolResult(result) {
        this.isAgree = result;
      },
      confirmChoseBirthday(value) {
        this.formData.birthDate = moment(value).format('YYYY-MM-DD')
        this.showBirthday = moment(value).format('YYYY年MM月DD')
        this.isShowDatePicker = false
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import '~@/deploy/chum/assets/stylus/chum-public.styl'
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    padding-bottom 104px;
    overflow-y auto;

    .info-alert {
      height 40px;
      line-height 40px;
      background-color: #FBF8D9;
      display flex;
      align-items center;
      padding 0 10px

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

    .form-container {
      margin 0 20px;

      .item {
        .label {
          font-size 16px;
          font-weight 500;
          margin-top 5px;
        }

        .form-input {
          height 50px;
          border 1px solid rgba(207, 207, 207, 1);
          border-radius 5px;
          margin-top 10px;

          /deep/ .van-field__control {
            font-size 16px;
          }
        }
      }

      .gender-content {
        display flex;
        margin-top 10px;
        justify-content flex-start
        .item {
          width 30%;
          height 50px;
          line-height 50px;
          text-align center;
          font-size 16px;
          font-weight 500;
          border-radius 5px;
          border 1px solid #ccc;
          color #9FA0A0
          margin-left 15px;
          &:first-child {
            margin-left 0
          }

          &.active {
            color #000;
            background-image: linear-gradient(180deg, #E6CE9C, #C9A063);
            border-color #E6CE9C
          }
        }
      }
    }

    .chum-public-btn {
      position fixed
      left 0
      right 0
      bottom 0
      background-color: #fff
      padding-top 10px;

      .protocol-c {
        font-size 13px;
        display flex;
        justify-content center;
        align-items center;

        .protocol-state {
          display block;
          width 20px;
          height 20px;
          margin-right 4px
        }

        span.red {
          color $color-theme-r
        }
      }

      .btn {
        width 90%;
        margin 15px auto 10px
      }
    }
  }

</style>
