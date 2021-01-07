/**Created by liaoyingchao on 2018/12/26.*/

<template>
  <div class="near-station mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="shadow-cell theme_bg_white" v-for="(item, idx) in stations" @click="selectedStation(item)">
          <div class="site-cell">
            <div class="left-info">
              <div class="site-title margin-con theme_font_black">
                <span>{{item.stationName}}</span>
                <span class="nearest theme_bg_red " v-if="idx==0">最近</span>
              </div>
              <div class="tip margin-con theme_font_gray">地址：{{item.address}}</div>
              <div class="tip theme_font_gray">电话：{{item.phone}}</div>
            </div>
            <div class="right-con">
              <div class="distence-con">{{$util.toDecimal2(item.distance/1000)}}km</div>
              <i  class="iconfont " :class="item.id == $store.state.refuelStation.id?'mall-xuanzhong theme_font_red':'mall-weixuanzhong theme_font_gray'"></i>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "near-station",
    components: {},
    data() {
      return {
        stations: []
      }
    },
    methods: {
      selectedStation: function (item) {
        this.$store.state.refuelStation = item;
        this.$router.go(-1)
      },
      // 获取附件加油站
      getNearStations: function (nowpoint) {
        this.$Loading.open()
        let url = '/app/json/station/getStationList';
        let params1 = {
          posx: '104.08194200',
          posy: '30.64504100',
          page: 1,
          rows:10,
          token: this.$store.state.login.token,
          //1百度 2腾讯
          getType: '1'
        }
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.stations = data.data
            // _this.addNewLocations()
          } else {
            Toast({
              message: data.info,
              position: 'bottom',
              duration: 2000,
            });
          }
        }, error => {
          _this.$Loading.close();
        })
      },
    },
    created() {
      this.getNearStations()
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .near-station {
    width 100%
    height 100%
    overflow hidden
    .scroll-div {
      width 100%;
      height 100%;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      .site-cell {
        display flex
        align-items center
        .left-info {
          flex 1
          padding 12px 8px
          .tip {
            font-size $font-size-medium-s
          }
          .site-title {
            font-size $font-size-medium-x
            .nearest {
              color white
              margin-left: 10px;
              border-radius: 10px;
              -webkit-border-radius: 10px;
              padding 0px 7px
              font-size $font-size-medium
            }
          }
        }
        .right-con {
          padding 0 4px
          text-align center
          .distence-con {
            font-size $font-size-medium-s
            margin-bottom 8px
          }
          i{
            font-size $font-size-large
          }
          //.image-con {
          //margin-top 16px
          // width 40px
          //height 40px
          //}
        }
      }
      .margin-con {
        margin-bottom 12px
      }
    }
  }
</style>
