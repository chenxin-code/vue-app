/**Created by liaoyingchao on 2020-09-01.*/

<template>
  <div class="hy-station" :style="getModuleBg()">
    <div class="content" :style="getSidesStyle()">
      <img class="local-img" src="static/images/hy-top/position-icon.png"/>
      <div :class="hotareaClass({idCode: moduleData.idCode})" class="station-name" @click="hotEvent();selectStation()">{{ stationName }}</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "hy-station",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    mixins: [hee],
    data() {
      return {
        stationName: ''
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getModuleBg: function () {
        let styleStr = '';
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }

        return styleStr
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }
        return styleStr
      },
      selectStation: function () {
        this.$market.selectStation();
      },
      // 获取附件加油站
      getNearStations(nowpoint) {
        this.$Loading.open()
        let params = {
          token: window.localStorage.getItem("token"),
          posx: nowpoint ? nowpoint.longitude : undefined,
          posy: nowpoint ? nowpoint.latitude : undefined,
          isShowCommon: 1,
          getType: 2,
          count: 5
        }
        let _this = this
        this.$http.post('/app/json/hy_station/getStationList', params).then(
          res => {
            _this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.$store.state.refuelStation = data.data[0]
              this.stationName = data.data[0].stationName
            } else {
              _this.$Toast({
                message: data.info,
                position: "bottom",
                duration: 2000
              })
            }
          },
          error => {
            _this.$Loading.close()
          }
        );
      },
    },
    activated() {
      if (this.stationName != this.$store.state.refuelStation.stationName) {
        this.stationName = this.$store.state.refuelStation.stationName
        // 刷新页面
        this.$emit('componentEvent', {code: 'refreshPage'})
      }
    },
    created() {
      if (!this.$store.state.refuelStation || !this.$store.state.refuelStation.stationName) {
        if (this.$store.state.currentLocation.posx) {
          this.getNearStations({
            longitude: this.$store.state.currentLocation.posx,
            latitude: this.$store.state.currentLocation.posy,
          })
        } else {
          this.getNearStations(null)
        }
      } else {
        if (this.$store.state.webtype == -1) {
          this.stationName = '示例加油站'
        } else {
          this.stationName = this.$store.state.refuelStation.stationName
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .hy-station {
    width 100%
    height 100%
    overflow hidden
    .content {
      display flex;
      align-items center;
      padding 0 15px
      .local-img {
        width 16px;
      }
      .station-name {
        font-size 15px;
        margin -10px;
        padding 10px;
        padding-left 15px
        ellipse()
      }
      .btn {
        background-color #07559A;
        padding 6px 12px;
        border-radius 20px;
        color white;
      }
    }
  }
</style>
