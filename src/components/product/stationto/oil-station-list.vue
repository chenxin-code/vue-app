<template>
  <div class="oil-station-list" ref="oilListEl" :style="{top: nowTop + 'px'}">
    <!--<header class="header"  ref="handleEl">-->
    <!--上拉查看所有结果-->
    <!--</header>-->
    <div class="drag-line">
      <div class="top">
        <div class="left"></div>
        <div class="center" @touchstart='_touchstart'
             @touchmove="_touchmove" @touchend="_touchend">
          <img class="icon-more" src="../../../assets/icons/icon_more.png" alt="">
          <div class="text">{{isUp ? '下拉查看地图' : '上拉查看更多'}}</div>
        </div>
        <div class="right">
          <van-dropdown-menu  active-color="#f02c2d">
            <van-dropdown-item @change="downFilterHandle" ref="distanceFilter" v-model="distance" :options="distanceList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="search-mode" v-if="tags.length">
        <button class="btn" v-for="item in tags" :class="{opacity: _findIndex(mode, item) === -1}"
                @click="$emit('searchMode', item)">{{item.alias}}
        </button>
      </div>
    </div>
    <PullRefresh class="oil-station-list-content" ref="PullRefresh" :pullUpLoad="true" @pullingUp="refresh"
                 :hasMore="isBottomBounce"
                 :data="stations">
      <div class="cells" ref="cellsEl">
        <div style="background: #fff" v-for="(station,index) in stations">
          <div class="cell cell_access" :class="{'cell-line':index>0}">
            <div class="cell__hd ">
              <img class="logoimg" :src="cellLogo">
            </div>
            <div class="cell__bd" @click="locationStation(station)">
              <p class="name">
                <img
                  v-if="station.mktActivityList && station.mktActivityList.length"
                  class="icon"
                  src="@/assets/refuel/offer.gif"
                  alt="">
                {{station.stationName}}
              </p>
              <p class="font-medium-l station-distance">
                <img src="@/assets/refuel/location.png">
                <span class="text">{{tips}} {{(Number(station.distance) / 1000).toFixed(2)}} 公里</span>
              </p>
            </div>
            <div class="cell_right">
              <div
                class="r-fun"
                @click="goShopping(station)"
                v-if="station.pickUpOuCode">
                <div class="r-img">
                  <img class="dh" src="static/image/station/icon1.png" alt="">
                </div>
                <p class="r-p">购物</p>
              </div>
              <div class="r-fun" @click="goStation(station)">
                <div class="r-img">
                  <img class="dh" src="static/image/station/icon2.png" alt="">
                </div>
                <p class="r-p">导航</p>
              </div>
              <div class="r-fun" @click="pushToDetail(station)">
                <div class="r-img">
                  <img class="detail" src="static/image/station/icon3.png" alt="">
                </div>
                <p class="r-p">详情</p>
              </div>
            </div>

            <!--<div class="cell-box__btn">-->
            <!--<div class="cell__btn" @click="addGas(station)">-->
            <!--<img src="@/assets/refuel/jiayou-icon5.png">-->
            <!--<span class="text">加油</span>-->
            <!--</div>-->
            <!--<div class="cell__btn" @click="goStation(station)">-->
            <!--<img src="@/assets/refuel/jiayou-icon6.png">-->
            <!--<span class="text">到这里</span>-->
            <!--</div>-->
            <!--</div>-->
          </div>
          <div class="station-info">
            <div class="business-time">
              营业时间:{{station.opningTime}}-{{station.closingTime}}
            </div>
            <div class="active-list" v-if="station.mktActivityList && station.mktActivityList.length && $store.state.globalConfig.stationMktActDisabled != 1">
              <span class="icon theme_bg_red">惠</span>
              <template v-for="(item,index) in station.mktActivityList">
                <span class="text" v-if="station.visible || index < 3">{{item.activityTitle}}</span>
              </template>
              <p class="query-more" v-if="station.mktActivityList.length > 3"
                 @click.stop="station.visible = !station.visible">查看更多</p>
            </div>
            <div class="serviceurl">
              <img v-for="imgUrl in  station.serviceUrls" :src="imgUrl" alt="">
            </div>
          </div>
        </div>

        <div class="no-data" v-show="!stations.length">暂无油站~</div>
      </div>

    </PullRefresh>
  </div>
</template>

<script>
  import PullRefresh from '@/components/base/scroll/scroll'
  import userCenter from '@/components/usercenter/js/userCenter.js'
  import {DropdownMenu, DropdownItem, Dialog} from 'vant'

  export default {
    name: 'oil-station-list',
    components: {
      PullRefresh,
      [DropdownMenu.name]: DropdownMenu,
      [DropdownItem.name]: DropdownItem
    },
    data() {
      return {
        nowTop: '',
        domHeight: '',
        //是否再向上移动中
        isTouchMovingUp: false,
        //是否再向下移动中
        isTouchMovingDown: false,
        startY: '',
        isUp: false,
        tips: '距您',
        cellLogo: require('@/assets/refuel/logo.png'),
        oilType: '',
        oilTypeList: [],
        distance: '',
        distanceList: []
      };
    },
    props: {
      stations: {
        type: Array,
      },
      isBottomBounce: {
        type: Boolean,
        default: false
      },
      searchText: {
        type: String,
        default: ''
      },
      stationType: {
        type: String,
        default: ''
      },
      mode: Array,
      tags: Array
    },
    created() {
      console.log(666)
      if (this.$store.state.globalConfig.logo && this.$store.state.globalConfig.logo != '*') {
        this.cellLogo = this.$store.state.globalConfig.logo;
      }
      // 距离
      this.$request.post('/app/json/app_dict/getDictByAlias', {alias: 'DistanceCode'}).then(res => {
        if (res.status === 0) {
          const list = res.data || []
          this.distanceList = [{
            text: '全部',
            value: ''
          }]
          list.forEach(item => {
            if (item.dictValue && item.dictKey) {
              this.distanceList.push({
                text: item.dictValue,
                value: item.dictKey * 1000 // 改为米
              })
            }
          })
          this.distance = this.$store.state.refuelStation.distLess
        }
      })
    },
    watch: {
      searchText() {
        console.log(this.searchText)
        if (this.searchText == null) {
          this.tips = '距您'
        } else {
          this.tips = '据搜索目的地'
        }
      },
      isUp() {
        this.$refs.distanceFilter.toggle(false);
      }
    },
    mounted() {
      console.log(this.stations)

      this.$nextTick(() => {
        /**
         *获取dom高度
         *设置列表默认位置为从头部70%的位置
         *获取列表默认坐标
         *获取拖拽按钮element
         */
        this.domHeight = document.documentElement.clientHeight;
        this.nowTop = this.domHeight * 0.6;

      });
    },
    methods: {
      downFilterHandle() {
        this.$store.state.refuelStation.distLess = this.distance
        this.$emit('downFilter')
        this.$bridgefunc.vuexStorage()
      },
      listenScroll: function (posy) {
        // console.log(posy)
      },
      refresh: function (loaded) {
        this.$emit('requestStations', loaded);
      },
      _touchstart: function (e) {
        let touches = e.touches[0];
        // 获取拖拽按钮的默认坐标
        this.startY = touches.clientY;
      },

      /**
       * 默认地图占据页面高度的70%，向上拖动列表时候地图占据页面的30%。向下拖动相反
       * 默认列表占据页面高度的30%，向上拖动列表时候列表占据页面的70%。向下拖动相反
       * 默认动画用时500ms
       */
      _touchmove: function (e) {
        let touches = e.touches[0];
        let pageY1 = this.startY
        let pageY2 = touches.clientY
        let top = 0
        // 向上拉动
        if (pageY1 > pageY2) {
          top = this.domHeight * 0.2;
          this.isUp = true
        } else {
          top = this.domHeight * 0.6;
          this.isUp = false
        }
        this.nowTop = top
      },
      _touchend: function () {
//        this._setWrapperTop()
      },
      // 跳转至详情
      pushToDetail: function (station) {
        this.$store.state.refuelStationDetail = station
        this.$bridgefunc.vuexStorage()
        this.$emit('pushToDetail', station);
      },

      goStation: function (station) {

        // 配置如果是加油券详情跳转过来的需要加提示
        if(this.stationType === 'coupon') {
            this.couponGoStation(station)
        } else {
          this.$emit('gotoStation', station);
        }

      },
      couponGoStation(station) {
        // 当前导航距离如果超过了配置的距离，弹出提示语
        if(station.distance > this.$store.state.globalConfig.how_distance_alert_warning) {
          Dialog.confirm({
            confirmButtonText: '继续导航',
            confirmButtonColor: '#ee0a24',
            message: '当前油站距离油站太远，是否定位导航',
          })
          .then(() => {
            this.$emit('gotoStation', station);
          })
        } else {
          this.$emit('gotoStation', station);
        }

      },
      goShopping(station) {
        // this.$market.pushToPickupProducts({
        //   // address: "永丰县龙冈乡油科所斜对面",
        //   // addressFull: "江西永丰县龙冈乡油科所斜对面",
        //   // cityId: "1898",
        //   // cityName: "",
        //   // distance: 1495878.7,
        //   id: station.id,
        //   // openTime: "6:00-22:00",
        //   // phone: "0796-2591946",
        //   // provinceId: "21",
        //   // provinceName: "江西",
        //   storeCode: station.pickUpOuCode,
        //   storeName: station.pickUpOuName,
        //   // userId: ""
        // })
        let item = station.storeModel;
        this.$market.pushToPickupProducts(item);
        // this.$store.state.mall2.zitiAddress = item
        //
        // userCenter._addToMyPickupAddress(item.id)
        // userCenter._setDefaultPickupAddress(item.id)
        //
        // this.$store.state.mall2.staticDeliverType = 1
        // let path = '/mall2/list/' + this.$util.getDataString()
        // this.$router.push({
        //   path: path,
        //   query: {
        //     lastPath: this.$route.path
        //   }
        // })
      },

      locationStation: function (station) {
        this.$emit('locationStation', station);
      },
      addGas: function (station) {
        this.$bridgefunc.customPush({
          path: 'RefuelSelectOilGun',
          isnativetop: '1',
          query: {
            station: encodeURIComponent(JSON.stringify(station)),
          },
        });
      },
      _findIndex(arr, obj) {
        return arr.findIndex(item => item.dictValue === obj.dictValue)
      }
    },
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  $color-white = #fff;
  .oil-station-list {
    position: absolute;
    bottom: 10px;
    right: 10px;
    left: 10px;
    overflow: hidden;
    border-radius 5px
    display flex
    flex-direction column
    transition: top 0.2s

    /deep/ .van-dropdown-item {
      right: 10px;
      left: 10px;
    }

    /deep/ .van-dropdown-item--down{
      bottom: 55px;
    }
    .top {
      display flex
      justify-content space-between
      .left, .center, .right{
        width 33.33%
      }
    }

    .drag-line {
      text-align: center
      padding 5px 0
      padding-bottom: 10px;
      background: #fff;
      bdr-b()

      &:after{
        z-index 9
      }
      .search-mode {
        text-align left
        padding-right: 10px

        .btn {
          -webkit-appearance: none
          -moz-appearance: none
          appearance: none
          background: #f02c2d
          padding 7px 15px;
          color: #fff;
          border-radius 5px;
          border: none
          font-size: 15px
          margin 10px 0 0 10px;

          &.opacity {
            opacity 0.6
          }
        }
      }

      .icon-more {
        width 20px;
        background: none
      }

      .text {
        padding-top: 4px;
        font-size: 12px;
      }
    }

    .oil-station-list-content {
      flex 1
    }
  }

  .active-list {
    padding 4px 0

    .icon {
      padding 3px 4px;
      border-radius 30px;
      display inline-block
      vertical-align middle
      text-align: center
      color #fff;
      font-size: 10px;
    }

    .text {
      display inline-block
      vertical-align middle
      padding-left: 5px;
      line-height: 20px;
      font-size: 12px;
      color: #999
    }

    .query-more {
      text-align center
      padding 11px 0;
      justify-content center
    }
  }

  .cells {
    .fill-div {
      width 100%
    }

    .cell {
      padding: 15px 15px 5px 15px;
      background-color: $color-white;
      overflow: hidden
      align-items flex-start
    }

    .cell-line:before {
      left: 10px;
      right: 10px;
    }

    .cell__hd {
      align-self: flex-start;

      .logoimg {
        width 40px
        height 40px
      }
    }

    .serviceurl {

      img {
        width 28px
        height 28px
        margin 0 2px;
      }
    }

    .cell__bd {
      padding-left: 10px;
      overflow hidden

      .name {
        font-size: 16px;
        color: $color-background-b;
        margin-bottom: 5px;
        position relative
        line-height: 20px;

        .icon {
          width 20px;
          height 20px;
          flex-shrink 0
          display inline-block
          margin-right: 5px
        }
      }

      p {
        display: flex;
        align-items: center;

        img {
          width: 15px;
          height: 15px;
          vertical-align: middle;
          align-items: center;
        }

        .text {
          padding-left: 5px;
          font-size: $font-size-medium;
          color: $color-background;
        }
      }
    }

    .cell_right {
      display flex
      align-items center

      .r-fun {
        text-align center

        .r-img {
          width 22px
          height 22px
          display flex
          align-items center
          justify-content center

          .dh {
            width 22px
            height 22px
          }

          .detail {
            width 20px
            width 20px
          }
        }

        .r-p {
          margin-top 4px
          font-size $font-size-small
        }

        & + .r-fun {
          margin-left 10px
        }
      }
    }

    .cell__ft {
      padding-right: 20px;
      color: $color-theme-text-d;
    }

    .cell-box__btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-top: 10px;

      .cell__btn {
        width: 48%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        border: 1px solid $color-line-gray-l;
        border-radius: 5px;

        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          align-items: center;
        }

        .text {
          padding-left: 10px;
          font-size: $font-size-medium;
          color: $color-background;
        }
      }
    }
  }

  .station-info {
    padding 0 15px 15px 65px;

    .station-distance {
      img {
        width: 15px;
        height: 15px;
        vertical-align: middle;
        align-items: center;
      }
    }
  }

  .business-time {
    color #898989
    padding 5px 1px
  }
  /deep/.van-dropdown-menu__bar{
    box-shadow none!important
  }
</style>
