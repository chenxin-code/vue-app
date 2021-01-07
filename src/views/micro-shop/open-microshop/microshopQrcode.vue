<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="我的微店"></nav-top>
    <nav-content>
      <div class="content">
        <div class="myShop" id="myShop" ref="imageWrapper">
          <div class="myShopTu">
            <div class="myShopTop">
              <img :src="imgUrl" alt="">
              <div class="text">
                <span class="name">{{detailData.storeName?detailData.storeName:'店铺名称'}}</span>
                <p class="jianjie">简介：{{detailData.storeProfile?detailData.storeProfile:'请设置简介'}}</p>
              </div>
            </div>
            <div style="width:80%;height:0;border-bottom:rgb(243, 176, 176) 2px dashed; margin: 16px auto;"></div>
            <div class="qrcode">
              <canvas id="qrcode"></canvas>
              <p>扫一扫，逛微店</p>
            </div>
          </div>
              <!-- <img :src="detailData.pictureUrl?detailData.pictureUrl:'/static/image/microShop/head@2x.png'" alt="">
              <span>{{detailData.storeName?detailData.storeName:'店铺名称'}}</span> -->
          <!-- <p class="introduction">简介：{{detailData.storeProfile?detailData.storeProfile:'请设置简介'}}</p> -->
          <!-- <div class="qrcode">
            <div class="ma">
              <canvas class="qrcode" id="qrcode"></canvas>
            </div>
            <p>扫一扫，逛微店</p>
          </div> -->
        </div>
      </div>

      <div class="answer theme_bg_red" @click="downloadImg">保存图片</div>
    </nav-content>
  </div>
</template>

<script>
  import QRCode from "qrcode";
  import Config from "@/api/config";
  import {mapGetters} from "vuex";
  import html2canvas from "html2canvas";
  export default {
    name: "microshopQrcode",
    components: {
      QRCode
    },
    data() {
      return {
        imgUrl: '',
        detailData: {},
      }
    },
    computed: {
      ...mapGetters(["getPutaggregate"])
    },
    mounted() {
      this.detailData = this.$route.query.profitObj && JSON.parse(this.$route.query.profitObj)
      console.log(this.detailData.pictureUrl);
      this.$nextTick(() => {
        var path = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/micro_sho/shop_around`;
        if (this.$store.state.globalConfig.micro_shop_check_page_type == '2') {
          path = `${this.$store.state.globalConfig.wxBaseUrl}${ Config.shareUrl }/micro_sho/shop_around1`
        }
        var myQrcodeValue = `${path}?storeID=${this.detailData.storeCode}&id=${this.detailData.id}`;
        console.log(11,myQrcodeValue)
        QRCode.toCanvas(document.getElementById('qrcode'), myQrcodeValue, {
          margin: 0,
          width: 160
        })
      })
      this.setOssImg(this.detailData.pictureUrl ? this.detailData.pictureUrl : this.$store.state.globalConfig.microshop_headurl)
    },
    methods: {
      setOssImg(url){
        this.imgUrl = ''
        this.$request.post("/app/json/home/getFileBase64",{filePath:url}).then(res => {
          if (res.status == 0) {
            if (res.data) {
              this.imgUrl =  `data:image/png;base64,${res.data || ''}`
            } else {
               this.$Toast('getFileBase64 返回为空');
            }
            console.log('res',res)
          } else {
            this.$Toast(res.info);
          }
        })
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
        console.log(this.$refs.imageWrapper);
        html2canvas(this.$refs.imageWrapper, opts).then(res => {
          let dataURL = res.toDataURL("image/png");
          console.log(dataURL);
          this.codeShow = false
          let base64DArr = dataURL.split("base64,");
          this.$bridgefunc.savePhoto(base64DArr[1], result => {
            if (result == "1") {
              this.detailData.popupShow = false;
              this.$emit("setshareData", this.detailData);
              this.$Toast("保存成功！");
            } else {
              this.$Toast("保存失败！");
            }
          });
        });
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important;
    .content {
      height 100%
      width 100%
      padding 20px
      .myShop {
        height 440px
        width 100%
        background: url('../../../../static/image/microShop/编组.png') repeat center center / 100% 100%;
      }
      .myShopTu {
        width 100%
        height 100%
        position relative
        .myShopTop {
          height 158px
          display flex
          justify-content flex-end
          align-items center
          flex-direction column
          img {
            width: 64px;
            height: 64px;
            border-radius: 50%
            position absolute
            top 34px
            left calc(50% - 32px)
          }
          .text {
            width 100%
            height 50px
            display flex
            justify-content space-around
            align-items center
            flex-direction column
            color #fff
          }
          .name {
            font-weight 400
            font-size 14px
          }
        }
        .qrcode{
          margin-top 20px
          color #fff
          display flex
          justify-content center
          flex-direction column
          align-items center
          p {
            font-size 14px
            margin-top 20px
          }
        }
      }
    }

    .answer {
      position: fixed;
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
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }
  }
</style>
