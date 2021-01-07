<template>
  <div class="bottom">
    <div class="station-list">
      <div class="cell-station" v-for="item in stations" v-if="item.stationCode!==''">
        <img class="logo-div full-img" src="static/image/refuel/logo.png">
        <div style="flex: 1">
          <div class="font-medium single-line">{{item.stationName}}</div>
          <div>
            <img class="position-img" src="static/image/refuel/refuel03.png"/>
            <span class="position-span font-small-l">距离您{{item.distance}}公里</span>
          </div>
        </div>
        <div class="select_style" @click="selectEvent(item)">加油</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'

  export default {
    name: 'refuel-station-list',
    components: {
      Toast
    },
    data() {
      return {
        stations: [{
          stationCode: '',
          stationName: '',
          posx: '',
          posy: '',
          phone: '',
          provinceName: '',
          cityCompName: '',
          address: '',
          introdection: '',
          distance: '',
          water: '',
          cleaning: '',
          toilet: '',
          maintain: '',
          food: '',
          hotWater: '',
          selfService: '',
          recharge: '',
          cvs: '',
          state: '',
          cardService: '',
          weighBridge: '',
          bacco: '',
          drinks: '',
          scenic: '',
          catering: '',
          hotel: '',
          bank: '',
          selfOil: '',
        }],
        longitude: '',//经度
        latitude: ''//纬度
      }
    },
    methods: {
      selectEvent: function (station) {
        console.log('station',station)
        this.$store.state.refuelStation = station;
        let _this = this;
        this.$bridgefunc.vuexStorage(function () {
          _this.$bridgefunc.customGo(-1)
        })
      },
      getStationList: function () {
        this.$Loading.open();
        let url = '/app/json/refuel/getStationList';
        let _this = this;

        this.$http.post(url, {
          lng: _this.longitude,
          lat: _this.latitude,
          token: _this.$store.state.login.token,
          pageIndex: "1"
        }).then(
          res => {
            _this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              _this.stations = data.data;
            } else {
              _this.stations = [];
              Toast({
                message: data.info ? data.info : '获取附近加油站失败',
                position: 'bottom',
                duration: 2000,
              });
            }
          },
          error => {
            _this.$Loading.close();
            _this.stations = [];
            Toast({
              message: '获取附近加油站失败',
              position: 'bottom',
              duration: 2000,
            });
          }
        );

      }
    },
    created() {
      let _this = this;
      this.$bridgefunc.getLocation(function (locationinfo) {
        _this.longitude = locationinfo.longitude
        _this.latitude = locationinfo.latitude;
        _this.getStationList();
      })

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .bottom {
    width 100%
    height 100%
    background-color $color-background-lll
    overflow hidden

    .station-list {
      width 100%
      height 100%
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling: touch

      .cell-station {
        /*margin-left 4%*/
        padding 10px 0px 10px 4%
        background-color #fff
        margin 10px
        border-radius 5px
        display flex
        align-items center

        .logo-div {
          position relative
          float left
          width 40px
          height 40px
        }

        .right-div {
          position relative
          float right
          margin-top 13px;
          margin-right 3%
          width 15px
          height 15px
        }

        .position-img {
          height 12px
          display inline-block
          vertical-align middle
        }

        .position-span {
          display inline-block
          vertical-align middle
        }
        .select_style {
          font-size $font-size-small
          border-radius 20px
          border 1px solid $color-theme-text-l
          color $color-theme-text-l
          padding 3px 15px
          margin-right 10px

        }
      }
    }
  }
</style>
