/**Created by liaoyingchao on 2019-03-04.*/

<template>
  <div class="recommend-code">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="qrcode-div" @click="downloadImg">
        <div class="qrcode" id="qrcode" ref="qrcode"></div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import Config from "@/api/config.js";

  export default {
    name: "recommend-code",
    components: {},
    data() {
      return {
        myQrcodeValue: '',
        myTimeout: null
      }
    },
    methods: {
      getRfrCode: function () {
        this.$Loading.open()
        let url = '/app/json/user/getUserRfrCode';
        let params1 = {
          token: this.$store.state.login.token,
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}/usercenter/downloadshare`
            if (path.indexOf('?') > -1) {
              this.myQrcodeValue = path + `&qrCode=${data.data.qrCode}`
            } else {
              this.myQrcodeValue = path + `?qrCode=${data.data.qrCode}`
            }
            this.toCanvas();
            // this.$nextTick(()=>{
              // this.toCanvas();
              // if (this.myTimeout) {
              //   clearTimeout(this.myTimeout)
              //   this.myTimeout = null
              // }
              // this.myTimeout = setTimeout(() => {
              //   this.getRfrCode();
              // }, 3*60*1000)
            // })
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
        })
      },
      toCanvas:function () {


        let qrDiv = document.getElementById('qrcode');
        qrDiv.innerHTML = '';

        let qrcode = new QRCode('qrcode', {
          width: 200,  // 设置宽度
          height: 200, // 设置高度
          text:  this.myQrcodeValue
        })
        let imgElArr = document.getElementById('qrcode').getElementsByTagName('img');
        let imgEl = imgElArr[0];
        imgEl.id = 'qrcodeimg';
        imgEl.style.width = "100%";
        imgEl.style.height = "100%";
      },
      downloadImg: function () {

        // let webtype = this.$store.state.webtype;
        // if (webtype == 0) {
        //   return
        // }
        this.$messagebox.confirm('是否将二维码保存到相册？', '提示').then(action => {
          let image = document.getElementById("qrcodeimg");
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let base64D = canvas.toDataURL("image/png");
          let arr1 = base64D.split('base64,')
          if (arr1.length == 2) {
            base64D = arr1[1]
          }

          this.$bridgefunc.savePhoto(base64D, (result) => {
            if (result == '1') {
              this.$Toast('保存成功！')
            } else {
              this.$Toast('保存失败！')
            }
          })
        }).catch(action => {
        });
      }
    },
    created() {
      this.getRfrCode();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .recommend-code {
    width 100%
    height 100%
    overflow hidden
    .qrcode-div {
      .qrcode-a {
        width 100%;
      }
      .qrcode {
        margin 15%;
      }
    }
  }
</style>
