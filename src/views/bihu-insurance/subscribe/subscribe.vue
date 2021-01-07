<template>
  <div class="subscribe-container">
    <nav-top @backEvent="$router.go(-1)" :bgImg="'1'" :navTopStyle="{background: 'transparent'}" title="预约报价"
             :noBack="true"></nav-top>
    <nav-content class="container">
      <img class="title" src="./images/text.png" alt="">
      <div class="form-container table-view">
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">车牌号</div>
            <div class="right">
              <div class="arrow" @click="showlicenseNo">
                <span>{{licenseText}}</span>
                <i class="icon iconfont mall-arrow-down"></i>
              </div>
              <input v-model="licenseName" type="text" @focus="focus" @touchstart.stop readonly
                     class="form-control" placeholder="请输入车牌号码">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">手机号</div>
            <div class="right">
              <input v-model="formData.licensePhone" :maxlength="11" placeholder="请输入11位联系手机号" class="form-control">
            </div>
          </div>
        </div>
        <div class="table-view-cell">
          <div class="table-view-cell-text">
            <div class="left">客户姓名</div>
            <div class="right">
              <input v-model="formData.licenseOwner" placeholder="请输入客户姓名" class="form-control">
            </div>
          </div>
        </div>
        <!--        <div class="table-view-cell">-->
        <!--          <div class="table-view-cell-text">-->
        <!--            <div class="left">推荐码</div>-->
        <!--            <div class="right"><input type="text" v-model="formData.referralCode" class="form-control"-->
        <!--                                      placeholder="请输入推荐码" readonly></div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <div class="footer-btn" @click="updateReferralInfo">
        <img class="img" src="./images/btn.png" alt="">
      </div>
      <div class="referCode">车险推荐码：{{formData.referralCode}}</div>
    </nav-content>
    <virtual-keyboard v-bind:show.sync="show" :type="type" @input="inputKey" @delete="deleteKey"></virtual-keyboard>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from "vant";
  import VirtualKeyboard from "@/components/base/virtual-keyboard";

  export default {
    name: 'subscribe',
    data() {
      return {
        value: '',
        show: false, //高级键盘
        keyboardShow: false, //数字键盘
        type: 1,
        formData: {
          licenseNo: '', // 车牌号
          licenseOwner: '', // 客户姓名
          licensePhone: '', // 车主手机号
          referralCode: '', //推荐码
          token: this.$store.state.login.token
        },
        licenseText: '京', //各省简称
        licenseName: '', //车牌号
      }
    },
    mounted() {
      this.formData.referralCode = this.$route.query.rfrCode || ''
    },
    methods: {
      inputKey(val) {
        console.log(val,this.type);
        if (this.type == 1) {
            this.licenseText = val;
        } else {
          if (this.licenseName.length < 7) {
            this.licenseName = this.licenseName + val;
          }
        }
      },
      deleteKey() {
        this.licenseName = this.licenseName.substr(0, this.licenseName.length - 1);
      },
      focus() {
        this.type = 2
        this.show = true;
        document.activeElement.blur();
      },
      showlicenseNo() {
        this.type = 1
        this.show = true;
        document.activeElement.blur();
      },
      onInput(value) {
        this.formData.licensePhone += value
      },
      onDelete() {
        this.formData.licensePhone = this.formData.licensePhone.substring(0, this.formData.licensePhone.length - 1)
      },
      updateReferralInfo() {
        this.formData.licenseNo = `${this.licenseText}${this.licenseName}`
        if (this.formData.licenseNo.length == 7 || this.formData.licenseNo.length == 8) {
        } else {
          Toast({
            message: '请输入7位或8位车牌号',
            duration: 2000,
          });
          return;
        }
        if (!this.formData.licensePhone || (this.formData.licensePhone && !(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.formData.licensePhone)))) {
          Toast({
            message: '请输入正确的手机号',
            duration: 2000,
          });
          return;
        }
        if (!this.formData.referralCode) {
          Toast({
            message: '请输入推荐码',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open()
        this.$http.post('/app/json/app_car_insure/updateReferralInfo', this.formData).then(res => {
          this.$Loading.close();
          if (res.data.result == 'success') {
            Toast.success("预约成功")
            this.$router.push({
              path: '/insurance/success'
            })
          } else {
            Toast(res.data.info)
          }
        })
      }
    },
    components: {
      VirtualKeyboard
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .subscribe-container {
    background: url('./images/bg.png') no-repeat
    background-size: 100% 100%;

    .title {
      width 80%;
      margin 40px auto
      display block
    }

    .form-container {
      width 90%;
      display block
      border-radius 5px;
      overflow hidden
      margin 30px auto

      .table-view-cell {
        border-radius 0;
        padding 10px;
      }

      .form-control {
        height 34px;
        line-height: 34px;
        text-align right
      }
    }

    .footer-btn {
      width 70%;
      margin 0 auto

      .img {
        width 100%
      }
    }

    .referCode {
      color: #818384;
      font-size: 16px;
      text-align: center;
      padding: 8px;
    }
  }

  .right {
    .arrow {
      margin: auto;
      border: 1px solid #dcdcdc;
      padding: 3px 10px;
      border-radius: 6px;
      display flex

      span {
        margin auto
      }

      .iconfont {
        margin auto
      }
    }
    display flex
  }
</style>
