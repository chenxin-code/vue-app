/**Created by liaoyingchao on 2019-07-24.*/

<template>
  <div class="adpage" v-if="showAdpage" @click.stop="adPageHide">
    <div>
      <ImageAd :usePorpData="true" :propData="pageData" @closeEvent="adPageHide"></ImageAd>
    </div>
  </div>
</template>

<script>
  import staticDataRequest from "@/utils/staticData/staticDataRequest";

  export default {
    name: "adpage",
    components: {
      ImageAd: () => import('../ad-view/ad-view'),
    },
    props: ['pageAdKeywords', 'pgCode'],
    data() {
      return {
        pageData: null,
        show: false
      }
    },
    computed:{
      showAdpage(){
        let show = this.show
          && this.pageData != null
          && this.pageData.adData
          && this.pageData.adData != ''
        if(show){
          let adData = this.pageData.adData
          let canSeeItem = adData.rows.find(item => item.canSee != false);
          canSeeItem==undefined ? show = false : null;
        }
        return show
      }
    },
    methods: {
      adPageIsShow: function (id) {
        let nextTime = window.localStorage.getItem(this.pageAdKeywords+id)
        if (nextTime) {
          let newT = new Date().getTime()
          if (newT > nextTime) {
            this.show = true
          }
        } else {
          this.show = true
        }
      },
      adPageHide: function () {
        this.show = false
      },
      getMyPageData: function () {

        let url = '/appcontent/js/app_vue_page/vuePageData.js'
        let funcName = 'vuePageData_'
        let args = []
        args.push({appType: 1})
        args.push({accessType: 2})
        if (this.pgCode && this.pgCode != '') {
          funcName += this.pgCode
          args.push({pgCode: this.pgCode})
        } else {
          args.push({pageAdKeywords: this.pageAdKeywords})

          let md5Str = this.$util.md5String(this.pageAdKeywords)
          funcName += md5Str
        }
        staticDataRequest.request(url, funcName, args).then(data => {
          if (data.status == 0) {
            let fdata = data.data.pageData;
            if (!fdata.pageDataJson) {
              return
            }
            this.pageData = JSON.parse(fdata.pageDataJson);
            let id = data.data.id || '';
            let adData = this.pageData.adData
            this.adPageIsShow(id)
            // 展示了才设置显示周期
            if (adData && this.show) {
              if (adData.showFrequency == '1') {
                // 一天一次，2点之后算下一天
                let dateTime = new Date();
                dateTime = dateTime.setDate(dateTime.getDate()+1);
                dateTime = (new Date(dateTime)).setHours(2,0,0,0);
                let nextTime = (new Date(dateTime)).getTime()
                window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
              } else if (adData.showFrequency == '2') {
                // 仅展示一次
                let dateTime = new Date();
                dateTime = dateTime.setDate(dateTime.getDate()+999);
                let nextTime = (new Date(dateTime)).getTime()
                window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
              } else if (adData.showFrequency == '3') {
                // 1个小时才显示一次
                let nextTime = (new Date()).getTime() + 0.01*60*60*1000
                window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
              } else if (adData.showFrequency == '4') {
                // 无时间间隔
                let nextTime = (new Date()).getTime() + 0*60*60*1000
                window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
              } else {
                // 1个小时才显示一次
                let nextTime = (new Date()).getTime() + 1*60*60*1000
                window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
              }
            }
          }
        })

        // let url = this.$market.apiBaseURL() + '/app/json/app_vue_page/vueGetPageData';
        // let params1 = {
        //   accessType: '2',
        //   pageAdKeywords: this.pageAdKeywords
        // }
        // if (this.pgCode && this.pgCode != '') {
        //   params1 = {
        //     pgCode: this.pgCode,
        //     accessType: '2'
        //   }
        // }
        // this.$http.post(url, params1).then(res => {
        //   let data = res.data;
        //   if (data.status == 0 && data.data && data.data.pageDataJson) {
        //     this.pageData = JSON.parse(data.data.pageDataJson);
        //     let id = data.data.id
        //     let adData = this.pageData.adData
        //     this.adPageIsShow(id)
        //     // 展示了才设置显示周期
        //     if (adData && this.show) {
        //       if (adData.showFrequency == '1') {
        //         // 一天一次，2点之后算下一天
        //         let dateTime = new Date();
        //         dateTime = dateTime.setDate(dateTime.getDate()+1);
        //         dateTime = (new Date(dateTime)).setHours(2,0,0,0);
        //         let nextTime = (new Date(dateTime)).getTime()
        //         window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
        //       } else if (adData.showFrequency == '2') {
        //         // 仅展示一次
        //         let dateTime = new Date();
        //         dateTime = dateTime.setDate(dateTime.getDate()+999);
        //         let nextTime = (new Date(dateTime)).getTime()
        //         window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
        //       } else if (adData.showFrequency == '3') {
        //         // 1个小时才显示一次
        //         let nextTime = (new Date()).getTime() + 0.01*60*60*1000
        //         window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
        //       } else {
        //         // 1个小时才显示一次
        //         let nextTime = (new Date()).getTime() + 1*60*60*1000
        //         window.localStorage.setItem(this.pageAdKeywords+id, nextTime)
        //       }
        //     }
        //   } else {
        //
        //   }
        // }, error => {
        //   // this.$STLoading.close()
        // })
      }
    },
    created() {
      // let nextTime = window.localStorage.getItem(this.pageAdKeywords)
      // if (nextTime) {
      //   let nextT = new Date(nextTime)
      //   let newT = new Date()
      //   if (newT > nextT) {
      //     this.getMyPageData()
      //   }
      // } else {
        this.getMyPageData()
      // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .adpage {
    position fixed;
    left 0;
    right 0;
    top 0;
    bottom 0;
    z-index 9999;
  }
</style>
