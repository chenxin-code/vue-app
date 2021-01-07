<template>
  <div class="oil-station-list" ref="oilListEl" :style="{top: nowTop + 'px'}">
    <!--<header class="header"  ref="handleEl">-->
    <!--上拉查看所有结果-->
    <!--</header>-->
    <div class="drag-line" @touchstart='_touchstart'
         @touchmove="_touchmove" @touchend="_touchend">
      <img class="icon-more" src="../../assets/images/icon_more.png" alt="">
      <div class="text">{{isUp ? '下拉查看地图' : '上拉查看更多'}}</div>
    </div>
    <PullRefresh class="oil-station-list-content" ref="PullRefresh" :pullUpLoad="true" @pullingUp="refresh"
                 :hasMore="isBottomBounce"
                 :data="stations">
      <div class="cells" ref="cellsEl" v-if="stations.length > 0">
        <div class="cell cell_access" :class="{'cell-line':index>0}" v-for="(station,index) in stations">
          <div class="cell__hd ">
            <img class="logoimg" src="../../assets/images/hy-logo.png">
          </div>
          <div class="cell__bd" @click="locationStation(station)">
            <p class="name">
              <img
                v-if="station.mktActivityList && station.mktActivityList.length"
                class="icon"
                src="../../assets/images/offer.gif"
                alt="">
              {{station.stationName}}
            </p>
            <p class="font-medium-l">
              <img src="../../assets/images/location.png">
              <span class="text">
              距您{{(Number(station.distance) / 1000).toFixed(2)}} 公里<br>
            </span>
            </p>
            <div class="serviceurl" v-for="imgUrl in  station.serviceUrls">
              <img :src="imgUrl" alt="">
            </div>
          </div>

          <div class="cell_right">
            <div
              class="r-fun"
              @click="goRefuel(station)">
              <div class="r-img">
                <img class="dh" src="../../assets/images/refuel-icon.png" alt="">
              </div>
              <p class="r-p">去加油/气</p>
            </div>
            <div class="r-fun" @click="goStation(station)">
              <div class="r-img">
                <img class="dh" src="../../assets/images/navigation.png" alt="">
              </div>
              <p class="r-p">导航</p>
            </div>
            <div class="r-fun" @click="pushToDetail(station)">
              <div class="r-img">
                <img class="detail" src="../../assets/images/station-details.png" alt="">
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
      </div>
      <div v-else class="no-near-station">附近暂无油站···</div>
    </PullRefresh>
  </div>
</template>

<script>
  import PullRefresh from '@/components/base/scroll/scroll'
  export default {
    name: 'oil-station-list',
    components: {
      PullRefresh,
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
        isUp: false
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
    },
    created() {
    },
    mounted() {
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
        this.$emit('pushToDetail', station);
      },

      goStation: function (station) {
        this.$emit('gotoStation', station);
      },

      // 去加油
      goRefuel(station) {
        this.$emit('gotoRefuel', station)
        // 去加油 TODO

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
        // let item = station.storeModel
        // this.$store.state.mall2.zitiAddress = item

        // this.$market._addToMyPickupAddress(item.id)
        // this.$market._setDefaultPickupAddress(item.id)

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
          isnativetop: '0',
          query: {
            station: encodeURIComponent(JSON.stringify(station)),
          },
        });
      },
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
    .drag-line {
      text-align: center
      padding 5px 0
      padding-bottom: 10px;
      background: #fff;
      bdr-b()
      .icon-more {
        width 20px;
      }
      .text {
        padding-top: 4px;
        font-size:12px;
      }
    }
    .oil-station-list-content {
      flex 1
      .no-near-station {
        text-align center
        line-height 30px
      }
    }
  }

  .cells {
    .fill-div {
      width 100%
    }
    .cell {
      padding: 15px;
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
      float left
      margin-top 3px
      margin-right 3px
      img {
        width 22px
        height 22px
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
          margin 0 auto
          .dh {
            width 22px
            height 22px
          }
          .detail {
            width 20px
            height 6px
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
</style>
