/**Created by liaoyingchao on 2020-09-11.*/
<!--荣耀会员-->
<template>
  <div class="ryhy">
    <!--<nav-top @backEvent="backEvent" :bgImg="require('./imgs/topbg.png')"></nav-top>-->
    <!--<nav-content>-->
      <!--<div class="scroll-div">-->
        <!--<SubPage :divKeywords="'RYHYBuyDetail'"></SubPage>-->
      <!--</div>-->
    <!--</nav-content>-->
  </div>
</template>

<script>
  // import SubPage from '@/components/product/index/subpage/subpage'
  import wxfunc from '@/utils/wxfunc'
  import Config from "@/api/config";

  export default {
    name: "ryhy",
    components: {
      // SubPage
    },
    data() {
      return {
        // loaded: false,
      }
    },
    methods: {
      // backEvent: function () {
      //   this.$router.go(-1)
      // },
      // // 获取会员信息
      // getMyAssets: function () {
      //   let url = '/app/json/user/getUserWallet';
      //   let paramsData = {};
      //   this.$http.post(url, paramsData).then(
      //     res => {
      //       let data = res.data;
      //       if (data.status == 0) {
      //         this.$store.state.mall2.myAssets = data.data
      //         if (this.$store.state.mall2.myAssets.levelNo == '1100') {
      //           let timec = (new Date()).getTime()
      //           let path = '/common2/' + timec
      //           let pgCode = this.$store.state.globalConfig.RYHYUsePageCode || ''
      //           if (!pgCode) {
      //             this.$Toast('请配置荣耀会员使用页PgCode')
      //           }
      //           let pushData = {
      //             path: path,
      //             query: {
      //               pgCode: pgCode,
      //             }
      //           }
      //           this.$router.replace(pushData)
      //         } else {
      //           this.loaded = true
      //         }
      //       }
      //     },
      //     error => {
      //       this.loaded = true
      //     }
      //   );
      // },
      getUserEquityCardInfo: function () {
        let url = '/app/json/equity_card/getUserEquityCardInfo';
        let paramsData = {};
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let openState = data.data.openState
              let pgCode = data.data.toPageCode
              if (openState == '1') {
                pgCode = data.data.openToPageCode
              }
              let timec = (new Date()).getTime()
              let path = '/common2/' + timec
              let pushData = {
                path: path,
                query: {
                  pgCode: pgCode,
                }
              }
              this.$router.replace(pushData)
            } else {
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Toast('请求数据失败，请稍后尝试！')
          }
        );
      },
      getShareData(){
        let skuName = '分享';
        let shareData = {};
        shareData.title = skuName;
        shareData.sharetext = skuName;
        shareData.imageurl = this.$store.state.globalConfig.logoUrl;
        shareData.detailurl = this.$store.state.globalConfig.wxBaseUrl + Config.shareUrl + this.$route.fullPath;
        return shareData
      },
      WeChatShare(){
        if(this.$store.state.webtype == 2) {
          wxfunc.getWechatSignature(isSignature => {
            //签名成功
            if (isSignature) {
              wxfunc.wxSetShareData(this.getShareData());
            }
          });
        }
      },
    },
    mounted() {
      // this.getMyAssets()
      this.getUserEquityCardInfo()
      // 微信分享
      this.WeChatShare();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .ryhy {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      height 100%;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
    }
  }
</style>
