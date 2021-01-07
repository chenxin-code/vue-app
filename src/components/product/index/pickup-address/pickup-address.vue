<template>
  <div class="seconds-kill" :style="$market.getModuleBgStyle(moduleData)">
    <div v-if="moduleData.styleTempl == '1'" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allShops'})" @click="hotEvent('allShops');$market.allShops(moduleData.bsType)">
          <div class="title">
            <img src="static/images/pickup-address/dianpu.png"/>
            <span>{{moduleData.title}}</span>
          </div>
          <div class="text">全部店铺</div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row">
          <div class="item" v-for="(item,idx) in siteList" :key="idx" @click="pushToPickupProducts(item)">
            <img :src="(item.img && item.img != 0) ? item.img : 'static/images/pickup-address/station.png'">
            <div class="info">
              <div class="title">{{item.storeName}}</div>
              <div class="text">地址：{{item.addressFull}}</div>
              <div class="text">距离当前位置：{{Math.round(item.distance)/1000.0}}km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '2'" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allShops'})" @click="hotEvent('allShops');$market.allShops(moduleData.bsType)">
          <div class="title">
            <img src="static/images/pickup-address/dianpu.png"/>
            <span>{{moduleData.title}}</span>
          </div>
          <div class="text">全部店铺</div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row">
          <div class="item" v-for="(item,idx) in siteList" :key="idx" @click="pushToPickupProducts(item)">
            <img :src="(item.storePictureUrl && item.storePictureUrl != '') ? item.storePictureUrl : 'static/images/pickup-address/station.png'">
            <div class="info">
              <div class="title">{{item.storeName}}</div>
              <div class="text">地址：{{item.addressFull}}</div>
              <div class="text">距离当前位置：{{Math.round(item.distance)/1000.0}}km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="moduleData.styleTempl == '3'" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allStation'})" @click="hotEvent('allStation');allStation()">
          <div class="title">
            <img src="static/images/pickup-address/dianpu.png"/>
            <span>{{moduleData.title}}</span>
          </div>
          <div class="text">附近油站</div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row">
          <div class="item" v-for="(item,idx) in siteList" :key="idx" @click="stationDetail(item)">
            <img :src="(item.storePictureUrl && item.storePictureUrl != '') ? item.storePictureUrl : 'static/images/pickup-address/station.png'">
            <div class="info">
              <div class="title">{{item.stationName}}</div>
              <div class="text">地址：{{item.address}}</div>
              <div class="text">距离当前位置：{{Math.round(item.distance)/1000.0}}km</div>
            </div>
            <div class="r-fun" @click.stop="toStation(item)">
              <img class="dh" src="static/image/station/icon2.png" alt="">
              <p class="r-p">导航</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'seconds-kill',
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        siteList: []
      };
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
    created() {
      if (!this.moduleData.showNumbers) {
        this.moduleData.showNumbers = 5
      }
      this.getItems();
      Bus.$on('refreshPickupAddress', ()=> {
        this.getItems();
      })
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      stationDetail: function () {
        this.$market.customPush({
          path: '/oilstationdetail',
          query: {
            startlong: this.$store.state.currentLocation.posx,
            startlat: this.$store.state.currentLocation.posy,
          }
        })
      },
      allStation: function () {
        this.$market.customPush({
          path: '/stationto'
        })
      },
      toStation: function (station) {
        this.$market.baiduNav(
          {
            startlong: this.$store.state.currentLocation.posx,
            startlat: this.$store.state.currentLocation.posy,
            endlong: station.posx,
            endlat: station.posy,
            txlong: station.txPosx,
            txlat: station.txPosy,
            type: "nav"
          }
        );
      },
      pushToPickupProducts: function (item) {
        if (this.moduleData.bsType == 1) {
          this.$market.pushToPickupProducts(item, '6')
        } else {
          this.$market.pushToPickupProducts(item)
        }
      },
      getItems: function() {
        let url = this.$market.apiBaseURL() + '/app/json/user_address/searchSelfliftAddressList';
        if (this.moduleData.bsType == '1') {
          url = this.$market.apiBaseURL() + '/app/json/store/getStoreList';
        }
        if (this.moduleData.styleTempl == '3') {
          url = this.$market.apiBaseURL() + '/app/json/station/getStationMoreInfoList';
        }
        let params1 = {
          //storeName:this.searchStr,
          posx:this.$store.state.currentLocation.posx || 116.373778,
          posy:this.$store.state.currentLocation.posy || 40.104674,
          tags: 'youzhan',
          page: {
            index: 1,
            pageSize: this.moduleData.showNumbers
          },
          //1百度 2腾讯
          getType: '1'
        }

        this.$http.post(url, params1).then(res => {
          let data = res.data;
          if (data.status == 0) {
            this.siteList = data.data
            // if (data.data && data.data.length > 0) {
            //   this.siteList = data.data.splice(0, 5)
            // }
          } else {
          }
        }, error => {
          console.log('自提站点', error);
        });
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .seconds-kill {
    .style1 {
      padding 5px 8px;
      .content {
        border-radius 8px;
        .title-row {
          padding 8px 0px;
          // border-bottom 0.5px solid #ddd;
          display flex;
          align-items center;
          .title {
            font-size 16px;
            font-weight 500;
            flex 1;
            display flex;
            align-items center;
            img {
              width 24px;
              height 24px;
            }
            span {
              padding-left 4px;
            }
          }
          .text {
            font-size 13px;
            color #666;
          }
          .arrow {
            margin-left 5px;
            height 12px;
          }
        }
        .items-row {
          padding-bottom 8px;
          .item {
            font-size 0px;
            box-shadow 0 1px 8px #efefef;
            border-radius 5px;
            display flex;
            align-items center;
            background-color white;
            padding 8px;
            margin-top 10px;
            img {
              width 60px;
              height 60px;
            }
            .info {
              flex 1;
              padding-left 10px;
              .title {
                line-height 18px;
                font-size 14px;
                color #1a1a1a
              }
              .text {
                line-height 16px;
                font-size 12px;
                color #666;
              }
            }
            .r-fun {
              text-align center;
              padding 8px;
              .dh {
                width 26px;
                height 26px;
              }
              .r-p {
                font-size 12px;
              }
            }
            /*.text {
              margin-top 8px;
              font-size 13px;
              color #333;
            }
            .count {
              position absolute;
              right 20px;
              margin-right -10px;
              top -5px;
              z-index 1;
              padding 2px 5px;
              border-radius 10px;
              font-size 12px;
            }*/
          }
          .item:nth-child(1) {
            margin-top 0px;
          }
        }
      }
    }
  }
</style>

