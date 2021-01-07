<template>
  <div class="home-bottom">
      <div class="top-module" v-if="topdata != null" :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
        <HomeModule_TOP  :item="topdata" :area="location.index.province?location.index.province:''" @messageEvent="messageEvent"
                        @areaEvent="areaEvent"></HomeModule_TOP>
      </div>
    <div class="scroll-div"   :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight()) + 'px'}">

      <pull-to :top-load-method="refresh">
          <div v-for="item in homedata.data.modelList">
          <HomeModule_Header v-if="item.isShowMore" :items="item"
                             @moreEvent="moreEvent"></HomeModule_Header>
          <HomeModule_1001 v-if="item.code == '1001'" :items="item" @itemEvent="itemEvent"></HomeModule_1001>
          <HomeModule_1002 v-if="item.code == '1002'" :items="item"
                           @itemEvent="itemEvent"></HomeModule_1002>
          <HomeModule_1003 v-if="item.code == '1003'"></HomeModule_1003>
          <HomeModule_1004 v-if="item.code == '1004'" :items="item" @itemEvent="itemEvent"></HomeModule_1004>
          <HomeModule_1005 v-if="item.code == '1005'" :items="item" @itemEvent="itemEvent"></HomeModule_1005>
          <HomeModule_1011 v-if="item.code == '1011'" :items="item" @itemEvent="itemEvent"></HomeModule_1011>
          <HomeModule_1012 v-if="item.code == '1012'" :items="item" @itemEvent="itemEvent"></HomeModule_1012>
          <HomeModule_1013 v-if="item.code == '1013'" :items="item" @itemEvent="itemEvent"></HomeModule_1013>
          <HomeModule_1014 v-if="item.code == '1014'" :items="item" @itemEvent="itemEvent"></HomeModule_1014>
          <HomeModule_1015 v-if="item.code == '1015'" :items="item" @itemEvent="itemEvent"></HomeModule_1015>
          <HomeModule_1016 v-if="item.code == '1016'" :items="item" @itemEvent="itemEvent"></HomeModule_1016>
          <HomeModule_1017 v-if="item.code == '1017'" :items="item" @itemEvent="itemEvent"></HomeModule_1017>
          <HomeModule_1018 v-if="item.code == '1018'" :items="item" @itemEvent="itemEvent"></HomeModule_1018>
          <HomeModule_1019 v-if="item.code == '1019'" :items="item" @itemEvent="itemEvent"></HomeModule_1019>
          <HomeModule_1022 v-if="item.code == '1022'" :items="item" @itemEvent="itemEvent"></HomeModule_1022>
          <HomeModule_1023 v-if="item.code == '1023'" :items="item" @itemEvent="itemEvent"></HomeModule_1023>
          <HomeModule_1024 v-if="item.code == '1024'" :items="item" @itemEvent="itemEvent"></HomeModule_1024>
          <HomeModule_1025 v-if="item.code == '1025'" :items="item" @itemEvent="itemEvent"></HomeModule_1025>
          <HomeModule_1026 v-if="item.code == '1026'" :items="item" @itemEvent="itemEvent"></HomeModule_1026>
          <HomeModule_1029 v-if="item.code == '1029'" :items="item" @itemEvent="itemEvent"></HomeModule_1029>
          <HomeModule_1028 v-if="item.code == '1028'" :items="item" @itemEvent="itemEvent"></HomeModule_1028>
          <HomeModule_1031 v-if="item.code == '1031'" :items="item" @itemEvent="itemEvent"></HomeModule_1031>
          <HomeModule_1032 v-if="item.code == '1032'" :items="item" @itemEvent="itemEvent"></HomeModule_1032>
          <HomeModule_1036 v-if="item.code == '1036'" :items="item" @itemEvent="itemEvent"></HomeModule_1036>
          <HomeModule_1037 v-if="item.code == '1037'" :items="item" @itemEvent="itemEvent"></HomeModule_1037>
          <HomeModule_1038 v-if="item.code == '1038'" :items="item" @itemEvent="itemEvent"></HomeModule_1038>
          <HomeModule_1039 v-if="item.code == '1039'" :items="item" @itemEvent="itemEvent"></HomeModule_1039>
          <HomeModule_1060 v-if="item.code == '1060'" :items="item" @itemEvent="itemEvent"></HomeModule_1060>
          <HomeModule_1061 v-if="item.code == '1061'" :items="item" @itemEvent="itemEvent"></HomeModule_1061>
          <HomeModule_1099 v-if="item.code == '1099'" :items="item" @itemEvent="itemEvent"></HomeModule_1099>

        </div>
      </pull-to>
    </div>

  </div>
</template>

<script>
  import {Toast,MessageBox} from 'mint-ui'
  import HomeModule_Header from '@/components/product/home-modules/home-module-header'
  import HomeModule_TOP from '@/components/product/home-modules/home-module-top'
  import HomeModule_1001 from '@/components/product/home-modules/home-module-1001'
  import HomeModule_1002 from '@/components/product/home-modules/home-module-1002'
  import HomeModule_1003 from '@/components/product/home-modules/home-module-1003'
  import HomeModule_1004 from '@/components/product/home-modules/home-module-1004'
  import HomeModule_1005 from '@/components/product/home-modules/home-module-1005'
  import HomeModule_1011 from '@/components/product/home-modules/home-module-1011'
  import HomeModule_1012 from '@/components/product/home-modules/home-module-1012'
  import HomeModule_1013 from '@/components/product/home-modules/home-module-1013'
  import HomeModule_1014 from '@/components/product/home-modules/home-module-1014'
  import HomeModule_1015 from '@/components/product/home-modules/home-module-1015'
  import HomeModule_1016 from '@/components/product/home-modules/home-module-1016'
  import HomeModule_1017 from '@/components/product/home-modules/home-module-1017'
  import HomeModule_1018 from "@/components/product/home-modules/home-module-1018"
  import HomeModule_1019 from "@/components/product/home-modules/home-module-1019"
  import HomeModule_1022 from '@/components/product/home-modules/home-module-1022'
  import HomeModule_1023 from '@/components/product/home-modules/home-module-1023'
  import HomeModule_1024 from '@/components/product/home-modules/home-module-1024'
  import HomeModule_1025 from '@/components/product/home-modules/home-module-1025'
  import HomeModule_1026 from '@/components/product/home-modules/home-module-1026'
  import HomeModule_1028 from '@/components/product/home-modules/home-module-1028'
  import HomeModule_1029 from "@/components/product/home-modules/home-module-1029"
  import HomeModule_1031 from "@/components/product/home-modules/home-module-1031"
  import HomeModule_1032 from '@/components/product/home-modules/home-module-1032'
  import HomeModule_1036 from '@/components/product/home-modules/home-module-1036'
  import HomeModule_1037 from '@/components/product/home-modules/home-module-1037'
  import HomeModule_1038 from "@/components/product/home-modules/home-module-1038"
  import HomeModule_1039 from "@/components/product/home-modules/home-module-1039"
  import HomeModule_1060 from "@/components/product/home-modules/home-module-1060"
  import HomeModule_1061 from "@/components/product/home-modules/home-module-1061"
  import HomeModule_1099 from "@/components/product/home-modules/home-module-1099"

  import {MP} from '@/utils/map'
  import { mapGetters } from 'vuex'
  import PullTo from 'vue-pull-to'


  export default {
    name: 'home',
    components: {
      Toast,
      HomeModule_TOP,
      HomeModule_Header,
      HomeModule_1001,
      HomeModule_1002,
      HomeModule_1003,
      HomeModule_1004,
      HomeModule_1005,
      HomeModule_1011,
      HomeModule_1012,
      HomeModule_1013,
      HomeModule_1014,
      HomeModule_1015,
      HomeModule_1016,
      HomeModule_1017,
      HomeModule_1018,
      HomeModule_1019,
      HomeModule_1022,
      HomeModule_1023,
      HomeModule_1024,
      HomeModule_1025,
      HomeModule_1026,
      HomeModule_1028,
      HomeModule_1029,
      HomeModule_1031,
      HomeModule_1032,
      HomeModule_1036,
      HomeModule_1037,
      HomeModule_1038,
      HomeModule_1039,
      HomeModule_1060,
      HomeModule_1061,
      HomeModule_1099,
      MessageBox,
      PullTo
    },
    computed: {
      ...mapGetters([
        'location',
      ]),
    },
    data() {
      return {
        homedata: {
          data: {
            modelList:[]
          }
        },
        topdata: null,
      }
    },

    methods: {
      refresh:function(loaded){
        this.getdata(loaded);
      },
      moreEvent: function (item) {
        console.log('moreEvent', item)
      },
      itemEvent: function (item) {
        console.log('itemEvent', item)
        let linkUrl = item.linkUrl
        if (linkUrl != '') {
          this.$bridgefunc.newPage({
            weburl: linkUrl,
            isnativetop:item.isNavTop?item.isNavTop:1,
            isparameters:item.isParam
          })
        }
      },
      messageEvent: function () {
        console.log('messageEvent')
        this.$bridgefunc.customPush({
          path: '/minemsgcenter',
          isnativetop:'1'
        })
      },
      areaEvent: function () {
        let _this = this
        this.$store.state.location.selectType = '2'
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customPush({
            path: '/cityselector/0',
            isnativetop:'1'
          });
        })
      },
      getLocation: function () {
        let _this = this;
        this.$bridgefunc.getLocation(function (locationinfo) {
          if(!_this.location.index.province || _this.location.index.province == ''){
            _this._setNewLocation(locationinfo);
          }else if(_this.location.index.province != locationinfo.province){
            MessageBox.confirm('离您最近的城市是'+locationinfo.province+',建议你切换到'+locationinfo.province, '提示').then(action => {
              console.log(action);
              _this._setNewLocation(locationinfo);
            }).catch(action => {
            });
          }
        });
      },
      _setNewLocation:function (locationinfo) {
        this.location.index.province = locationinfo.province;
        this.location.index.city =  locationinfo.city;
        this.$bridgefunc.vuexStorage(function () {
        })
      },

      getdata: function (loaded) {
        this.$Loading.open('加载中')
        let url = '/app/home/index';
        let params1 = {
          provinceName: this.location.index.province ? this.location.index.province : '',
          cityName: this.location.index.city ?this.location.index.city : '',
          alias: 'index'
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          if(loaded){loaded('done');}
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            console.log('获取首页', data)
            _this.homedata = data;
            for (let i = 0; i < data.data.modelList.length; ++i) {
              let item = data.data.modelList[i]
              if (item.code == '1000') {
                _this.topdata = item
                break
              }
            }
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });

          }

        }, error => {
          _this.$Loading.close();
          if(loaded){loaded('done');}
          console.log('获取首页', error)
        })
      },

    },
    watch:{

      '$store.state.indexData.city' : function(val, oldVal) {
        this.getdata();
      },
      '$store.state.indexData.province' : function(val, oldVal) {
        // let _this = this;
        // this.$bridgefunc.getItem('userinfoJson',function (result) {
        //   if(result){
        //     let json = JSON.parse(decodeURIComponent(result));
        //     json.provinceName = _this.$store.state.indexData.province;
        //     // _this.$bridgefunc.storeUserInfo();
        //   }
        //
        // })
      },

    },


    mounted() {
      this.$nextTick(function() {
        this.getLocation();
      });
    },
    created() {
      this.getdata();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .home-bottom {
    position relative
    width 100%
    height 100%
    overflow hidden

    .top-module {
      position fixed
      top 0px;
      left 0px;
      right 0px;
      z-index 100px;
    }
    .scroll-div {
      position absolute
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      overflow hidden
      background-color $color-background-lll
      -webkit-overflow-scrolling: touch
    }

  }
</style>
