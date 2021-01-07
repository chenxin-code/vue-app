<template>
  <div class="oil-station-detail">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content>
      <div class="scroll-content">

        <div class="header">
          <img class="full-img" :src="default_gas_station2">
        </div>
        <div class="cells">
          <div class="cell-content">
            <div class="cell cell-start">
              <div class="cell__hd ">
                <img class="logoimg" :src="cellLogo">
              </div>
              <div class="cell__bd column">
                <p class="name"> {{detail.stationName}} </p>
                <p class="foserviceurlnt-medium-l">{{(Number(detail.distance)/1000).toFixed(2)}} km</p>
                <div>
                  <div class="serviceurl" v-for="imgUrl in  detail.serviceUrls">
                    <img class="imgrect" :src="imgUrl" alt="">
                  </div>
                </div>
              </div>

              <div class="cell_right">
                <div class="r-fun" @click="goShopping" v-if="detail.pickUpOuCode">
                  <div class="r-img">
                    <img class="dh" src="static/image/station/station-shopping.png" alt="">
                  </div>
                  <p class="r-p">购物</p>
                </div>
                <div class="r-fun" @click="gotoStation">
                  <div class="r-img">
                    <img class="dh" src="static/image/station/station-navigation.png" alt="">
                  </div>
                  <p class="r-p">导航</p>
                </div>
              </div>
            </div>

            <!--<div class="cell-box__btn">-->
            <!--<div class="cell__btn"  @click="addGas">-->
            <!--<img src="@/assets/refuel/jiayou-icon5.png">-->
            <!--<span class="text">加油</span>-->
            <!--</div>-->
            <!--<div class="cell__btn" @click="gotoStation">-->
            <!--<img src="@/assets/refuel/jiayou-icon6.png">-->
            <!--<span class="text">到这里</span>-->
            <!--</div>-->
            <!--</div>-->
          </div>

        </div>

        <div class="cells">
          <div class="cell correct-wrapper">
            <div class="cell__bd pdl0 font-medium">
              <img src="@/assets/refuel/location.png">
              <span class="text">{{detail.address}}</span>
            </div>
            <div class="correct">
              <router-link to="/oilstationcorrect">
                <img src="./image/correct.png" alt="">
                <!--              <span class="text">纠偏</span>-->
              </router-link>
            </div>
          </div>
          <div class="cell cell-line">
            <div class="cell__bd pdl0 font-medium">
              <img src="@/assets/refuel/phone.png">
              <span class="text"><a :href="getCallPhone(detail.phone)" class="phone">{{detail.phone}}</a></span>
            </div>
          </div>
          <div class="cell">
            <div class="cell__bd pdl0 font-medium">
              营业时间:
              <span class="text">{{detail.opningTime}}-{{detail.closingTime}}</span>
            </div>
          </div>
        </div>

        <div class="cells"
             v-if="detail.mktActivityList.length !== 0 && $store.state.globalConfig.stationMktActDisabled != 1">
          <h2 class="card-title">油站促销</h2>
          <ul class="promotion-list">
            <transition
              name="slide-fade"
              v-for="(item, index) in detail.mktActivityList"
              :key="index"
              v-if="index > 2 ? isMore : true">
              <li
                class="pro-item clearfix"
                @click="activityClick(item)">
                <i class="pro-icon">促</i>
                <span class="pro-content">{{ item.activityTitle }}</span>
                <i v-if="item.pcRuleCategoryId == 6" class="pro-arrow-right">&gt;</i>
              </li>
            </transition>
          </ul>
          <div
            class="promotion-more-btn"
            :class="{ 'promotion-open' : isMore }"
            @click="isMore = !isMore"
            v-if="detail.mktActivityList.length > 3"></div>
        </div>

        <div class="cells" v-if="detail.selfOilStrs.length !== 0">
          <h2 class="card-title">在售油品</h2>
          <ul class="oil-pro-list">
            <li
              class="oil-item"
              v-for="(item, index) in detail.selfOilStrs"
              :key="index">
              <img src="static/image/station/oil-icon.png" alt="" class="oil-icon">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="cells" v-if="stationRounds && stationRounds.length">
          <div class="cell cell-between" :class="{'cell-line' : idx > 0}" v-for="(item,idx) in stationRounds"
               v-if="getRoundContent(item.content)">
            <div class=" font-medium">
              {{item.title}}
            </div>
            <div class=" font-medium-l">
              {{getRoundContent(item.content)}}
            </div>
          </div>
        </div>

        <!--<div class="cells">-->
        <!--<div class="cell ">-->
        <!--<div class="cell__bd font-medium">-->
        <!--今日油价-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="cell cell-line" v-for="item in detail.oilModels">-->
        <!--<div class="cell__bd font-medium-l" >-->
        <!--{{item.oilName}}-->
        <!--</div>-->
        <!--<div class="cell__bd font-medium-l" >-->
        <!--<span class="price">￥{{item.oilPrice}}/升</span>-->
        <!--</div>-->
        <!--</div>-->

        <!--</div>-->
      </div>
    </nav-content>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        detail: '',
        isMore: false,
        default_gas_station2: 'static/image/refuel/default-GasStation2.png',
        cellLogo: require('@/assets/refuel/logo.png'),
      };
    },
    computed: {
      stationRounds: function () {
        let arr = [];
        for (let i = 0; i < this.detail.stationRounds.length; i++) {
          let item = this.detail.stationRounds[i];
          if (item.content && item.content.length) {
            arr.push(item);
          }
        }
        return arr;
      }
    },
    methods: {
      // 顶部返回
      backEvent: function () {
        this.$router.go(-1);
      },
      // 油站电话
      getCallPhone: function (phone) {
        return 'tel:' + phone;
      },
      // 导航
      gotoStation: function () {
        this.$bridgefunc.baiduNav(
          {
            startlong: this.$route.query.startlong,
            startlat: this.$route.query.startlat,
            endlong: this.detail.posx,
            endlat: this.detail.posy,
            type: "nav"
          }
        )
      },
      getRoundContent: function (content) {
        let con = ''
        if (content && content != 0) {
          con = content
          if (content == 1) {
            con = '有'
          }
        }
        return con
      },
      // 去购物
      goShopping() {
        let item = this.detail.storeModel
        this.$market.pushToPickupProducts(item);

        // this.$store.state.mall2.zitiAddress = item
        //
        // this.$market._addToMyPickupAddress(item.id)
        // this.$market._setDefaultPickupAddress(item.id)
        //
        // this.$store.state.mall2.staticDeliverType = 1
        // let path = '/mall2/list/' + this.$util.getDataString()
        // this.$router.push({
        //   path: path,
        //   query: {
        //     lastPath: this.$route.path,
        //   }
        // })
      },

      // 活动跳转
      activityClick(item) {
        if (item.pcRuleCategoryId == 6) { // 促销活动-可跳转
          this.$store.state.mall2.zitiAddress = this.detail.storeModel
          this.$market._addToMyPickupAddress(this.detail.storeModel.id)
          this.$market._setDefaultPickupAddress(this.detail.storeModel.id)
          this.$store.state.mall2.staticDeliverType = 1

          this.activityProducts(item)
        }
      },
      // 跳转活动方法
      activityProducts: function (activity) {
        this.showActivity = false
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            pageType: 'activity',
            activity: activity.id,
            delivertype: this.$store.state.mall2.staticDeliverType,
            skuId: '',
            storeOuCode: this.detail.storeModel.storeCode,
            lastPath: this.$route.path,
          }
        })
      },
      getImgUrl: function (url) {
        var fdStart = url.indexOf("http");
        if (fdStart == 0) {
          return fdStart;
        } else {
          return 'http://' + url
        }
      },
      addGas: function (station) {
        this.$bridgefunc.customPush({
          path: 'RefuelSelectOilGun',
          isnativetop: '1',
          query: {
            station: encodeURIComponent(this.$route.query.detail),
          },
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
    created() {
      if (this.$store.state.refuelStationDetail) {
        // this.detail = {"id":10,"stationCode":"1000612001002010001","stationName":"二七路站","posx":"115.92531500","posy":"28.69502400","phone":"0791-88652510","provinceName":"","cityCompName":"","address":"二七北路254号","introdection":"","distance":"1771.1","standardCode":"33000432","txPosx":"","txPosy":"","rows":"","page":"","getType":"","opningTime":"00:00:00","closingTime":"23:59:00","parentOuCode":"1000612001002010","mktActivityList":"","selfOilStrs":["压缩天然气(CNG)", "LNG液化天然气", "0号普通柴油", "0号车用柴油(Ⅴ)", "92号汽油(Ⅴ)"],"pickUpOuCode":"1000612001002010002","pickUpOuName":"二七路站易捷便利店","water":"1","cleaning":"0","toilet":"1","maintain":"1","food":"0","hotWater":"1","selfService":"1","recharge":"1","cvs":"","state":"1","cardService":"1","serviceImageUrl":["1","0","1","1","0","1","1","1","1","1"],"weighBridge":"","bacco":"","drinks":"","scenic":"人民公园","catering":"柴米油盐","hotel":"阳光假日酒店","bank":"建设银行","selfOil":"60514943,60518722,60206060","stationRounds":[{"title":"周围景区","content":"人民公园"},{"title":"周边餐饮","content":"阳光假日酒店"},{"title":"周边酒店","content":"建设银行"},{"title":"地磅","content":""},{"title":"烟草售卖","content":""},{"title":"酒水售卖","content":""}],"oilModels":[]}
        this.detail = this.$store.state.refuelStationDetail
      }
      try {
        if (!this.detail.stationImg) throw 'error'
        this.default_gas_station2 = eval(decodeURIComponent(this.detail.stationImg))[0];
      } catch (e) {
        if (this.$store.state.globalConfig.default_gas_station2 && this.$store.state.globalConfig.default_gas_station2.length) {
          this.default_gas_station2 = this.$store.state.globalConfig.default_gas_station2;
        }
      }

      if (this.$store.state.globalConfig.logo && this.$store.state.globalConfig.logo.length) {
        this.cellLogo = this.$store.state.globalConfig.logo;
      }
      console.log(this.detail)
    },
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  $main-color = #ff9100;
  $page-bgc = #f0f0f0;
  $color-white = #fff;
  .clearfix:after {
    content ''
    display block
    clear both
    visibility hidden
    height 0
    font-size 0
  }

  .oil-station-detail {
    position: relative;
    overflow: hidden;
    width 100%
    height: 100%;
    background-color: white;
  }

  .scroll-content {
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    overflow auto
    -webkit-overflow-scrolling: touch;
  }

  .header {
    propor-padding: 46.296296;
    //background: url('../../assets/refuel/default-GasStation') no-repeat center center / 100% 100%;
  }

  .correct-wrapper {
    justify-content space-between

    .correct {
      flex-shrink 0;
      display flex
      flex-direction column
      align-items center

      img {
        width 24px;
      }

      .text {
        display inline-block
        padding-top: 6px;
      }
    }
  }

  .cells {
    margin: 10px;
    border-radius 5px
    box-shadow 0 1px 5px #efefef;

    .cell-content {
      /*padding 10px*/
    }

    .cell {
      flex-wrap: wrap;
      padding: 10px;
      background-color: $color-white;
    }

    .cell-between {
      justify-content space-between
    }

    .cell-start {
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

    .price {
      width: 100%;
      text-align: right;
      padding-right: 10px;
    }

    .cell_right {
      display flex
      align-items center

      .r-fun {
        text-align center

        & + .r-fun {
          margin-left 10px
        }

        .r-img {
          width 22px
          height 22px
          display inline-block

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
      }
    }

    .cell__bd {
      display: flex;
      align-items: center;
      padding-left: 10px;

      .text {
        padding-left: 5px;

        .phone {
          color darkgreen
        }
      }

      /*justify-content space-between*/

      .name {
        font-size: 16px;
        color: $color-background-b;
        margin-bottom: 5px;
      }

      img {
        width: 15px;
        height: 15px;
        vertical-align: middle;
        align-items: center;
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
    }

    .pdl0 {
      padding-left 0px
      flex none
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
        border: 1px solid $color-background-ll;
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

  .column {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .card-title {
    font-size 16px
    padding 16px 0
    margin 0 8px
    border-bottom .5px solid #ddd
  }

  .promotion-list {
    padding 0 8px 10px 8px

    .pro-item {
      padding-top 14px
      font-size 14px

      .pro-icon {
        display block
        float left
        width 20px
        height 20px
        margin-right -20px
        color #F0888B
        font-style normal
        text-align center
        line-height 20px
        border 1px solid #F0888B
      }

      .pro-content {
        display block
        float left
        width 100%
        height 20px
        line-height 20px
        padding-left 30px
        padding-right 30px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      }

      .pro-arrow-right {
        display block
        float right
        height 20px
        width 20px
        text-align center
        margin-left -20px
        color #ccc
        line-height 20px
      }
    }
  }

  .promotion-more-btn {
    height 20px
    width 26px
    transition all .2s
    background url('../../../../static/image/station/down-arrow.png') no-repeat center
    background-size 60% 60%
    margin 0 auto
  }

  .promotion-open {
    transform rotate(180deg)
  }

  .oil-pro-list {
    display flex
    flex-wrap wrap

    .oil-item {
      margin 12px 0
      padding 0 10px
      width 50%
      height 20px
      line-height 20px
      font-size 14px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

      .oil-icon {
        display block
        width 20px
        height 20px
        float left
        margin-right 4px
      }
    }
  }

  // .slide-fade-enter-active {
  //   transition all .3s
  // }
  // .slide-fade-leave-active {
  //   transition all .3s ease
  // }
  // .slide-fade-enter,
  // .slide-fade-leave-to {
  //   opacity 0
  // }
</style>
