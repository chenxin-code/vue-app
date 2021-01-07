<template>
  <div class="mobile-preview">
    <div class="full-div" v-if="pageData.type == '0' && pageShow">
      <component ref="Ref_Com_One" :is="'PreviewComponent'" :pageData="pageData" :barHeight="getTopHeight()"
                 @getPageData="getPageData(pgCode,-1)"></component>
    </div>
    <div class="full-div" v-if="pageData.type == '1' && pageShow">
      <div class="page-content" :class="{'page-content-2': pageData.tabbarType == 'top'}">
        <div class="full-div" v-for="(item, index) in tabbarSubDatas" v-if="item.hasShow && item.data"
             v-show="index == selectedIndex">
          <component :ref="getComRef(index)" :hasBack="getHasbackEvent(item.code)" :is="getItemCode(item)" :pageData="item.data"
                     :barHeight="getTopHeight()" :commonShow="selectedIndex == index"
                     @getPageData="getPageData(item.pgCode,index)"
                     @tabbarEvent="tabbarChanged"></component>
        </div>
      </div>
      <Tabbar ref="tabbar2" @tabbarEvent="tabbarEvent" :usePorpData="true" :propData="pageData"></Tabbar>
    </div>
    <AdPage :pageAdKeywords="adPageKey" v-if="adPageKey"></AdPage>
  </div>
</template>

<script>
  import Tabbar from './tabbar/tabbar'
  import AdPage from '@/components/product/index/subpage/adpage'

  export default {
    name: 'index',
    components: {
      PreviewComponent: () => import('./preview/preview-new'),
      LinkComponent: () => import('./preview/preview-link'),
      WebViewComponent: () => import('./preview/web-view'),
      Tabbar,
      AdPage
    },
    data() {
      return {
        pgCode: '',
        pageShow: false,
        pageData: {},
        fullPageData: {},
        tabbarSubDatas: [],
        selectedIndex: -1,
        isFirstShow:true,
        lastPath: '',
        adPageKey: '',
        pagePosition: 0
      }
    },
    computed: {
    },
    methods: {
      commonPageShow: function (i) {
        let comref = this.getComRef(i);
        if (this.$refs[comref]) {
          let arr = this.$refs[comref];
          let el = arr[0];
          if (el.pageShow) {
            let item = this.tabbarSubDatas[this.selectedIndex];
            el.pageShow();
          }
        }
      },
      tabbarChanged: function (index) {
        console.log(index);
        this.$refs.tabbar.tabbarEvent(index)
      },
      getHasbackEvent: function (code) {
        // if (code == 'Mallcategories' || code == 'Mallshoppingcart' || code == 'Mallorderlist') {
        //   return false
        // }
        return false
      },
      getComRef: function (index) {
        return 'com' + index
      },
      getItemCode: function (item) {
        if ('LinkComponent' == item.code) {
          if (item.data.url.indexOf("http") == 0) {
            item.code = 'WebViewComponent'
          }
        }
        if ('2' == item.code) {
          if (item.data.url == '/usercenter/rebatebonus') {
            item.code = 'RebateBonus'
          }
        }
        // if ('LinkComponent' == )
        // console.log(item)
        return item.code;
      },
      getTopHeight: function () {
        return this.$store.state.barHeight;
      },
      tabbarEvent: function (index) {
        let item = this.tabbarSubDatas[index];
        if (item.hasShow && this.selectedIndex != index) {
          this.commonPageShow(index);
        }
        if (this.$store.state.login.token == '') {
          if (item.code == "Mallshoppingcart") {
            // Mallshoppingcart 购物车 需要登录
            // index == this.tabbarSubDatas.length - 1 固定当做最后一个配置页面是 我的， 我的页面需要登录
            this.$store.state.indexData.selectedIndex = index
            this.$store.state.pushData = {};
            this.tabbarChanged(this.selectedIndex)

            this.$util.toLogin();

            return;
          }
        }
        item.hasShow = true
        this.selectedIndex = index;

        this.$nextTick(() => {
          if (this.getComRef(index) && this.$refs[this.getComRef(index)]) {
            //判断是否是配置组件  再去刷新   liqiang
            if (item.code == 'PreviewComponent') {
              this.$refs[this.getComRef(index)][0].refresh();
            }
          }
        })
      },
      getPageData: function (pgcode, tabbarIndex) {
        let url = '/app/json/app_vue_page/vueGetPageData';
        let params1 = {}
        if (pgcode) {
          params1.pgCode = pgcode;
        }

        params1.cityName = this.$store.state.indexData.city?this.$store.state.indexData.city:'';
        params1.provinceName = this.$store.state.indexData.province?this.$store.state.indexData.province:'';

        params1.accessType = 2
        // 1-用户端；2-商户端；3-大屏；4-pos机
        params1.appType = 1;

        this.$STLoading.open()
        this.$http.post(url, params1).then(res => {
          let data = res.data;
          this.$STLoading.close()
          if (data.status == 0) {
            let fdata = data.data;
            let pdata = JSON.parse(fdata.pageDataJson);
            pdata.pgCode = fdata.pgCode
            this.adPageKey = 'AD_Key_Common_' + fdata.pgCode
            console.log(this.adPageKey)
            console.log(pdata);
            if (tabbarIndex == -1) {
              this.fullPageData = fdata;
              this.pageData = pdata;
              this.pageShow = false;
              this.$nextTick(() => {
                this.pageShow = true;
              })
              if (this.pageData.type == '1') {
                this.getSubPageDatas()
              }
            } else {
              this.tabbarSubDatas[tabbarIndex].data = pdata
            }
          } else {
            this.$Toast('请求数据出错，请稍后重试!');
          }
        })
        .catch(err => {
          this.$STLoading.close()
          this.$Toast('请求数据出错，请稍后重试!')
        })
      },
      getSubPageDatas: function () {
        let count = this.pageData.moduleList.length
        let tempArr = [];
        let defaultIndex = -1
        for (let i = 0; i < count; i++) {
          let module = this.pageData.moduleList[i]
          if (module.default == true) {
            defaultIndex = i;
          }
          let link = module.link
          let pdata = {}
          if (link.type == '1') {
            pdata.code = 'PreviewComponent'
            pdata.data = ''
            pdata.pgCode = link.pgCode
          } else if (link.type == '2') {
            pdata.code = link.code
            pdata.data = {
              title: link.label,
              url: link.url
            }
          } else if (link.type == '3') {
            pdata.code = 'LinkComponent'
            pdata.data = {
              title: link.label,
              url: link.url
            }
          }
          pdata.hasShow = false;
          tempArr.push(pdata);
        }
        this.tabbarSubDatas = tempArr;
        for (let i = 0; i < this.tabbarSubDatas.length; i++) {
          let item = this.tabbarSubDatas[i]
          if (item.code == 'PreviewComponent') {
            this.getPageData(item.pgCode, i)
          }
        }

        if (defaultIndex != -1) {
          setTimeout(() => {
            this.$refs.tabbar2.tabbarEvent(defaultIndex);
          }, 20)
          // 这里报错，没时间查原因
          // this.$nextTick(() => {
          //   this.$refs.tabbar2.tabbarEvent(defaultIndex);
          // })
        }
      },
    },
    watch: {
      // 监听城市变化
      // '$store.state.indexData.city' : function(val, oldVal) {
      //   this.getPageData(undefined,-1)
      // },
      // // 监听油站变化
      // '$store.state.indexData.station.id' : function(val, oldVal) {
      //   this.getPageData(undefined,-1)
      // },

    },
    mounted() {

    },
    activated() {
      // lastPath
      if (this.pageData.type == '0') {
        if (this.pageShow) {
          let el = this.$refs.Ref_Com_One;
          if (el) {
            if (el.setScrollSite) {
              el.setScrollSite(this.pagePosition)
              el.pageShow();
            }
          }
        }
      } else {
        if (this.pageShow) {
          let comref = this.getComRef(this.selectedIndex);
          if (this.$refs[comref]) {
            let arr = this.$refs[comref];
            let el = arr[0];
            if (el.setScrollSite) {
              el.setScrollSite(this.pagePosition)
              el.pageShow();
            }
          }
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      } else {
        if (this.pageData.type == '0') {
          let el = this.$refs.Ref_Com_One;
          if (el.getScrollSite) {
            this.pagePosition = parseInt(el.getScrollSite())
          }
        } else {
          let comref = this.getComRef(this.selectedIndex);
          if (this.$refs[comref]) {
            let arr = this.$refs[comref];
            let el = arr[0];
            if (el.getScrollSite) {
              this.pagePosition = parseInt(el.getScrollSite())
            }
          }
        }
      }
      next()
    },
    created() {
      this.$store.state.clientWidth = document.documentElement.clientWidth;
      this.pgCode = this.$route.query.pgCode ? this.$route.query.pgCode : '';
      this.lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : '';
      this.getPageData(this.pgCode, -1);

      this.isFirstShow = true;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .mobile-preview {
    position relative;
    width 100%
    height 100%
    overflow hidden
    .full-div {
      position relative;
      width 100%;
      height 100%;
      -webkit-overflow-scrolling: touch;
      .page-content {
        position absolute
        left 0px;
        right 0px;
        top 0px;
        bottom 50px;
      }
      .page-content-2 {
        position absolute
        left 0px;
        right 0px;
        top 135px;
        bottom 0px;
      }
    }
  }
</style>
