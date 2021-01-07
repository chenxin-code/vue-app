/**Created by steven on 2018/4/23.*/
<template>
  <div class="mapbot">
    <nav-top
      @backEvent="$router.go(-1)"
      title="油气站导航"></nav-top>
    <nav-content>
      <div ref="mapBxo" class="map-box">
        <div id="allmap" class="allmap"></div>
        <div class="mapmore">
          <div class="searchdiv">
            <div class="getlocation">
              <img
                class="locationimg"
                src="../../assets/images/dingwei.png"
                alt=""
                @click="getLocation">
            </div>
            <div class="getmore" @click="searchMore">
              <img class="search" src="../../assets/images/search.png" alt="">
              <span v-if="!searchText">输入地点或商区名称</span>
              <span v-else class="black-text">{{ searchText }}</span>
            </div>
          </div>
        </div>
      </div>
      <oil-station-list
        :stations="stations"
        ref="stationList"
        :isBottomBounce="isBottomBounce"
        @requestStations="requestStations"
        @gotoStation="gotoStation"
        @locationStation="locationStation"
        @gotoRefuel="gotoRefuel"
        @pushToDetail="pushToDetail"></oil-station-list>
    </nav-content>
    <!-- 搜索页面 -->
    <div
      v-if="isShowSearch"
      class="search-container">
      <div class="search-bar">
        <div class="search-div">
          <img
            class="searchimg"
            src="../../assets/images/search.png"
            alt="">
          <input
            v-model="searchText"
            class="input-none"
            type="search"
            placeholder="输入地点或商区名称"/>
        </div>
        <span
          class="cancel"
          @click="cancelEvent">取消</span>
      </div>
      <div
        v-if="!searchText && searchHistoryArr[0]"
        class="history-container">
        <p class="his-title">搜索历史<i class="clear-btn iconfont mall-shanchu theme_font_gray_i" @click="clearHistory"></i></p>
        <ul class="his-item-container clearfix">
          <li
            v-for="(item, index) in searchHistoryArr"
            :key="index"
            @click="historyClick(item)">{{ item }}</li>
        </ul>
      </div>
      <div v-else class="listcontent">
        <div
          class="list-item"
          v-for="(item, index) in dataList"
          :key="index"
          v-show="item.uid"
          @click="backMap(item)">
          <div class="list_name theme_font_black">{{item.name}}</div>
          <div class="list_location theme_font_tint" v-show="item.address && item.address.length">{{item.address}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // import {Toast} from 'mint-ui'
  import oilStationList from './oil-station-list.vue';
  import { MP } from '@/utils/map'
  import '@/utils/EventWrapper'
  import jsonp from 'jsonp'
  import wxfunc from "@/utils/wxfunc";
  import utils from '../../utils'

  export default {
    name: "home-stationto",
    components: {
      // Toast,
      oilStationList
    },
    data() {
      return {
        bdMap: null,
        stations: [],
        nowmk: null,
        openListener: null,
        pageOn: 0, //第几页
        isBottomBounce: true,
        // 经纬度
        geoLocation: {
          latitude: 39.983494, // 纬度
          longitude: 116.444946 // 经度
        },
        // 搜索相关变量
        isShowSearch: false,
        searchText: null,
        isActive: false,
        dataList: [],
        searchHistoryArr: [],

        // 页面来源
        comeFromPage: ''
      }
    },
    mounted() {
      this.comeFromPage = this.$route.query.comeFromPage || ''
      localStorage.setItem('mapKey', new Date().getTime())

      this.initHistory()

      this.$nextTick(function () {
        MP().then(BMap => {
          this.initBMap(BMap);
          require('@/utils/InfoBox');
          // 获取用户位置-请求油站信息
          this.getWxLocation(() => {
            this.getNearStations(new BMap.Point(this.geoLocation.longitude, this.geoLocation.latitude))
          })
        });
      })

      // 仅在测试时候打开！！！！
      // setTimeout(() => {
      //   this.getNearStations(new BMap.Point(116.373778, 40.104674))
      // }, 1000);
    },
    watch: {
      searchText(curVal, oldVal) {
        this.initHistory()
        if (curVal) {
          let url = 'https://api.map.baidu.com/place/v2/search?query=' + curVal + '&region=全国&output=json&ak=' + 'KiG7iFx8miivMFGAoWPYIyG6CWYUHUC3';
          let _this = this;
          jsonp(url, null, (err, data) => {
            if (err) {
              console.error(err.message)
            } else {
              _this.dataList = data.results
            }
          })
        } else {
          this.dataList = [];
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      // this.$keepaliveHelper.deleteCache(this)
      next()
    },
    methods: {
      cancelEvent() {
        if (this.searchText) {
          this.searchText = null
        } else {
          this.isShowSearch = false
        }
      },
      searchBackEvent() {
        this.isShowSearch = false
      },
      _moveFunc(value) {
        this.searchText = ''
        this.isActive = true
      },
      focusFunc() {
        this.isActive = false
      },
      backMap(item) {
        // 重新设置 geoLocation坐标，根据新坐标获取油站列表
        this.geoLocation.latitude = item.location.lat
        this.geoLocation.longitude = item.location.lng

        this.setHistoryItems(item.name)
        this.$store.state.selectp.lat = item.location.lat
        this.$store.state.selectp.lng = item.location.lng
        this.$bridgefunc.vuexStorage(() => {
          this.searchBackEvent()
        })
        this.newGet()
      },
      // 存储搜索历史记录
      setHistoryItems(keyword) {
        keyword = keyword.trim()
        let { searchHistory } = localStorage
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
      // 搜索框点击事件
      searchMore() {
        this.searchText = null
        this.isShowSearch = true
      },
      // 微信获取个人位置方法
      getWxLocation(callback) {
        wxfunc.getWechatSignature((isSignature) => {
          // 签名成功
          if(isSignature){
            wxfunc.wxGetLocation((location) => {
              if (location) {
                let convertor = new BMap.Convertor()
                let pointArr = []
                pointArr.push(new BMap.Point(location.longitude, location.latitude))
                // 真实经纬度转成百度坐标
                convertor.translate(pointArr, 3, 5, (translatedPoint) => {
                  if (translatedPoint.status === 0) {
                    this.geoLocation.latitude = translatedPoint.points[0].lat
                    this.geoLocation.longitude = translatedPoint.points[0].lng
                    callback && callback()
                    this.bdMap.panTo(new BMap.Point(translatedPoint.points[0].lng, translatedPoint.points[0].lat))
                  }
                })
              }
            })
          } else {
            console.log('签名失败')
          }
        })
      },
      // 初始化地图方法
      initBMap() {
        // 在百度地图容器中创建一个地图
        this.bdMap = new BMap.Map("allmap")
        // 初始化地图,设置中心点坐标和地图级别
        this.bdMap.centerAndZoom(new BMap.Point(this.geoLocation.longitude, this.geoLocation.latitude), 14)
        // 添加缩放功能
        this.bdMap.enableScrollWheelZoom(true)
        // 重新设置地图中心点位置
        this.bdMap.panTo(new BMap.Point(this.geoLocation.longitude, this.geoLocation.latitude))
      },
      // 通过搜索地址重新定位
      newGet() {
        if (this.$store.state.selectp.lng && this.$store.state.selectp.lng != '') {
          this.bdMap.panTo(new BMap.Point(this.$store.state.selectp.lng, this.$store.state.selectp.lat))
          this.getNearStations(new BMap.Point(this.$store.state.selectp.lng, this.$store.state.selectp.lat))
        }
      },
      // 重新定位
      getLocation() {
        this.getWxLocation(() => {
          this.getNearStations(new BMap.Point(this.geoLocation.longitude, this.geoLocation.latitude))
        })
      },
      // 给每个油站添加标注
      addNewLocations() {
        let that = this
        let overlays = that.bdMap.getOverlays()
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
          let pt = new BMap.Point(tempSt.lng, tempSt.lat)
          let myIcon = new BMap.Icon("static/image/station/location-oil.png", new BMap.Size(23, 30))
          let marker = new BMap.Marker(pt, {icon: myIcon})  // 创建标注
          this.bdMap.addOverlay(marker)
          marker.addEventListener('click', () => {
            this.addMapMark(tempSt)
          })
        }
      },
      // 给地图添加信息框方法
      addMapMark(tempSt) {
        let point = new BMap.Point(tempSt.lng, tempSt.lat)
        let content = ''
        if (this.comeFromPage == '/register' || this.comeFromPage == '/openaccountonly' || this.comeFromPage == '/openaccount') {
          content = `
            <div class="info-box">
              <span class="info-box-btn" id="closeBtn"></span>
              <div class="station-name">油气站名称：${ tempSt.stationName }</div>
              <div id="setDefault" class="chose-btn">选择该油气站</div>
            </div>
          `
        } else {
          content = `
            <div class="info-box">
              <span class="info-box-btn" id="closeBtn"></span>
              <div class="station-name">油气站名称：${ tempSt.stationName }</div>
            </div>
          `
        }

        if (this.infoBox) {
          this.infoBox.close()
          this.infoBox = null
        }
        this.infoBox = new BMapLib.InfoBox(this.bdMap, content, {enableAutoPan: true});
        this.infoBox.open(point)

        if (this.openListener) {
          EventWrapper.removeListener(this.openListener);
        }

        this.openListener = EventWrapper.addListener(this.infoBox, 'open', (e) => {
          this.$nextTick(() => {
            EventWrapper.addDomListener(document.getElementById('closeBtn'), 'touchstart', () => {
              this.infoBox.close()
            })
            if (document.getElementById('setDefault')) {
              EventWrapper.addDomListener(document.getElementById('setDefault'), 'touchstart', () => {
                // 有页面来源
                if (this.comeFromPage) {
                  switch (this.comeFromPage) {
                    // 来自开户注册
                    case '/openaccountonly':
                      utils.goRegister('/openaccountonly', tempSt.stationName, tempSt.stationCode)
                      break
                    // 来自手机号注册
                    case '/register':
                      utils.goRegister('/register', tempSt.stationName, tempSt.stationCode)
                      break
                    // 来自开户办卡
                    case '/openaccount':
                      utils.goRegister('/openaccount', tempSt.stationName, tempSt.stationCode)
                  }
                }
              })
            }
          })
        })
      },
      // 请求油站-方法
      getNearStations(nowpoint) {
        // 重新绘制中心点座标
        if (this.nowmk) {
          this.bdMap.removeOverlay(this.nowmk)
        }
        this.nowmk = new BMap.Marker(nowpoint)
        this.bdMap.addOverlay(this.nowmk)
        this.requestStations()
      },
      // 请求油站-接口
      requestStations(loaded) {
        this.$Loading.open()
        this.pageOn++
        let url = '/app/json/hy_station/getStationList';
        let params = {
          posx: this.geoLocation.longitude,
          posy: this.geoLocation.latitude,
          getType: 2,
          count: 5,
          distLess: 100000,
          isNavigationFlag: 0
        }
        if (!this.comeFromPage || this.comeFromPage == 'undefined') { // 无页面来源，导航进入
          params.isNavigationFlag = 1
        }
        if (decodeURIComponent(this.$route.query.comeFromPage) === '/register') {
          delete params.distLess
        }
        if (decodeURIComponent(this.$route.query.comeFromPage) === '/openaccountonly') {
          delete params.distLess
        }

        if (this.$route.query.isOpenCard == 'true') {
          params.isOpenAccount = 1
        }
        this.$http.post(url, params).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              for (let i = 0; i < data.data.length; i++) {
                let item = data.data[i]
                item.lng = item.posx
                item.lat = item.posy
              }
              this.stations = data.data
              if (this.stations.length >= data.totalRecords) {
                this.isBottomBounce = false;
              }
              this.addNewLocations();
            } else {
              this.stations = []
            }
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
      // 去导航
      gotoStation(station) {
        wxfunc.getWechatSignature((isSignature) => {
          //签名成功
          if (isSignature) {
            qq.maps.convertor.translate(new qq.maps.LatLng(station.posy, station.posx), 3, function (res) {
              wx.openLocation({
                longitude: res[0].lng, // 经度，浮点数，范围为180 ~ -180。
                latitude: res[0].lat, // 纬度，浮点数，范围为90 ~ -90
                name: station.stationName, // 位置名
                address: station.address, // 地址详情说明
                scale: 28 // 地图缩放级别,整形值,范围从1~28。默认为最大
              })
            })
          } else {
            console.log('签名失败')
          }
        })
      },
      locationStation(station) {
        this.bdMap.panTo(new BMap.Point(station.posx, station.posy), {
          noAnimation: true
        })
        this.addMapMark(station)
      },
      // 去详情
      pushToDetail(station) {
        utils.stationDetail(station)
      },
      // 去加油
      gotoRefuel(station) {
        utils.goRefuel()
      }
    }
  }
</script>

<style lang="stylus">
  @import "~@/common/stylus/variable.styl"
  @import "~@/common/stylus/mixin.styl"
  $color-theme = #068ED0
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
    padding 20px 10px
    border-radius 5px
    background #fff
    width 240px
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3)
    position relative
    margin-bottom: 40px
    &::before {
      content ''
      position absolute
      top 100%
      left 50%
      transform translate3d(-50%, 0, 0)
      border-width 20px 10px 20px 10px
      border-color #fff transparent transparent transparent
      width 20px
      height 40px
      display inline-block
      border-style solid
      z-index 10
    }
    .info-box-btn {
      position absolute
      top 3px
      right 3px
      z-index 1
      width 18px
      height 18px
      background url("../../assets/images/close-btn.png") no-repeat
      background-size contain
    }
    .station-name {
      font-size: 14px
      padding-right: 20px
      color $color-theme
      line-height 20px
    }
    .station-activity {
      font-size 12px
      color #999
      margin-top 10px
    }
    .chose-btn {
      margin 10px auto 0
      width 70%
      padding: 9px 0
      border-radius: 6px
      background: -webkit-linear-gradient(-75deg, #0098ff, #0096fc, #0064a7, #005d9c)
      text-align: center
      color: #fff
      font-size: 12px
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
      width 100%
      left 0
      top 0

      .searchdiv {
        margin-left 10px
        margin-top 7px
        margin-right 10px
        display flex
        align-items center
      }
      .getlocation {
        border-radius 5px
        height 40px
        width 50px
        display flex
        align-items center
        justify-content center
        background-color white
        .locationimg {
          width 24px
          height 24px
        }
      }
      .getmore {
        flex 1
        margin-left 10px
        background-color white
        height 40px
        border-radius 5px
        padding 0px 15px
        display flex
        align-items center

        img {
          width 20px
          height 20px
        }
        span {
          color $color-line-gray-l
          font-size $font-size-medium
          line-height 20px
          height 20px
          padding-top 1px
          &.black-text {
            color #1a1a1a
          }
        }
      }
      .getmore * {
        display: inline-block;
        vertical-align: middle
      }
    }
  }

  .oiltype {
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

  }

  .oilprice {
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
  }

  .unbusiness {
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

  }

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
    .search-bar {
      padding 15px 0 8px
      position relative
      z-index 999999
      background-color #fff
      .search-div {
        background-color #F2F2F2
        width 80%
        height 30px
        border-radius 20px
        padding 0px 10px
        display flex
        align-items center
        margin-left 15px
        .searchimg {
          width 20px
          height 20px
        }
        .input-none {
          margin-left 5px
          width: 100%;
          height: 25px;
          border: 0px;
          background: none;
          outline: none;
          font-size: $font-size-small;
          overflow: hidden;
        }
      }
      .cancel {
        position absolute
        right 15px
        top 50%
        transform translateY(-50%)
        display block
        // padding 10px 0 10px 10px
      }
    }
    .history-container {
      margin 10px
      font-size 15px
      box-shadow 0 0 9px 0 rgba(197, 197, 197, 0.3)
      padding 15px 10px
      position relative
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
      overflow-y auto
      padding-top 48px
      box-sizing border-box
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
</style>
