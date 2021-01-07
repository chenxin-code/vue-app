/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="esh-nearstation">
    <div class="title-row">
      <div class="title">附近油站</div>
      <div class="more" :class="hotareaClass({idCode: moduleData.idCode + 'more'})" @click="hotEvent('more');$market.customPush({path: '/icbc/nearstation'})">更多</div>
    </div>
    <div class="list" v-if="stations.length > 0">
      <div class="cell" v-for="(item,idx) in stations" @click="$market.customPush({path: '/icbc/preferentialfuel'})" :key="idx">
        <div class="local-detail line_bottom">
          <div class="img-div">
            <img src="static/images/esh-nearstation/logo.png">
          </div>
          <div class="info-div">
            <div class="row">
              <div class="title single-line">{{item.name}}</div>
              <div class="yz-btn" v-if="item.distance < 500">
                <img src="static/images/esh-nearstation/jzjy.png">
                <span>进站加油</span>
              </div>
              <div class="yz-btn" v-else>
                <img class="dhdz" src="static/images/esh-nearstation/dhdz.png">
                <span>导航到站</span>
              </div>
            </div>
            <div class="row1">
              <div class="dw">
                <img src="static/images/esh-nearstation/dw2.png" alt="">
              </div>
              <div class="address double-line">{{item.address}}</div>
              <div class="distance" v-if="item.distance > 1000">
                距您{{$util.toDecimal2(item.distance / 1000)}}km
              </div>
              <div class="distance" v-else>
                距您{{item.distance}}m
              </div>
            </div>
          </div>
        </div>
        <div class="items-div">
          <div class="item">便利店</div>
          <div class="item">油卡充值</div>
          <div class="item">加水</div>
          <div class="item">洗车</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "esh-nearstation",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        stations: []
      }
    },
    computed: {
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
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      getEshNearStation: function () {
        let url = '/app/json/djljy/router?m=getOilStation'
        let paramsData = {
          longitude: this.$store.state.currentLocation.posx,
          latitude: this.$store.state.currentLocation.posy,
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              let d = JSON.parse(data.data)
              this.stations = d.oilStations
              console.log(this.stations)
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      }
    },
    created() {
      this.getEshNearStation()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-nearstation {
    width 100%
    height 100%
    overflow hidden
    .title-row {
      display flex;
      align-items center;
      padding 10px 10px 0;
      .title {
        flex: 1;
        font-size 18px;
        font-weight 600;
      }
      .more {
        font-size 14px;
        background-color #f94b56;
        border-radius 20px;
        padding 6px 15px;
        color white;
      }
    }
    .list {
      .cell {
        margin 10px;
        box-shadow 0 1px 8px #efefef;
        background-color white;
        border-radius 5px;
        padding 0 10px;
        .local-detail {
          display flex;
          align-items flex-start;
          padding 10px 2px;
          .img-div {
            img {
              display block;
              width 50px;
              height 50px;
              border-radius 5px;
              overflow hidden;
            }
          }
          .info-div {
            padding-left 8px;
            flex 1;
            overflow hidden;
            .row {
              display flex;
              align-items center;
              overflow hidden
              .title {
                font-size 16px;
                font-weight 500;
                flex 1;
                overflow hidden
              }
              .yz-btn {
                display flex;
                align-items center;
                padding 5px 0;
                img {
                  height 14px;
                  margin-right 3px;
                }
                span {
                  font-size 12px;
                }
              }
            }
            .row1 {
              display flex;
              align-items flex-start;
              margin-top 8px;
              overflow hidden
              color #999;
              .dw {
                img {
                  display block;
                  height 16px;
                }
              }
              .address {
                flex 1;
                line-height 16px;
                font-size 12px;
                padding-left 3px;
              }
              .distance {
                width 100px;
                text-align right;
                line-height 16px;
                font-size 12px;
              }
            }
          }
        }
        .items-div {
          overflow hidden;
          .item {
            margin 10px 10px 10px 0px;
            float left;
            background-color #F5F5F5;
            padding 4px 8px;
            border-radius 4px;
            border 0.6px solid #ddd;
            font-size 12px;
          }
        }
      }
    }
  }
</style>
