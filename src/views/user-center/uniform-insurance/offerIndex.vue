<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="预约报价">
      <div class="shareBox" @click="history">
       <span>历史报价</span>
      </div>
    </nav-top>
    <nav-content>
      <div>
        <SubPage :divKeywords="'CXBJDiv'"></SubPage>
        <!--<div class="img">-->
          <!--<img src="static/image/microShop/baojia1.png" alt="">-->
        <!--</div>-->
        <div class="contentDiv">
            <van-cell-group>
            <van-field v-model="licenseNo" @focus="focus" @input="checklicenseNo" @touchstart.stop readonly label="车牌号" placeholder="输入车牌号" :error-message="licenseNoError" error-message-align='right' required/>
            <van-field v-model="carOwnerPhone"  @input="checkcarOwnerPhone" label="手机号" placeholder="输入11位联系手机号" :error-message="carOwnerPhoneError" error-message-align='right' required/>
            <van-field v-model="carOwnerName" @input="checkcarOwnerName" label="姓名" placeholder="请填写您的姓名" :error-message="carOwnerNameError" error-message-align='right' required/>
            <van-cell-group>
            <div class="taiBtn">
              <span>是否过户车辆</span>
              <van-switch active-color="#f44" size="24px" v-model="isTransfer"/>
            </div>
          </van-cell-group>
            <van-field v-model="frameNo" label="车架号" placeholder="输入车架号"/>
            <van-field v-model="engineNo" label="发动机号" placeholder="输入发动机号"/>
            <van-field v-model="rfrCode" label="推荐码" placeholder="非必填"/>
            <van-field label="您的信息将被严格保密" required disabled/>
          </van-cell-group>
          <div class="answer theme_bg_red" @click="commit">一键投保</div>
        </div>
      </div>
    </nav-content>
    <virtual-keyboard :show="show" @input="inputKey" @delete="deleteKey" @blur="show = false"></virtual-keyboard>
  </div>
</template>

<script>
  import api from './api'
  import {Toast} from 'vant'
  import VirtualKeyboard from '@/components/base/virtual-keyboard'
  import SubPage from '@/components/product/index/subpage/subpage'

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        licenseNo: '',
        carOwnerPhone: '',
        carOwnerName: '',
        licenseNoError:'',
        carOwnerPhoneError:'',
        carOwnerNameError:'',
        isTransfer: true, //1是,0否
        frameNo: '',
        engineNo: '',
        rfrCode: '',
        show: false,
      }
    },
    methods: {
      history() {
        this.$router.push({
          path: '/user_center/offerlist'
        })
      },
      deleteKey() {
        this.licenseNo = this.licenseNo.substr(0, this.licenseNo.length - 1)
      },
      focus() {
        this.show = true
        document.activeElement.blur()
      },
      checklicenseNo(){
        if(this.licenseNo.length < 7){
          this.licenseNoError = "请输入7位车牌号";
        }else{
          this.licenseNoError = "";
        }
      },
      checkcarOwnerPhone(){
        if(this.carOwnerPhone && !(/^1(3|4|5|7|8|9)\d{9}$/.test(this.carOwnerPhone))){
          this.carOwnerPhoneError = "请输入正确的手机号";
        }else{
          this.carOwnerPhoneError = "";
        }
      },
      checkcarOwnerName(){
        if(!this.carOwnerName){
          this.carOwnerNameError = "请输入姓名";
        }else{
          this.carOwnerNameError = "";
        }
      },
      inputKey(val) { //限制7位
        console.log(val);
        if (this.licenseNo.length < 7) {
          this.licenseNo = this.licenseNo + val
        }
      },
      commit() {
        let that = this
        let params = {
          token: that.$store.state.login.token,
          licenseNo: that.licenseNo,
          carOwnerPhone: that.carOwnerPhone,
          frameNo: that.frameNo,
          engineNo: that.engineNo,
          rfrCode: that.rfrCode,
          isTransfer: that.isTransfer?1:0,
          carOwnerName : that.carOwnerName 
        }
        console.log(params);
        if (that.licenseNo.length != 7) {
          that.$Toast('请输入7位车牌号')
          return
        }
        if (!params.carOwnerPhone) {
          Toast({
            message: '请输入手机号',
            duration: 2000,
          });
          return;
        }
        if (params.carOwnerPhone && !(/^1(3|4|5|7|8|9)\d{9}$/.test(params.carOwnerPhone))) {
          Toast({
            message: '请输入正确的手机号',
            duration: 2000,
          });
          return;
        }
        this.$Loading.open()

        that.commitData(params).then(res => {
          this.$Loading.close()
          if (res.data.result === 'success') {
            that.$router.push({
              path: '/user_center/offer_success'
            })
          } else {
            Toast(res.data.info)
          }
        })
      }
    },
    components: {
      SubPage,
      VirtualKeyboard
    },
    created() {
      this.carOwnerPhone = this.$store.state.userInfo.phone
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10
      span {
        font-size 14px;
      }
    }
    .img {
      width 100%
      img {
        width 100%;
      }
    }
    .contentDiv {
      margin-top 10px;

      .radioBtn {
        .radioBtnDiv {
          display: flex;
          justify-content: space-around;

          .van-radio {
            margin-right 25px;
          }
        }
      }

      .van-radio-group {
        display: flex;
        justify-content: space-between;
        padding: 0.266667rem 0.4rem;
        line-height: 0.64rem;
        font-size: 0.373333rem;
      }

      .answer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        font-size: 18px;

        a {
          display: block;
          width: 100%;
          height: 50px;
          line-height: 50px;
          color: white;
          font-size: 18px;
        }
      }
    }
  }

  .van-cell-group {
    /deep/ .van-field__control {
      text-align: right;
    }

    /deep/ .van-field__control:disabled {
      color: #323233;
    }
  }

  /deep/ .nav-content {
    overflow-y auto !important
    margin-bottom 55px;
  }

  /deep/ .van-cell--required .van-field__label {
    width auto !important
  }
     .taiBtn {
        line-height: 0.64rem;
        padding: 0.266667rem 0.4rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.373333rem;
      }
</style>
