/**Created by liaoyingchao on 2020-06-17.*/

<template>
  <div class="block-index-location" ref="blockIndex">
    <SubPage v-if="pageData" :propsPageData="pageData" @dataLoaded="dataLoaded"></SubPage>
  </div>
</template>

<script>
  import SubPage from '@/components/product/index/subpage/subpage'
  import sinopecBridge from "../../../utils/sinopecapp/bridge";
  import staticDataRequest from "../../../utils/staticData/staticDataRequest";

  export default {
    name: "block-index-location",
    components: {
      SubPage
    },
    watch: {
      myHeight: function () {
        this.setSize()
      }
    },
    data() {
      return {
        pageData: null,
        myHeight: 0,
        myWidth: 0,
        times: 6,
      }
    },
    methods: {
      setSize: function () {
        if (this.$store.state.webtype == 7) {
          let wh = {
            width: this.myWidth,
            height: this.myHeight
          }
          sinopecBridge.sinopecapp_loadNative('setWebviewSize', JSON.stringify(wh))
        }
      },
      getSize: function () {
        this.myWidth = this.$refs.blockIndex.clientWidth
        this.myHeight = this.$refs.blockIndex.clientHeight
        this.times --;
        if (this.times <= 0) {
          return ;
        }
        setTimeout(() => {
          this.getSize()
        }, 500)
      },
      dataLoaded: function () {
        setTimeout(() => {
          this.getSize()
        }, 500)
      },
      _setNewLocation: function (locationinfo) {
        this.$store.state.indexData.province = locationinfo.province;
        this.$store.state.indexData.city = locationinfo.city;
        this.getPageData()
      },
      getPageData: function () {
        let webType = '7'
        if (this.$store.state.webtype == '1') {
          webType = '1'
        } else if (this.$store.state.webtype == '2') {
          webType = '2'
        } else if (this.$store.state.webtype == '3') {
          webType = '3'
        } else if (this.$store.state.webtype == '4') {
          webType = '4'
        } else if (this.$store.state.webtype == '5') {
          webType = '5'
        } else if (this.$store.state.webtype == '7') {
          webType = '7'
        }
        let businessType = ''
        if (this.businessType) {
          businessType = this.businessType
        }

        let storeOuCode = ''
        let cityName = this.$store.state.indexData.city ? this.$store.state.indexData.city : ''
        let provinceName = this.$store.state.indexData.province ? this.$store.state.indexData.province : ''

        let url = '/appcontent/js/app_vue_page/vuePageData.js'
        let funcName = 'vuePageData_'
        let args = []
        args.push({appType: 1})
        args.push({webType: webType})
        args.push({accessType: 2})
        // if (0) {
        //   funcName += pgcode
        //   args.push({pgCode: pgcode})
        // } else {

          args.push({storeOuCode: storeOuCode})
          args.push({cityName: cityName})
          args.push({provinceName: provinceName})
          args.push({businessType: businessType})

          let md5Str = this.$util.md5String(webType+storeOuCode+cityName)
          funcName += md5Str
        // }

        this.$STLoading.open()
        staticDataRequest.request(url, funcName, args).then(data => {
          this.$STLoading.close()
          if (data.status == 0) {
            let fdata = data.data.pageData;
            if (!fdata.pageDataJson) {
              return
            }
            this.pageData = JSON.parse(fdata.pageDataJson);
          } else {
            this.$Toast('获取页面配置信息失败！')
          }
        })
      },
    },
    created() {
      this.$store.state.clientWidth = document.documentElement.clientWidth;
      this.$bridgefunc.getLocation((locationinfo) => {
        this._setNewLocation(locationinfo);
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .block-index-location {
    position static !important;
    overflow hidden
  }
</style>
