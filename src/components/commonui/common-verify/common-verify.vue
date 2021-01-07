/**Created by liaoyingchao on 2019-10-10.*/

<template>
  <div class="common-verify" v-if="visible">
    <GraphicsWordVerify v-if="verifyType == 'graphics_word' && verifyData" :verifyData="verifyData" @cancelEvent="cancelEvent" @getVertifyDatas="getVertifyDatas" @graphicswordSubmit="submitCode"></GraphicsWordVerify>
    <ImgVerify v-if="verifyType == 'code' && verifyData" :verifyData="verifyData" @cancelEvent="cancelEvent" @getVertifyDatas="getVertifyDatas" @submitCode="submitCode"></ImgVerify>
    <SliderVerify ref="slider" v-if="verifyType == 'slider' && verifyData" :verifyData="verifyData" @cancelEvent="cancelEvent" @getVertifyDatas="getVertifyDatas" @submitCode="submitCode"></SliderVerify>
    <Verify12306 v-if="verifyType == 'graph' && verifyData" :verifyData="verifyData" @cancelEvent="cancelEvent" @getVertifyDatas="getVertifyDatas" @submitCode="submitCode"></Verify12306>
  </div>
</template>

<script>
  import MD5 from '@/utils/md5.js'
  import GraphicsWordVerify from './graphicsword-verify'
  import ImgVerify from './img-verify'
  import SliderVerify from './slider-verify'
  import Verify12306 from './12306-verify'

  export default {
    name: "common-verify",
    components: {
      GraphicsWordVerify,
      ImgVerify,
      SliderVerify,
      Verify12306
    },
    data() {
      return {
        visible: false,
        paras: {},
        vertifyCancelEvent: null,
        verifyType: '',
        uuid: '',
        verifyData: undefined
      }
    },
    methods: {
      cancelEvent: function () {
        this.visible = false
        if (this.vertifyCancelEvent) {
          this.vertifyCancelEvent()
        }
      },
      open: function () {
        this.visible = true;
        this.getVertifyDatas();
      },
      close() {
        // 关闭组件
        this.visible = false
      },
      //静默加密
      getSilenceCode:function(uuid, code){
        let verifyCode = uuid + ':' + code + ':' + this.paras.phone
        let md5Str = MD5(verifyCode)
        this.visible = false;
        this.sureFunc(md5Str, uuid);
      },
      //点击文字方式
      submitCode:function(code){
        this.visible = false
        this.sureFunc(code, this.uuid);
      },

      //获取图像校验码
      getVertifyDatas: function () {
        this.verifyData = {};

        let url = '/app/json/login/getVerifyData';
        if(this.type == 'coupon_verify'){
          url = '/app/json/login/getCouponVerifyData';
        } else if (this.type == 'qrcodePay_verify') { // 电子账户 积分 红包
          url = '/app/json/login/getQrcodePayVerifyData';
        }
        let paramsData = {
          phone: this.paras.phone,
          token: this.paras.token
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();

            let data = res.data;
            if (data.status == 0) {
              this.verifyType = data.data.type
              this.uuid = data.data.uuid
              this.verifyData = data.data.verifyData
              if (this.verifyType == 'silence') {
                this.getSilenceCode(this.uuid, this.verifyData.code)
              }else if (this.verifyType == 'slider') {
                this.$nextTick(()=>{
                  this.$refs.slider.resetData();
                })
              }
            } else {
              this.$Toast(data.info ? data.info : '获取图像校验码失败');
              this.visible = false;
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
            this.visible = false;
          }
        )
      },
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .common-verify {
    width 100%
    height 100%
    overflow hidden
    position:absolute;
    top:0px;
    left:0px;
    background:rgba(0,0,0,0.66);
    z-index:99
    display flex;
    justify-content center;
    align-items center;
  }
</style>
