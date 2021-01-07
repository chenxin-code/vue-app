/**Created by steven on 2018/4/23.*/
<template>
  <div class="mapbot">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')" :title="pageTitle"></nav-top>
    <nav-content>
      <template v-if="isOpenLocation === 1">
        <div ref="mapBxo" class="map-box">
          <div :id="randomId" class="allmap"></div>
          <div class="mapmore">
            <div class="searchdiv">
              <div class="city-div">
                <img src="./imgs/dw2.png" alt="">
                <div>{{locationinfo.city}}</div>
                <!--@click="pageInit"-->
              </div>
              <div class="search-div">
                <img @click="searchMore" class="search" src="static/image/station/search.png" alt="">
                <span @click="searchMore" v-if="!searchText" lass="single-line">输入地点或商区名称</span>
                <span @click="searchMore" v-else class="black-text single-line">{{ searchText }}</span>
                <img @click="pageInit" class="gps-img" src="./imgs/gps.png" alt="">
              </div>
            </div>
          </div>
        </div>
        <StationDetail ref="StationDetail" @changeTitle="changeTitle"></StationDetail>
      </template>
    </nav-content>
    <!-- 搜索页面 -->
    <div
      v-if="isShowSearch"
      class="search-container">
      <div class="searchmorebot">
        <div
          class="qrcode-top "
          :style="{height: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}"
          @backEvent="searchBackEvent">
          <div
            class="navcontent"
            :style="{top: this.$store.state.barHeight+ 'px','height': this.$market.getNavHeight()+'px'}">
            <div @click="searchBackEvent">
              <i class="iconfont mall-fanhui theme_font_black"></i>
            </div>
            <div class="search-div">
              <img class="searchimg" src="static/image/station/search.png" alt="">
              <div class="form-control">
                <input v-model="searchText" class="input-none" type="search" @keyup.enter='searchEntery'
                       placeholder="输入地点或商区名称"/>
              </div>
            </div>
            <div class="cancel" @click="cancelEvent">取消</div>
          </div>
        </div>
        <nav-content>
          <div
            v-if="!searchText && searchHistoryArr[0]"
            class="history-container">
            <p class="his-title">搜索历史<i class="clear-btn iconfont mall-shanchu theme_font_gray_i"
                                        @click="clearHistory"></i></p>
            <ul class="his-item-container clearfix">
              <li
                v-for="(item, index) in searchHistoryArr"
                :key="index"
                @click="historyClick(item)">{{ item }}
              </li>
            </ul>
          </div>
          <div v-else class="listcontent">
            <div class="list-item" v-for="item in dataList" @click="backMap(item)">
              <div class="list_name theme_font_black">{{item.name}}</div>
              <div class="list_location theme_font_tint">{{item.province + item.city + item.district}}
              </div>
            </div>
          </div>
        </nav-content>
      </div>
    </div>
  </div>
</template>
<script>
  // import {Toast} from 'mint-ui'
  // import oilStationList from '@/components/product/stationto/oil-station-list.vue';
  import {MP} from '@/utils/map'
  import '@/utils/EventWrapper'
  // import Navigation from '@/components/base/navigation'
  import stationToJS from '@/components/product/stationto/js/stationto'
  import Config from '@/api/config'
  import jsonp from 'jsonp'
  import StationDetail from './base/station-detail'

  const all = {dictValue: 'all', alias: '全部', _type: 0}
  export default {
    name: "home-stationto",
    components: {
      StationDetail
      // Toast,
      // oilStationList,
      // Navigation
    },
    props: {
      hasBack: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        locationinfo:{},
        pageTitle: '优惠加油',
        bdMap: null,
        stations: [],
        nowmk: null,
        openListener: null,
        pageOn: 0, //第几页
        isBottomBounce: true,

        // 搜索相关变量
        isShowSearch: false,
        searchText: null,
        isActive: false,
        dataList: [],
        searchHistoryArr: [],
        isOpenLocation: -1, // 1 开启，0 未开启
        mode: [all], // 筛选条件 过滤加油站传stationName
        tags: [], // 筛选条件集合
        loadedTimes: 0,
        randomId: '',
        mapslogo: 'static/image/station/mapslogo.png',
        mapslogo1: 'static/image/station/mapslogo1.png',
        pageType: 0,
        selectedIndex: 0
      }
    },
    created() {
      this.randomId = this.randomString();
      this.selectedIndex = this.$route.query.index || 0

      if (this.$store.state.globalConfig.mapslogo && this.$store.state.globalConfig.mapslogo.length) {
        this.mapslogo = this.$store.state.globalConfig.mapslogo;
      }
      if (this.$store.state.globalConfig.mapslogo1 && this.$store.state.globalConfig.mapslogo1.length) {
        this.mapslogo1 = this.$store.state.globalConfig.mapslogo1;
      }
      // this.$request.post('/app/json/station/getStationDetail', {id: 3155})
    },
    mounted() {
      this.initHistory()
      this.$nextTick(() => {
        this.pageInit()
      })
      this.queryMarks()
      this.debounceQueryLocation = this.$util.debounce(this.queryLocation, 500)
    },
    watch: {
      searchText(curVal, oldVal) {
        this.initHistory()
        this.debounceQueryLocation(curVal)
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
    methods: {
      changeTitle: function (val) {
        this.pageType = val
        if (val == 1) {
          this.pageTitle = '加油站详情'
        } else {
          this.pageTitle = '优惠加油'
        }
      },
      searchEntery() {//搜索按下enter时
        if (this.searchText) {
          this.debounceQueryLocation(curVal);
        }
      },
      randomString: function () {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        let uuid = (new Date()).getTime() + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        return uuid;
      },
      pageInit() {
        let _this = this;
        this.$bridgefunc.checkLocationAuth(_this.pageInit).then((locationinfo) => {
          MP().then(BMap => {
            //在此调用api
            _this.loadBd(BMap);//加载百度地图
            _this.getLocation(BMap, locationinfo); //获取个人位置
            require('@/utils/InfoBox')

            _this.loadedTimes++

            if (_this.loadedTimes == 1) {
              // 少数情况下，会出现地图空白情况，只有第一次才重新加载
              setTimeout(() => {
                let dom = window.document.getElementById(_this.randomId)
                if (dom.innerHTML == '') {
                  console.log('地图空白，重新初始化！')
                  _this.pageInit()
                }
              }, 200)
            }
          });
          _this.isOpenLocation = 1
        }, () => {
          _this.isOpenLocation = 0
          _this.$Toast('请您开启GPS定位附近中国石化加油站')
        })
      },
      settingLocation() {
        this.$bridgefunc.requestPermissions()
      },
      cancelEvent: function () {
        if (this.searchText) {
          this.searchText = null
        } else {
          this.isShowSearch = false
        }
      },
      searchBackEvent: function () {
        // this.searchText = null
        this.isShowSearch = false
        // this.$router.go(-1);
      },
      _moveFunc: function (value) {
        this.searchText = ''
        this.isActive = true
      },
      focusFunc: function () {
        this.isActive = false
      },
      backMap: function (item) {
        this.stations = [] // 地图搜索后重置列表
        this.setHistoryItems(item.name)
        this.$store.state.selectp.lat = item.location.lat
        this.$store.state.selectp.lng = item.location.lng
        let _this = this
        this.$bridgefunc.vuexStorage(function () {
          _this.searchBackEvent()
        })
        this.newGet()
      },
      // 存储搜索历史记录
      setHistoryItems(keyword) {
        keyword = keyword.trim()
        let {searchHistory} = localStorage
        if (!searchHistory) {
          localStorage.searchHistory = keyword
        } else {
          const onlyItem = searchHistory.split('|').filter(e => e != keyword)
          if (onlyItem.length >= 6) {
            onlyItem.pop()
          }
          if (onlyItem.length > 0) {
            searchHistory = keyword + '|' + onlyItem.join('|')
          }
          localStorage.searchHistory = searchHistory
        }
      },
      // 初始化搜索历史
      initHistory() {
        let searchHistory = window.localStorage.getItem('searchHistory')
        this.searchHistoryArr = searchHistory ? searchHistory.split('|') : []
      },
      // 搜索历史点击
      historyClick(item) {
        this.searchText = item
      },
      // 清空历史记录
      clearHistory() {
        this.searchHistoryArr = []
        window.localStorage.searchHistory = ''
      },
      // 页面相关方法
      backEvent: function () {
        if (this.pageType == 1) {
          this.$refs.StationDetail.silderToType(2)
        } else {
          this.$router.go(-1);
        }
      },
      newGet: function () {
        if (this.$store.state.selectp.lng && this.$store.state.selectp.lng != '') {
          let point = new BMap.Point(this.$store.state.selectp.lng, this.$store.state.selectp.lat)
          this.getNearStations(point)
        }
      },
      loadBd: function (BMap) {
        this.bdMap = new BMap.Map(this.randomId);//在百度地图容器中创建一个地图
        // this.bdMap.centerAndZoom(new BMap.Point(116.404, 39.915), 10);  // 初始化地图,设置中心点坐标和地图级别
        // console.log('map.getZoom()');
        // console.log(this.bdMap.getZoom());
        //添加地图类型控件
        this.bdMap.addControl(new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }));
        // this.bdMap.addEventListener("click", () => {
        //   this.$refs.stationList.setWrapperTop()
        // })
        this.bdMap.enableScrollWheelZoom(true)
      },

      getLocation: function (BMap, locationinfo) {
        console.log('getLocation')
        let _this = this;
        if (!locationinfo.city || locationinfo.city == '') {
          //如果还没有城市要做初始化数据
          locationinfo.province = this.$store.state.globalConfig.province
          locationinfo.city = this.$store.state.globalConfig.city
          locationinfo.district = this.$store.state.globalConfig.district
          locationinfo.longitude = this.$store.state.globalConfig.longitude
          locationinfo.latitude = this.$store.state.globalConfig.latitude
        }
        console.log('locationinfo', locationinfo)
        this.locationinfo = locationinfo
        let point = new BMap.Point(locationinfo.longitude, locationinfo.latitude);
        _this.getNearStations(point);
      },
      addNewLocations: function () {

        let overlays = this.bdMap.getOverlays();
        for (let i = 0; i < overlays.length; i++) {
          let templay = overlays[i];
          if (templay != this.nowmk) {
            this.bdMap.removeOverlay(templay);
          }
        }
        if (!this.stations) {
          return;
        }
        for (let i = 0; i < this.stations.length; i++) {
          let tempSt = this.stations[i];
          tempSt.startlong = this.nowmk.point.lng
          tempSt.startlat = this.nowmk.point.lat
          var pt = new BMap.Point(tempSt.longitude, tempSt.latitude);
          var myIcon = null;
          if (tempSt.stationStatus && tempSt.stationStatus != '02') {
            myIcon = new BMap.Icon(this.mapslogo1, new BMap.Size(23, 30))
          } else {
            myIcon = new BMap.Icon(this.mapslogo, new BMap.Size(23, 30))
          }
          var marker = new BMap.Marker(pt, {icon: myIcon});  // 创建标注
          this.bdMap.addOverlay(marker);
          if (i == this.selectedIndex) {
            this.locationStation(tempSt)
            this.openInfo(tempSt)
          }
          addClickHandler(tempSt, marker);
        }

        let that = this
        function addClickHandler(tempSt, marker) {
          marker.addEventListener('click', () => {
            that.openInfo(tempSt)
          });

          // EventWrapper.addListener(marker, 'click', function(e){
          //   openInfo(tempSt,e)
          // });
        }
      },
      openInfo(tempSt) {
        this.$refs.StationDetail.setStationDetail(tempSt)
        // this.locationStation(tempSt)
      },
      searchMore: function () {
        this.searchText = null
        this.isShowSearch = true
        // this.$router.push({
        //   path: '/searchmore'
        // });
      },
      getNearStations: function (nowpoint) {

        this.resetCondition()
        if (this.nowmk) {
          this.bdMap.removeOverlay(this.nowmk);
        }
        this.nowmk = new BMap.Marker(nowpoint);
        this.bdMap.addOverlay(this.nowmk);
        this.bdMap.centerAndZoom(nowpoint, 14);
        // this.bdMap.centerAndZoom(new BMap.Point(115.97969400, 29.70252500), 15);
        // 重新设置地图中心点
        // this.bdMap.panTo(nowpoint)
        this.requestStations()
      },
      requestStations: function (loaded) {
        this.$Loading.open()
        this.pageOn++
        let url = '/app/json/djljy/router?m=getOilStation'
        // let url = '/app/json/station/getStationList';
        // 坐标转换了一下，先试试
        // let gp = this.$util.bd_decrypt(this.nowmk.point.lng, this.nowmk.point.lat)
        let paramsData = {
          longitude: this.nowmk.point.lng,
          latitude: this.nowmk.point.lat,
        };
        // let params1 = {
        //   posx: gp.gg_lon,
        //   posy: gp.gg_lat,
        //   page: this.pageOn,
        //   index: this.pageOn,
        //   rows: 12,
        //   token: this.$store.state.login.token,
        //   //1百度 2腾讯
        //   getType: '1'
        // }
        // if (this.mode.length) {
        //   this.mode.forEach(item => {
        //     if (item.dictValue != 'all') {
        //       if (item._type === 1) {
        //         params1['selfOil'] = item.dictValue
        //       } else if (item._type === 2) {
        //         params1[item.dictValue] = 1
        //       }
        //     }
        //   })
        // }
        // params1.distLess = this.$store.state.refuelStation.distLess
        // console.log('params1', params1)
        this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          let data = res.data;
          // let list = data.data || []
          if (data.status == 0) {
            let d = JSON.parse(data.data)
            this.stations = d.oilStations
            // for (let i = 0; i < list.length; i++) {
            //   let item = list[i];
            //   item.serviceUrls = stationToJS.getServiceImgUrls(item);
            //   item.lng = item.posx;
            //   item.lat = item.posy;
            // }

            // this.stations = this.stations.concat(list.map(item => {
            //   item.visible = false
            //   return item
            // }) || [])

            // if (this.stations.length >= data.totalRecords) {
            //   this.isBottomBounce = false;
            // }
            this.addNewLocations()
          } else {
            this.$Toast(data.info);
          }
          if (loaded) {
            loaded('done');
          }
        }, error => {
          if (loaded) {
            loaded('done');
          }
          this.$Loading.close();
          this.$Toast('请求错误');
        })
      },
      gotoStation: function (station) {
        this.$bridgefunc.baiduNav(
          {
            startlong: this.locationinfo.longitude,
            startlat: this.locationinfo.latitude,
            endlong: station.posx,
            endlat: station.posy,
            txlong: station.txPosx,
            txlat: station.txPosy,
            type: "nav"
          }
        );
      },
      locationStation(station) {
        this.bdMap.centerAndZoom(new BMap.Point(station.longitude, station.latitude - 0.01), 14);
      },
      pushToDetail: function (station) {
        this.$router.push({
          path: '/oilstationdetail',
          query: {
            startlong: this.nowmk.point.lng,
            startlat: this.nowmk.point.lat,
          }
        });
      },
      searchMode(mode) {
        const inx = this._findIndex(this.mode, mode)
        if (inx > -1) {
          if (mode.dictValue !== 'all') {
            if (this.mode.length > 1) {
              this.mode.splice(inx, 1)
            }
          }
        } else {
          if (mode.dictValue === 'all') {
            this.mode = [all]
          } else {
            if (this._findIndex(this.mode, all) > -1) {
              this.mode = []
            }
            this.mode.push(mode)
          }
        }
        this.resetCondition()
        this.requestStations()
      },
      downFilter() {
        this.resetCondition()
        this.requestStations()
      },
      _findIndex(arr, obj) {
        return arr.findIndex(item => item.dictValue === obj.dictValue)
      },
      resetCondition() {
        this.pageOn = 0
        this.isBottomBounce = true
        this.stations = []
      },
      queryLocation(curVal) {
        if (curVal) {
          // let url = 'https://api.map.baidu.com/place/v2/search?query=' + curVal + '&region='+ this.$store.state.indexData.province || 131 +'&output=json&city_limit=true&ak=' + Config.mapak;
          let region = this.$store.state.indexData.province || 131
          let url = 'https://api.map.baidu.com/place/v2/suggestion?query=' + curVal + '&region=' + region + '&output=json&ak=' + Config.mapak;
          let _this = this;
          jsonp(url, null, (err, data) => {
            if (err) {
              console.error(err.message)
            } else {
              _this.dataList = data.result
            }
          })
        } else {
          this.dataList = []
        }
      },
      queryMarks() {
        this.$request.post('/app/json/station/queryOilMarks').then(res => {
          if (res.status === 0) { // 1 油品
            res.data && res.data.forEach(item => {
              if (typeof item === 'object') {
                item._type = 1
                this.tags.push(item)
              }
            })
            this.$request.post('/app/json/station/queryServMarks').then(res => {
              if (res.status === 0) { // 2 服务
                res.data && res.data.forEach(item => {
                  if (typeof item === 'object') {
                    item._type = 2
                    this.tags.push(item)
                  }
                })
              }
              if (this.tags.length) {
                this.tags.unshift(all)
              }
            })
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  $searchheight = 44px
  .clearfix:after {
    content ''
    display block
    clear both
    visibility hidden
    height 0
    font-size 0
  }

  .infoBox {
    img {
      width 24px;
      height 24px;
      display none
    }
  }

  .info-box {
    width 250px;
    padding 11px;
    border-radius 5px;
    background: #fff;
    max-height 180px;
    display flex
    flex-direction column
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    position: relative
    margin-bottom: 40px;

    .title {
      font-size: 14px;
      padding-bottom: 11px;
      flex-shrink 0

      .name {
        padding-right: 10px;
        line-height: 18px;
      }
      bdr-b()

      .time {
        padding-top: 8px;
        font-size: 12px;
        color: #999;
      }

    }

    .distance {
      font-size: 12px;
      color: #999;
      padding-top: 5px;

      .img {
        width 14px;
        height auto
        vertical-align middle
        display: inline-block
        margin-right: 3px;
      }
    }

    .service-icon {
      overflow: hidden

      .img {
        display inline-block
        margin: 3px 3px 0 0;
        width 22px;
        height 22px;
      }
    }

    .info-box-btn {
      position: absolute
      top: 3px;
      right 3px;
      z-index 1;
      width 22px;
      height 22px;
      /*background: url("static/image/elticket/close-btn.png") no-repeat*/
      background-size: contain
    }

    .arrow {
      position absolute
      top: 100%;
      left: 50%;
      transform translate3d(-50%, 0, 0)
      border-width 20px 10px 20px 10px;
      border-color #fff transparent transparent transparent
      width: 20px;
      height: 40px;
      display: inline-block;
      border-style: solid
      z-index: 10;
    }

    .discount-list {
      padding 11px 0
      overflow-y auto
      flex 1

      .no-data {
        text-align: center
        color: #999;
        font-size: 12px;
      }

      .discount-item {
        display flex
        align-items center

        & + .discount-item {
          margin-top: 8px;
        }

        .icon {
          padding 3px 4px;
          border-radius 30px;
          flex-shrink 0
          display inline-block
          text-align: center
          color #fff;
          font-size: 10px;
        }

        .text {
          flex 1
          display inline-block
          padding-left: 10px;
          line-height: 20px;
        }
      }
    }
  }

  .mapbot {
    position relative
    width 100%
    height 100%
    overflow hidden
    background-color white

    .map-box {
      position absolute
      top 0
      left 0
      right 0
      bottom 0
    }

    .allmap {
      width 100%
      height 100%
    }

    .mapmore {
      position absolute
      left 12px;
      right 12px;
      top 10px
      padding 10px;
      border-radius 5px;
      background-color white
      box-shadow 0 1px 8px #efefef;
      z-index 1

      .searchdiv {
        display flex
        align-items center

        .city-div {
          display flex;
          align-items center;
          padding 10px 10px 10px 0;
          font-size 14px;
          img {
            width 14px;
            margin-right 5px;
          }
        }
        .search-div {
          flex 1;
          display flex;
          align-items center;
          padding 3px 10px;
          background-color #efefef;
          border-radius 5px;
          overflow hidden;
          .search {
            width 18px;
          }
          span {
            flex 1;
            color #999;
            font-size 14px;
            padding 0 10px;
          }
          .black-text {
            color black;
          }
          .gps-img {
            padding 5px;
            width 32px;
            height 32px;
          }
        }
      }
    }
  }

  /* .oiltype {
     border solid #fa6c00 1px
     background-color: #fa6c00;
     border-top-left-radius: 4px;
     border-bottom-left-radius: 4px;
     width: 50%;
     float: left;
     font-size 16px
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     text-align center

   }*/

  /*  .oilprice {
      border solid #fa6c00 1px
      background-color: #fff;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      width: 50%;
      float: right;
      font-size 16px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align center
    }*/

  /*  .unbusiness {
      border solid #fa6c00 1px
      color #fa6c00
      background-color: #fff;
      border-radius 4px
      width 100%
      font-size 16px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align center

    }*/

  // 搜索相关样式
  .search-container {
    position fixed
    left 0
    top 0
    background-color #fff
    width 100%
    height 100%
    z-index 99999

    .theme_font_black {
      line-height 21px
    }

    .searchmorebot {
      position absolute
      top 0px
      bottom 0px
      left 0px
      right 0px
      background-color white
      overflow hidden

      .qrcode-top {
        position absolute;
        width 100%;
        overflow hidden
        z-index 5;
      }

      .navcontent {
        position: absolute;
        width 100%
        bottom 0px
        left 0px
        overflow hidden
        display flex
        justify-content space-between
        align-items center

        .mall-fanhui {
          margin-left 10px
          font-size 20px
        }

        .search-div {
          flex 1
          background-color #F2F2F2
          margin 0px 20px
          height 30px
          border-radius 20px
          padding 0px 10px
          display flex
          align-items center

          .searchimg {
            width 20px
            height 20px
            display: block;
            vertical-align: middle;
          }

          .form-control {
            flex 1
          }

          .input-none {
            padding-left: 6px;
            height: 25px;
            line-height 25px;
            border: 0;
            background: none;
            outline: none;
            font-size: $font-size-small;
            overflow: hidden;
            width 80%
          }
        }

        .cancel {
          font-size $font-size-small
          padding 10px
          padding-left 0px
        }
      }

      .history-container {
        margin 10px
        font-size 15px
        box-shadow 0 0 9px 0 rgba(197, 197, 197, 0.3)
        padding 15px 10px

        .his-item-container {
          li {
            float left
            padding 4px 8px
            color #666
            background-color #f5f5f5
            margin-top 0.266667rem
            margin-right 0.266667rem
            border-radius 0.266667rem
            font-size 0.373333rem
            white-space nowrap
            max-width 170px
            text-overflow ellipsis
            overflow hidden
          }
        }

        .clear-btn {
          display block
          float right
          font-size 14px
        }
      }

      .listcontent {
        position absolute
        top 0px
        bottom 0px
        left 0px
        right 0px
        -webkit-overflow-scrolling touch
        overflow-y auto

        .list-item {
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          margin 10px
          padding 15px 10px

          .list_name {
            font-size $font-size-medium
            ellipse()
          }

          .list_location {
            margin-top 6px
            font-size $font-size-small
            ellipse()
          }
        }
      }
    }
  }

  .no-gps-container {
    padding-top: 120px;
    text-align: center

    .img {
      width 150px;
    }

    .msg {
      color: #999;
      padding-top: 30px;
    }

    .refresh {
      padding-top: 20px;

      .btn {
        padding 5px 11px;
        color: #fff;
        background: #339af7
        display inline-block
        border-radius 5px;
      }
    }
  }
</style>
