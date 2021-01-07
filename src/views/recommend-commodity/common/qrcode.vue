<template>
  <div>
    <nav-top @backEvent="backEvent" title="我推荐码"></nav-top>
    <nav-content>
      <div class="myShop" id="myShop" ref="imageWrapper">
        <div class="qrcode">
          <canvas class="qrcode" id="qrcode"></canvas>
          <p>商品推荐码</p>
        </div>
      </div>
      <div class="answer theme_bg_red" @click="downloadImg">保存二维码</div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from "qrcode";
  import Config from "@/api/config";
  import {mapGetters, mapMutations} from "vuex";
  import html2canvas from "html2canvas";
  export default {
    name: "microshopQrcode",
    components: {
      QRCode
    },
    data() {
      return {
        detailData: {},
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      this.$nextTick(() => {
        let path = ''
        if (this.$route.query.type == 'all') {
          path = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/mall2/categories?userNo=${this.$route.query.qrcode}`;
          QRCode.toCanvas(document.getElementById('qrcode'), path, {
            margin: 0,
            width: 160
          })
          console.log(1,path)
        } else {
          this.$Loading.open()
          let params1 = {
            token: this.$store.state.login.token,
          }
          this.$http.post('/app/json/user/getUserRfrCode', params1).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              path = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/recommend-commodity/recomendlist?shareCode=${this.$route.query.qrcode}&userNo=${data.data.userNo}`;
              QRCode.toCanvas(document.getElementById('qrcode'), path, {
                margin: 0,
                width: 160
              })
              console.log(2,path)
            } else {
              this.$Toast(data.info);
            }
          }, error => {
            this.$Loading.close();
          })
        }
      })
    },
    methods: {
      ...mapMutations(['setRecommendationSku']),
      backEvent() {
        this.setRecommendationSku({skuList: []})
        if( this.$route.lastPath ==  '/recommend-commodity/qrcode') {
          this.$router.go(-1);
        } else {
          this.$router.push({
            path: '/recommend-commodity/home',
            query: {
              lastPath: 'qrcode'
            }
          })
        }


        // let num = this.$router.customRouterData.routerPaths.length -1
        // this.$router.go(-num);
        // this.$keepaliveHelper.deleteOthers(this)
      },
      downloadImg: function () {
        let _canvas = document.querySelector('.myShop');
        let w = parseInt(window.getComputedStyle(_canvas).width);
        let h = parseInt(window.getComputedStyle(_canvas).height);
        let canvas = document.createElement("canvas");
        let scale = 2;
        canvas.width = w * scale;
        canvas.height = h * scale;
        canvas.getContext("2d").scale(scale, scale);
        let opts = {
          useCORS: true,
          scale: scale,
          canvas: canvas,
          backgroundColor: '#000',
        };
        html2canvas(this.$refs.imageWrapper, opts).then(res => {
          let dataURL = res.toDataURL("image/png")
          let base64DArr = dataURL.split("base64,")
          this.$bridgefunc.savePhoto(base64DArr[1], result => {
            if (result == "1") {
              this.$Toast("保存成功！")
            } else {
              this.$Toast("保存失败！")
            }
          })
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  /deep/ .nav-content{
    background-color #f6f6f6
  }
  .myShop {
    margin-top 10px;
    background white
    padding 40px

    .qrcode {
      text-align center
      p {
        margin-top 20px
        font-size 14px
      }
    }
  }
  .answer {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 18px;

    a {
      display: block;
      width: 100%;
      height: 100%;
      color: white;
    }
  }
</style>
