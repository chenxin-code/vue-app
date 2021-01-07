/**Created by steven on 2018/12/21.*/

<template>
  <div class="my-qrcode">
    <nav-top @backEvent="backEvent">
    </nav-top>
    <nav-content class="my-qrcode-container">
      <div class="code-content">
        <div class="top-div">
          <div class="title-div">
            <img src="static/image/setting/qrcode-tag.png" alt="">
            <p class="theme_font_white">会员码: {{myInfo.userNo}}</p>
          </div>
        </div>
        <div class="qr-div">
          <div class="head-div">
            <img class="headImg" :src="$store.state.globalConfig.user_qrcode_icon ? $store.state.globalConfig.user_qrcode_icon : 'static/image/setting/logo.png'" alt="">
          </div>
          <p class="phone">{{$store.state.login.phone}}</p>
          <div class="barcode" v-if="$store.state.globalConfig.user_qrCode_type != '2'">
            <canvas id="barcode"></canvas>
          </div>
          <!--<p class="code">{{myInfo.qrCode}}</p>-->
          <div class="codeimg-content" v-if="$store.state.globalConfig.user_qrCode_type != '1'">
            <div class="qrcode"  ref="qrcode">
              <canvas  id="qrcode"></canvas>
            </div>
            <div class="icon" @click="refreshBtn">
              <i class="iconfont mall-shuaxin"></i>
            </div>
          </div>
        </div>
        <div class="qrcode-agreement">
          <AgreementContent value="1"></AgreementContent>
        </div>
      </div>
      <!--<div class="code-content">-->
      <!--<div class="code" v-if="userNo && userNo.length">-->
      <!--<p class="num">会员号: {{userNo}}</p>-->
      <!--<div class="img" id="userNo" ref="userNo">-->
      <!--</div>-->
      <!--<p class="name">会员码</p>-->
      <!--</div>-->
      <!--<div class="code" v-if="empNo && empNo.length">-->
      <!--<p class="num">员工编号: {{empNo}}</p>-->
      <!--<div class="img" id="empNo">-->
      <!--</div>-->
      <!--<p class="name">员工码</p>-->
      <!--</div>-->
      <!--</div>-->
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qr-code-with-logo'
  import enterpriseImg from '@/utils/enterpriseImg.js'
  import JsBarcode from 'jsbarcode'
  import AgreementContent from '../register/agreement-content'
  import Config from '@/api/config.js'

  export default {
    name: "my-qrcode",
    components: {
      QRCode,
      AgreementContent
    },
    data() {
      return {
        myInfo: {},
        myTimeout: null,
        brightnessResult: {}
      }
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1);
      },
      refreshBtn() {
        // 刷新icon
        this.requestCode();
      },
      getMycode: function () {
        this.$Loading.open()

        let url = '/app/json/user/queryQrCodeInfo';
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.myInfo = data.data;

            this.$nextTick(() => {

              if (this.myInfo.qrCodeWithAppDownload) {
                this.createQRCode(this.myInfo.qrCodeWithAppDownload);
              } else {
                this.toCanvas();
              }

              //3分钟刷洗一下
              if (this.myTimeout) {
                clearTimeout(this.myTimeout)
                this.myTimeout = null
              }
              this.myTimeout = setTimeout(() => {
                this.getMycode();
              }, 3 * 60 * 1000)
            })

          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
        })
      },
      toCanvas: function () {

        if (this.$store.state.globalConfig.user_qrCode_type != '2') {
          let barcode = document.getElementById('barcode');
          JsBarcode(barcode, this.myInfo.qrCode, {displayValue: false});
        }
        if (this.$store.state.globalConfig.user_qrCode_type != '1') {
          let qrDiv = document.getElementById('qrcode');
          var cxt=qrDiv.getContext("2d");
          cxt.clearRect(0,0,qrDiv.width,qrDiv.height);

          let path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/downloadshare`;
          let qrCode = this.myInfo.qrCode;
          if(this.$route.query.isToRegiste){
            path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/loginbindqrcode`;
          }
          if(this.$route.query.isPreRegiste){
            path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/preregistration`;
          }
          if(this.$store.state.globalConfig.user_getUserRfrCode_isShortAddress == 2){
            this.createQRCode(path+`?qrCode=${qrCode}`);
          }else {
            this.getShort(path,qrCode);
          }
        }

        // setTimeout(() => {
        //   let imgElArr = document.getElementById('qrcode').getElementsByTagName('img');
        //   let imgEl = imgElArr[0];
        //   imgEl.style.width = "100%";
        //   imgEl.style.height = "100%";
        // }, 50)
      },

      getShort:function (path,qrCode) {

        this.$Loading.open()
        let url = '/app/json/short_address/makeShortAddress';
        let params1 = {
          token: this.$store.state.login.token,
          longAddress:path,
          addressData: qrCode
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.createQRCode(data.data+`?qrCode=${qrCode}`);
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
          console.log('获取我的电子券', error)
        })
      },
      createQRCode:function (myQrcodeValue) {
        if (this.$store.state.globalConfig.user_qrCode_type != '2') {
          let barcode = document.getElementById('barcode');
          JsBarcode(barcode, this.myInfo.qrCode, {displayValue: false});
        }
        if (this.$store.state.globalConfig.user_qrCode_type != '1') {
          let dic = {
            canvas: document.getElementById('qrcode'),
            content: myQrcodeValue,
            width:140,
            nodeQrCodeOptions:{
              margin: 0
            }
          };

          let src = enterpriseImg('qr-logo.png');
          if(src){
            dic.logo =  {
              src: src,
            }
          }
          QRCode.toCanvas(dic);
        }
      },
      getUserRfrCode: function () {
        this.$Loading.open()

        let url = '/app/json/user/getUserRfrCode';
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {

            this.myInfo = data.data;
            this.$nextTick(() => {
              this.toCanvas();
            })

          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
          console.log('获取我的电子券', error)
        })
      },
      requestCode:function () {
        if(this.$route.query.isToRegiste || this.$route.query.isPreRegiste){
          this.getUserRfrCode();
        }else {
          this.getMycode();
        }
      }

    },

    mounted() {
    },
    created() {

      this.requestCode();
      this.$bridgefunc.brightness(1, 0, (result) => {
        this.brightnessResult = result
      })
    },
    destroyed() {
      if (this.myTimeout) {
        clearTimeout(this.myTimeout)
        this.myTimeout = null
      }
      this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .my-qrcode {
    .my-qrcode-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
    }
    .code-content {

      .top-div {
        width 100%
        height 140px
        background: url("../../../../static/image/setting/qrcode-top.png") 0px 0px no-repeat;
        background-size: cover;

        .title-div {
          padding 10px
          display flex
          align-items center
          img {
            width 16px
            height 16px
          }
          p {
            font-size $font-size-medium
            font-weight $font-weight-x
            padding 3px 0px
            margin-left 10px
          }
        }
      }

      .qr-div {
        margin 0px 10px
        margin-top -50px
        position relative
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background white
        .head-div {
          width 100%
          height 80px
          top -40px
          position absolute
          display flex
          justify-content center
          .headImg {
            border-radius 40px
            box-shadow:0px 10px 15px -10px #ccc;
            width 80px
            height 80px
            background-color white;
          }
        }
        .phone {
          text-align center
          padding-top 50px
          font-size $font-size-medium
        }
        .barcode {
          margin 30px
          height 60px
          canvas {
            width 100%
            height 100%
          }
        }
        .code {
          text-align center
          font-size $font-size-medium
        }

        .codeimg-content {
          display flex
          justify-content center
          flex-direction column
          align-items center
          padding 30px;
          .qrcode {
            /*width 140px
            height 140px
            img {
              display block;
              width 100%;
              height 100%;
            }*/
          }
          .icon {
            padding-top: 20px
            .iconfont {
              font-size: 20px
              color: $color-text-l
            }
          }
        }

      }
      .qrcode-agreement {
        margin 20px 10px
        line-height 16px
      }

      /*.code {
          border-radius 5px
          display flex
          justify-content center
          flex-direction column
          align-items center
          margin 10px
          margin-top  20px
          overflow hidden
          background-color white
          .num{
            margin-top 20px
            margin-bottom 20px
            text-align center
            font-size $font-size-medium
            font-weight $font-weight-m
          }
          .img{
            width 140px
            height 140px
          }
          .name{
            margin 10px 0px 20px 0px
            font-size $font-size-medium
            text-align center
            font-weight $font-weight-m
          }

          & +.code{
            margin-top 0px
          }
        }
*/

    }

  }
</style>
