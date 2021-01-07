/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="nearstation">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div class="top-div line_bottom">
          <van-search v-model="searchKey" placeholder="请输入油站名称" />
        </div>
        <div class="list">
          <div class="cell" v-for="(item, idx) in stations" @click="toDetail(item)">
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
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "nearstation",
    components: {},
    data() {
      return {
        searchKey: '',
        stations: []
      }
    },
    methods: {
      toDetail: function (item) {
        this.$router.push({
          path: '/icbc/stationdetail',
          query: {
            station: JSON.stringify(item)
          }
        })
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
      },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.getEshNearStation()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .nearstation {
    width 100%
    height 100%
    overflow hidden
    .content {
      background-color #efefef;
      height 100%;
      overflow hidden

      .top-div {

      }

      .list {
        height calc(100% - 54px)
        overflow-y auto
        -webkit-overflow-scrolling touch
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
                .title {
                  font-size 16px;
                  font-weight 500;
                  flex 1;
                }
                .yz-btn {
                  display flex;
                  align-items center;
                  padding 5px 0;
                  img {
                    height 16px;
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
  }
</style>
