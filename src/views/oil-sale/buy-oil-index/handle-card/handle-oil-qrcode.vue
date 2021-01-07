<template>
  <div class="handle-oil-qrcode">
    <nav-top title="提油卡办理" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="handle-oil-qrcode-container">
      <div class="qr-div">
        <div class="barcode">
          <canvas id="barcode"></canvas>
        </div>
        <div class="qrcode-text">{{myInfo.qrCode}}</div>
        <div class="codeimg-content">
          <div class="qrcode" ref="qrcode">
            <canvas  id="qrcode"></canvas>
          </div>
          <div class="icon" @click="refreshBtn">
            <i class="iconfont mall-shuaxin"></i>
          </div>
          <div class="tips">备注：当前二维码有效期为5分钟，到期自动失效。</div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qr-code-with-logo'
  import JsBarcode from 'jsbarcode'
  import enterpriseImg from '@/utils/enterpriseImg.js'
  import Config from '@/api/config.js'

  export default {
    data() {
      return {
        myTimeout: null,
        myInfo: {},
      }
    },
    mounted() {
      this.getMycode()
    },
    methods: {
      refreshBtn() {
        // 刷新icon
        this.getMycode()
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
            this.myInfo = data.data
            this.$nextTick(() => {
              // 一下为临时兼容代码
              if(this.$route.query.isToRegiste || this.$route.query.isPreRegiste){
                this.toCanvas();
              } else {
                if (this.myInfo.qrCodeWithAppDownload) {
                  this.createQRCode(this.myInfo.qrCodeWithAppDownload);
                } else {
                  this.toCanvas();
                }
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
          console.log('获取我的电子券', error)
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
            qrCode = this.myInfo.qrCode;
          }
          if(this.$route.query.isPreRegiste){
            path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/preregistration`;
            qrCode = this.myInfo.userNo;
          }
          this.getShort(path,qrCode);
        }

        // setTimeout(() => {
        //   let imgElArr = document.getElementById('qrcode').getElementsByTagName('img');
        //   let imgEl = imgElArr[0];
        //   imgEl.style.width = "100%";
        //   imgEl.style.height = "100%";
        // }, 50)
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
      }
    },
    destroyed() {
      if (this.myTimeout) {
        clearTimeout(this.myTimeout)
        this.myTimeout = null
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .handle-oil-qrcode {
    .handle-oil-qrcode-container {
      padding: 11px 15px
      .qr-div {
        margin 0px 10px
        position relative
        border-radius 5px
        box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
        background white
        padding-top: 15px
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
          margin 30px 30px 10px 30px
          height 60px
          canvas {
            width 100%
            height 100%
          }
        }
        .qrcode-text {
          text-align center
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
          padding 30px 20px;
          .tips {
            color $color-text-d
            line-height 20px
          }
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
            padding: 20px 0
            .iconfont {
              font-size: 20px
              color: $color-text-l
            }
          }
        }

      }
    }
  }
</style>
