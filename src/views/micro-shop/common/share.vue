
<template>
  <div class="box">
    <!-- 分享 -->
    <van-popup v-model="detailData.popupShow" position="bottom" @click-overlay="clickOverlay">
      <div class="popup">
        <div class="popup-content" @click="sharewx">
          <img src="static/image/mall2/weixin.png" alt>
          <span>微信</span>
        </div>
        <div class="popup-content" @click="QRcode">
          <img src="static/image/microShop/code@2x.png" alt>
          <span>二维码</span>
        </div>
      </div>
    </van-popup>
    <div class="code-div" v-if='codeShow' @click.self='btnbox'>
      <div class="code-content" ref="imageWrapper">
        <div class='code-content-img'>
          <div class='code-content-img-top'>
            <img :src="imgUrl" alt crossOrigin='anonymous'>
          </div>
          <div class='code-content-img-buttom' v-if="detailData.groupFlag">
            <div class="price theme_font_red">
              <div class="price-item" v-for="(price, idx) in getPrices()">
                <p class="xian" v-if="idx != 0"> ~ </p>
                <p>¥</p>
                <p class="big">{{price.iNum}}.</p>
                <p>{{price.dNum}}</p>
              </div>
            </div>
            <div class="text theme_font_black">{{detailData.showTitle}}</div>
          </div>
          <div class='code-content-img-buttom' v-else>
            <div class="text theme_font_red">
              <span class="font-small price-z theme_font_red" style="font-weight: 700;">￥</span>
              <span class="price-z theme_font_red" style="margin-left: -4px;">{{getInteger(detailData.salePrice)}}</span>
              <span class="font-small price-z theme_font_red" style="margin-left: -4px; font-weight: 700;">.{{getDecimals(detailData.salePrice)}}</span>
            </div>
            <div class="text theme_font_black">{{detailData.dpedData.featureName || detailData.skuName}}</div>
          </div>
        </div>
        <div class='code-content-line'></div>
        <div class='code-content-code'>
          <canvas class="qrcode" id="qrcode"></canvas>
          <p>微信扫码或长按识别二维码</p>
        </div>
         <div class="code-content-zanwei"></div>
      </div>
      <div class="code-btn">
        <div class="btn theme_bg_red" @click.stop="preservation">保存图片到本地</div>
        <div class="text">记得发送给朋友或发布到朋友圈呦！</div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import Config from "@/api/config";
import qrcode from "qrcode";
import { mapGetters } from "vuex";
import purchase from '../add-merchandise/common/js/index'

const defaultParams = {
  priceMin: "",
  priceMax: "",
  profitMin: "",
  profitMax: ""
};
export default {
  name: "share",
  props: ["shareObj"],
  computed: {
    ...mapGetters(["getPutaggregate"])
  },
  data() {
    return {
      imgUrl: '',
      timeOutEvent: 0,
      popupShow: true,
      codeShow: this.shareObj.codeShow,
      detailData: this.$util.deepClone(this.shareObj)
    };
  },
  mounted() {
    this.setOssImg(this.detailData.phMainUrl || this.detailData.picMainUrl || this.detailData.picUrls[0])
  },
  methods: {
    getPrices: function () {
      return purchase.getPriceShow(this.detailData.purPriceRules)
    },
    setOssImg(url){
      this.imgUrl = ''
      this.$request.post("/app/json/home/getFileBase64",{filePath:url}).then(res => {
        if (res.status == 0) {
          if (res.data) {
            this.imgUrl =  `data:image/png;base64,${res.data || ''}`
          } else {
              this.$Toast('getFileBase64 返回为空');
          }
        } else {
          this.$Toast(res.info);
        }
      })
    },
    getInteger: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0]
    },
    getDecimals: function (price) {
      let str = this.$util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1]
    },
    clickOverlay() {
      this.detailData.popupShow = false;
      this.$emit("setshareData", this.detailData.storeCode);
    },
    sharewx() {
      let url = '/micro_sho/shareDetail/'
      if (this.detailData.groupFlag) {
        url = '/micro_sho/sharebuyingDetail/'
      }
      // 分享微信
      let shareData = {};
      shareData = {};
      shareData.title = this.detailData.showTitle || this.detailData.skuName;
      shareData.sharetext = this.detailData.skuName;
      shareData.imageurl = this.detailData.phMainUrl;
      shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + `${url}${this.$util.getDataString()}`;
      shareData.detailurl = shareData.detailurl + "?id=" + (this.detailData.id || this.detailData.skuId) + "&skuId=" + (this.detailData.skuId || this.detailData.id) + "&microStoreCode=" + this.getPutaggregate.storeCode + "&storeName=" + this.getPutaggregate.storeName + "&productType=" + this.detailData.productType + "&deliveryType="+ this.$store.state.mall2.staticDeliverType + "&storeOuCodeNew=" + this.$store.state.mall2.zitiAddress.id + "&proSkuDistributionId=" + this.detailData.proSkuDistributionId;
      if ( this.$store.state.login.token && this.$store.state.login.token != "" ) {
        shareData.detailurl = shareData.detailurl + "&recommend=" + this.$store.state.userInfo.userId;
        shareData.detailurl = shareData.detailurl + "&recommendPhone=" + this.$store.state.login.phone;
      }
      console.log('shareData',shareData)
      this.$bridgefunc.wechatShare(shareData);
    },
    QRcode() {
      let url = '/micro_sho/shareDetail'
      if (this.detailData.groupFlag) {
        url = '/micro_sho/sharebuyingDetail'
      }
      // 分享二维码
      this.codeShow = true;
      this.$emit('qRcodeStstus', this.codeShow)
      this.$nextTick(res => {
        var path = `${this.$store.state.globalConfig.wxBaseUrl}${Config.shareUrl}${url}`;
        var myQrcodeValue = `${path}/${this.$util.getDataString()}?id=${this.detailData.id || this.detailData.skuId}&skuId=${this.detailData.skuId || this.detailData.id}&microStoreCode=${this.getPutaggregate.storeCode}&storeName=${this.getPutaggregate.storeName}&productType=${this.detailData.productType}&deliveryType=${this.$store.state.mall2.staticDeliverType}&storeOuCodeNew=${this.$store.state.mall2.zitiAddress.id}&proSkuDistributionId=${this.detailData.proSkuDistributionId}`;
          qrcode.toCanvas(document.getElementById("qrcode"),myQrcodeValue, { width: 140})
      });
    },
    btnbox(){
      this.codeShow = false;
      this.$emit('qRcodeStstus', this.codeShow)
    },
    preservation() {
      let _canvas = document.querySelector('.code-content');
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
        let dataURL = res.toDataURL("image/png");
        this.codeShow = false
        let base64DArr = dataURL.split("base64,");
        console.log(dataURL)
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
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import "~@/common/stylus/mixin.styl"
@import "./base/css/price.styl"

.box {
  width: 100%;
  height: 100%;
  .popup {
    display: flex;
    justify-content: center;
    padding: 40px 0;
    text-align: center;

    .popup-content {
      display: flex;
      flex-direction: column;
      margin: 0 40px;

      img {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
      }
    }
  }
  .code-div {
    width: 100%;
    height: 100%;
    z-index: 3000;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.75);
    .code-content {
      width: 280px;
      height: 380px;
      padding: 20px;
      background-image: url('../../../../static/image/microShop/bg@2x(1).png');
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .code-content-zanwei{
        height: 12px;
      }
      .code-content-img{
        display flex
        justify-content center
        flex-direction column
        align-items center
        .code-content-img-top{
          width 130px
          height 130px
          img{
            width: 100%;
            height: 100%;
          }
        }
        .code-content-img-buttom{
          width 170px
          font-size: 14px;
          .text{
            line-height 16px
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-line-clamp: 1;
            // -webkit-box-orient: vertical;
            margin 4px 0
          }
        }
      }
      .code-content-line{
        border 0.5px solid #e0e0e0
        width 90%
        margin 0 auto
      }
    }
    .code-btn{
      color #fff;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn {
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
        margin: 20px;
      }
    }
  }
}
.price {
  margin-top 4px
  font-size 12px;
  display flex;
  align-items center
  font-weight 500;

  .price-item {
    display: flex
    align-items flex-end;
    line-height 1;

    .xian {
      font-size 16px;
      padding 0 2px;
    }

    .big {
      font-size 16px;
    }
  }
}
</style>
