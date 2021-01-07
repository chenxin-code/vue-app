/**Created by liaoyingchao on 2020-07-16.*/

<template>
  <div class="route-map">
    <div class="back-btn"  @click="backEvent">
      <i class="iconfont mall-fanhui"></i>
    </div>
    <div :id="randomId" class="allmap"></div>
    <div class="bottm-div">
      <div class="row">
        <div class="info">
          <div class="dian dian1"></div>
          <div class="text">当前定位</div>
        </div>
        <div class="line"></div>
        <div class="info">
          <div class="dian dian2"></div>
          <div class="text">取货店铺</div>
        </div>
      </div>
      <div class="row">
        <div class="info">
          <div class="dian dian2"></div>
          <div class="text">取货店铺</div>
        </div>
        <div class="line"></div>
        <div class="info">
          <div class="dian dian3"></div>
          <div class="text">送货地址</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {MP} from '@/utils/map'

  export default {
    name: "route-map",
    components: {},
    data() {
      return {
        randomId: '',
        loadedTimes: 0,
        bdMap: null,
        nowmk: null,
        routeData: {}
      }
    },
    created() {
      this.randomId = this.$util.randomString();
      this.routeData = JSON.parse(this.$route.query.routeData)
    },
    mounted() {
      this.pageInit()
    },
    methods: {
      backEvent: function () {
        this.$router.go(-1)
      },
      loadRoute: function (BMap, nowpoint) {
        let p1 = new BMap.Point(this.routeData.storePosx, this.routeData.storePosy);
        let p2 = new BMap.Point(this.routeData.receiverPosx, this.routeData.receiverPosy);

        var driving = new BMap.DrivingRoute(this.bdMap, {renderOptions:{map: this.bdMap, autoViewport: true}});
        driving.search(nowpoint, p2, {waypoints: [p1]});//waypoints表示途经点
      },
      getLocation: function (BMap, locationinfo) {
        if (!locationinfo.city || locationinfo.city == '') {
          //如果还没有城市要做初始化数据
          locationinfo.province = this.$store.state.globalConfig.province
          locationinfo.city = this.$store.state.globalConfig.city
          locationinfo.district = this.$store.state.globalConfig.district
          locationinfo.longitude = this.$store.state.globalConfig.longitude
          locationinfo.latitude = this.$store.state.globalConfig.latitude
        }
        this.locationinfo = locationinfo
        let nowpoint = new BMap.Point(locationinfo.longitude, locationinfo.latitude);

        // this.bdMap.centerAndZoom(nowpoint, 13);
        this.loadRoute(BMap, nowpoint)
      },
      loadBd: function (BMap) {
        this.bdMap = new BMap.Map(this.randomId);//在百度地图容器中创建一个地图
        this.bdMap.centerAndZoom(new BMap.Point(116.404, 39.915), 14);  // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
        this.bdMap.addControl(new BMap.MapTypeControl({
          mapTypes: [
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
          ]
        }));
        this.bdMap.enableScrollWheelZoom(true)
      },
      pageInit() {
        this.$bridgefunc.checkLocationAuth(this.pageInit).then((locationinfo) => {
          MP().then(BMap => {
            //在此调用api
            this.loadBd(BMap);//加载百度地图
            this.getLocation(BMap, locationinfo); //获取个人位置
          });
        }, () => {
          this.$Toast('请您开启GPS定位附近中国石化加油站')
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .route-map {
    width 100%
    height 100%
    overflow hidden
    display flex;
    flex-direction column;
    position relative;
    .back-btn {
      position absolute;
      left 0;
      top 20px;
      padding 20px;
      z-index 9;
      i {
        font-size 20px;
        color black;
      }
    }
    .allmap {
      width 100%;
      flex 1;
    }
    .bottm-div {
      background-color white;
      padding 15px;
      .row {
        padding 10px 0;
        display flex;
        align-items center;
        justify-content center;
        .info {
          display flex;
          align-items center;
          font-size 14px;
          .dian {
            margin-right 6px;
            width 8px;
            height 8px;
            border-radius 5px;
            overflow hidden;
            &.dian1 {
              background-color #4475F6;
            }
            &.dian2 {
              background-color #ED8732;
            }
            &.dian3 {
              background-color #4AA231;
            }
          }
        }
        .line {
          margin 0 10px;
          height 0.6px;
          width 80px;
          background-color #ddd;
        }
      }
    }
  }
</style>
