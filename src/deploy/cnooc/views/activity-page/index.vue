/**Created by liaoyingchao on 2020-09-10.*/

<template>
  <div class="index" v-if="pageIsShow">
    <PreviewComponent ref="activity_preview" :pageData="pageData" :barHeight="getTopHeight" @getPageData="getPageData"></PreviewComponent>
    <AdPage :pageAdKeywords="adPageKey" v-if="adPageKey && $store.state.deployType == '4'"></AdPage>
  </div>
</template>

<script>
  import AdPage from '@/components/product/index/subpage/adpage'

  export default {
    name: "index",
    components: {
      AdPage,
      PreviewComponent: () => import('@/components/product/index/preview/preview-new'),
    },
    data() {
      return {
        adPageKey: '',
        pageIsShow: false,
        pageData: {}
      }
    },
    computed: {
      getTopHeight: function () {
        return this.$store.state.barHeight;
      },
    },
    methods: {
      pageShow: function () {
        let el = this.$refs.activity_preview;
        if (el && el.pageShow) {
          el.pageShow();
        }
      },
      setScrollSite: function (v) {
        let el = this.$refs.activity_preview;
        if (el && el.setScrollSite) {
          el.setScrollSite(v);
        }
      },
      getScrollSite: function () {
        let el = this.$refs.activity_preview;
        if (el && el.getScrollSite) {
          return el.getScrollSite();
        }
        return 0
      },
      getPageData: function () {
        let url = '/app/json/app_vue_page/vueGetPageData';
        let params1 = {}

        if (this.$store.state.deployType == '4') {
          params1.storeOuCode = this.$store.state.refuelStation.stationCode || '1'
        }

        params1.isAppActivity = '1'

        // webType -1 内容管理配置， 0 网页访问， 1 app， 2 公众号， 3 小程序， 4 e生活app， 5 支付宝，6 加油河北老app，7 掌厅app
        params1.webType = '1'

        if (this.$store.state.webtype == '1') {
          params1.webType = '1'
        } else if (this.$store.state.webtype == '2') {
          params1.webType = '2'
        } else if (this.$store.state.webtype == '3') {
          params1.webType = '3'
        } else if (this.$store.state.webtype == '4') {
          params1.webType = '4'
        } else if (this.$store.state.webtype == '5') {
          params1.webType = '5'
        }

        params1.cityName = this.$store.state.indexData.city ? this.$store.state.indexData.city : '';
        params1.provinceName = this.$store.state.indexData.province ? this.$store.state.indexData.province : '';

        params1.accessType = 2
        params1.osType = 3 // 1 ios 2 android 3 通用
        // 1-用户端；2-商户端；3-大屏；4-pos机
        params1.appType = 1;

        this.$STLoading.open()
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          this.$STLoading.close()
          if (data.status == 0) {
            let fdata = data.data;
            if (!fdata.pageDataJson) {
              this.$toast('布局获取失败')
              return
            }
            let pdata = JSON.parse(fdata.pageDataJson);

            pdata.pgCode = fdata.pgCode
            this.adPageKey = ''
            this.pageIsShow = false;
            this.$nextTick(() => {
              this.pageIsShow = true;
              this.adPageKey = 'AD_Key_Common_' + fdata.pgCode
            })
            this.pageData = pdata;
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
            this.$Toast('网络加载较慢，请稍后重试!')
            this.$STLoading.close()
          })
      },
    },
    created() {
      this.getPageData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .index {
    width 100%
    height 100%
    overflow hidden
  }
</style>
