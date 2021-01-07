/**Created by liaoyingchao on 2018/12/26.*/

<template>
  <div class="near-station mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div
          class="shadow-cell theme_bg_white"
          v-for="(item, idx) in stations"
          :key="idx"
          @click="selectedStation(item)"
        >
          <div class="site-cell">
            <div class="left-info">
              <div class="site-title margin-con theme_font_black">
                <span>{{ item.stationName }}</span>
                <span class="nearest theme_bg_red" v-if="idx == 0">最近</span>
                <span class="nearest theme_bg_red" v-if="item.isShowCommon == 1">常用</span>
              </div>
              <div class="tip margin-con theme_font_gray">地址：{{ item.address || '暂无' }}</div>
              <!-- <div class="tip theme_font_gray">电话：{{ item.phone || '暂无' }}</div> -->
            </div>
            <div class="right-con">
              <div class="distence-con" v-if="item.distance">{{$util.toDecimal2(item.distance/1000)}}km</div>
              <i
                class="iconfont"
                :class="item.stationCode == $store.state.refuelStation.stationCode?'mall-xuanzhong theme_font_red':'mall-weixuanzhong theme_font_gray'"
              ></i>
            </div>
          </div>
        </div>
        <div class="eruda-s" @click="showEruda"></div>
      </div>
    </nav-content>
  </div>
</template>

<script>
import wxfunc from "@/utils/wxfunc";
// import Eruda from 'eruda'

export default {
  name: "near",
  components: {},
  data() {
    return {
      stations: [],
      token: null,
      erudaTimes: 0,
      clickTime: -1
    };
  },
  methods: {
    showEruda() {
      //连续点5次第一个item  显示eruda
      let time = (new Date()).getTime();
      if (time - this.clickTime < 1000 || this.clickTime == -1) {
        this.erudaTimes += 1;
        this.clickTime = time;
        if (this.erudaTimes == 5) {
          eruda.init()
          this.erudaTimes = 0;
          this.clickTime = -1;
        }
      } else {
        this.erudaTimes = 0;
        this.clickTime = -1;
      }
    },
    selectedStation(item) {
      this.getStoreInfo(item.standardCode)
      this.$store.commit("setStationInfo", item);
    },
    getStoreInfo(standardCode) {
      this.$STLoading.open()
      this.$http.post('/app/json/hy_station/getStoreInfo', {
        standardCode
      }).then(res => {
        let data = res.data;
        this.$STLoading.close()
        if (data.status == 0) {
          this.$store.state.mall2.zitiAddress.id = data.data.storeId;
          this.$store.state.mall2.zitiAddress.storeCode = data.data.storeCode;
          this.$store.state.mall2.zitiAddress.storeName = data.data.storeName || this.$store.state.refuelStation.stationName;
          this.$store.state.mall2.zitiAddress.mchOuCode = data.data.merchantOuCode;
          if (this.$store.state.mall2.zitiAddress.id && !this.$store.state.mall2.zitiAddress.mchOuCode) {
            this.$store.state.staticDeliverType = '1'
          } else if (this.$store.state.mall2.zitiAddress.mchOuCode && !this.$store.state.mall2.zitiAddress.id) {
            this.$store.state.staticDeliverType = '2'
          }
          this.$router.go(-1);
        } else {
          this.$Toast(data.info);  
        }
      }).catch(err => {
        this.$Toast(`getStoreInfo err ${err}`);
        this.$STLoading.close()
      })
    },
    // 获取附件加油站
    getNearStations(nowpoint, callback) {
      this.$Loading.open();
      let params = {
        token: window.localStorage.getItem("token"),
        posx: nowpoint ? nowpoint.longitude : undefined,
        posy: nowpoint ? nowpoint.latitude : undefined,
        isShowCommon: 1,
        getType: 2,
        count: 5
      };
      let _this = this;
      this.$http.post('/app/json/hy_station/getStationList', params).then(
        res => {
          _this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            _this.stations = data.data;
            callback && callback();
          } else {
            _this.$Toast({
              message: data.info,
              position: "bottom",
              duration: 2000
            });
          }
        },
        error => {
          _this.$Loading.close();
        }
      );
    },
  },
  mounted() {
    if (this.$store.state.currentLocation.posx) {
      this.getNearStations({
        longitude: this.$store.state.currentLocation.posx,
        latitude: this.$store.state.currentLocation.posy,
      })
    } else {
      this.getNearStations(null)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.eruda-s {
  width 100%;
  height 15px;
}
.near-station {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .scroll-div {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .site-cell {
      display: flex;
      align-items: center;

      .left-info {
        flex: 1;
        padding: 12px 8px;

        .tip {
          font-size: $font-size-medium-s;
          margin-top 10px;
        }

        .site-title {
          font-size: $font-size-medium-x;
          display: flex;
          align-items: end;

          .nearest {
            color: white;
            margin-left: 10px;
            border-radius: 10px;
            padding: 0px 7px;
            font-size: $font-size-small;
            height: 15px;
            line-height: 15px;
            min-width: 40px;
          }
        }
      }

      .right-con {
        padding: 0 4px;
        text-align: center;

        .distence-con {
          font-size: $font-size-medium-s;
          margin-bottom: 8px;
        }

        i {
          font-size: $font-size-large;
        }
      }
    }

    .margin-con {
      .theme_bg_red {
        line-height: 1;
      }
    }
  }
}
</style>
