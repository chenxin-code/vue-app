/**Created by 黄金辉 on 2018/10/11.*/

<template>
  <div class="preview">
    <!--<nav-top @backEvent="backEvent"></nav-top>-->
    <ul class="addressInfo" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="block-div">
        <img :src="invoiceInfo.pdfurl" class="img-big">
      </div>

      <div class="btns">
        <button class="btnleft" @click="shareClick">分享</button>
        <button class="btnright" @click="downloadClick">下载</button>
      </div>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "preview",
    components: {},
    data() {
      return {
        invoiceInfo: {},
      }
    },
    methods: {
      shareClick: function () {
        let shareData = {};
//        shareData.title = invoiceInfo.invoicetitle;
//        shareData.sharetext = '发票明细';
//        shareData.imageurl = "";
        shareData.detailurl = this.invoiceInfo.pdfurl;
        this.$bridgefunc.wechatShare(shareData);

      },
      downloadClick: function () {
        this.$bridgefunc.download(this.invoiceInfo.pdfurl, '.pdf');
      },
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      },
    },
    created() {
      this.invoiceInfo = JSON.parse(decodeURIComponent(this.$route.query.invoiceInfo));
      console.log(decodeURIComponent(this.invoiceInfo.pdfurl))
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .preview {
    width 100%
    height 100%
    overflow hidden
    .addressInfo {
      position absolute
      left 0px;
      right 0px;
      bottom 60px;
      overflow-y scroll
      -webkit-overflow-scrolling touch;
      .block-div {
        display flex
        justify-content center
        margin 10px 10px 10px;

        .img-big {
          max-width 340px
          max-height 245px
          border-radius 10px
        }
      }
      .btns {
        width 100%
        margin-top 30px
        display flex
        justify-content space-around
        .btnleft {
          background #ff6801
          color #fff
          width 46%
          height 45px
          border none
          border-radius 40px
        }
        .btnright {
          background #fd615a
          color #fff
          width 46%
          height 45px
          border none
          border-radius 40px
        }
      }
    }
  }
</style>
