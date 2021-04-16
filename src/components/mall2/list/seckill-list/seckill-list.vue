<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" title="秒杀" :bg-img="bgImg"></nav-top>
    <nav-content>
      <div class="seckill-container" v-if="secKillList.length">
        <ul class="seckill-menu">
          <li class="seckill-menu-item" :class="{active: item.id === activityId}"
              v-for="(item, index) in secKillList" :key="index" @click="chooseSeckillHandler(item)">
            <p class="time">{{timeToTitle(item.startDate)}}</p>
            <p class="status">{{item.status ? '抢购中' : '未开始'}}</p>
          </li>
        </ul>
        <div class="count-down-container">
          <p class="tip">{{globalStatus ? '抢购中，先下单先得哦' : '即将开始，先下单先得哦'}}</p>
          <div class="count-down">
            <span class="theme_font_tint text">{{globalStatus ? '距结束' : '距开始'}}</span>
            <countdown class="count-down-con" :endTime="(new Date(countDownEndTime)).getTime()/1000"
                       type="theme_bg_black"></countdown>
          </div>
        </div>
        <!--        暂时去掉此功能-->
        <!--        <div class="row">-->
        <!--          <div class="type-btn line_circle"-->
        <!--               :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"-->
        <!--               @click="selectedTypeEvent(item.tag)" v-for="item in deliveryTypes">-->
        <!--            <i class="iconfont theme_font_common icon-size"-->
        <!--               :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"></i>-->
        <!--            <span class="theme_font_common"-->
        <!--                  :class="{theme_standard_font_i: selectedType == item.tag}">{{item.text}}</span>-->
        <!--          </div>-->
        <!--          <div class="space"></div>-->
        <!--          <div class="local-div" @click="selectAddressClick()">-->
        <!--            <span class="theme_font_gray single-line" v-if="selectedType == 2">{{$store.state.mall2.selectAddress.addressFull
        }}</span>-->
        <!--            <span class="theme_font_gray single-line" v-if="selectedType == 1">{{$store.state.mall2.zitiAddress.storeName
        }}</span>-->
        <!--            <i class="iconfont mall-dingwei icon-size theme_font_gray"></i>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="seckill-content">
          <ul class="seckill-list"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              :infinite-scroll-immediate-check="true"
              infinite-scroll-distance="20"
          >
            <li class="seckill-item" v-for="(item, index) in proList" :key="index" @click="productEvent(item)">
              <img class="seckill-object" :src="item.phMainUrl" alt="">
              <div class="seckill-body">
                <div v-if="$store.state.globalConfig.isCustomizedSeckillList != 1">
                  <p class="pro-name theme_font_black double-line">{{item.showTitle}}</p>
                </div>
                <div v-else>
                  <p class="pro-name theme_font_black double-line font-size">{{item.showTitle}}</p>
                </div>
                <div class="price-info">
                  <div class="price">
                    <span class="price-x theme_font_red">￥</span>
                    <span class="left-no-space price-z theme_font_red">{{item.dpedData.integer}}</span>
                    <span class="left-no-space price-x theme_font_red">.{{item.dpedData.decimals}}</span>
                  </div>
                  <div class="btn1" v-if="item.status != 0 && $store.state.globalConfig.isCustomizedSeckillList != 1"
                       :class="{disabled: (item.soldNum >= 100 || item.activityId == null)}">{{(item.soldNum >= 100 ||
                    item.activityId == null) ? '已售完' : globalStatus ? '立即抢购' : '即将开始'}}
                  </div>
                  <div class="btn" v-else-if="item.status != 0 && $store.state.globalConfig.isCustomizedSeckillList == 1"
                       :class="{disabled: (item.soldNum >= 100 || item.activityId == null)}">
                    <div class="btn-content">
                      {{(item.soldNum >= 100 || item.activityId == null) ? '已售完' : globalStatus ? '立即抢购' : '即将开始'}}
                    </div>
                    <div class="btn-progress">
                      <div class="pro">
                        <van-progress pivot-text="" track-color="rgba(255,255,255,0.5)" color="#FFFFFF"
                                      :percentage="item.soldNum?item.soldNum:0"/>
                      </div>
                      <div class="pro-tip">
                        {{item.soldNum || 0}}%
                      </div>
                    </div>
                  </div>
                  <div class="sold-out" v-else="">
                    <img class="img" src="../../../../assets/sold_out.png" alt="">
                  </div>
                </div>
                <div class="discount-price theme_font_tint">
                  <span class="price" v-if="item.linePrice">￥{{item.linePrice}}</span>
                  <!--item.status0未上架   1上架  2淘汰  3预淘汰-->
                  <div v-if="$store.state.globalConfig.isCustomizedSeckillList != 1">
                    <template v-if="item.status !=0">
                      <div class="progress-wrapper" v-if="item.soldNum >= 100 || item.activityId == null">
                        <span class="num">已售完{{item.distCnt}}件</span>
                      </div>
                      <div class="progress-wrapper" v-else>
                        <!--<span class="num">已售{{item.soldNum || 0}}%</span>-->
                        <span class="num">已售{{item.distCnt || 0}} / {{item.discountGoodsCnt || 0}}</span>
                        <span class="progress">
                      <mt-progress :value="item.soldNum || 0" :bar-height="8"></mt-progress>
                    </span>
                      </div>
                    </template>
                  </div>
                  <!--                  <template v-if="item.status !=0">-->
                  <!--                    <div class="progress-wrapper" v-if="item.soldNum >= 100 || item.activityId == null">-->
                  <!--&lt;!&ndash;                      <span class="num">已售完{{item.distCnt}}件</span>&ndash;&gt;-->
                  <!--                    </div>-->
                  <!--                    <div class="progress-wrapper" v-else="">-->
                  <!--                      &lt;!&ndash;<span class="num">已售{{item.soldNum || 0}}%</span>&ndash;&gt;-->
                  <!--&lt;!&ndash;                      <span class="num">已售{{item.distCnt || 0}} / {{item.discountGoodsCnt || 0
                  }}</span>&ndash;&gt;-->
                  <!--                      <span class="progress">-->
                  <!--                      <mt-progress :value="item.soldNum || 0" :bar-height="8"></mt-progress>-->
                  <!--                    </span>-->
                  <!--                    </div>-->
                  <!--                  </template>-->
                  <div v-if="$store.state.globalConfig.isCustomizedSeckillList == 1" class="theme_font_tint">
                    <span>每人限购{{item.discountGoodsCntPerUser}}</span>
                  </div>
                </div>
                <div v-if="$store.state.globalConfig.isCustomizedSeckillList != 1" class="discountGoodsCntPerUser theme_font_tint">
                  <span>每人限购{{item.discountGoodsCntPerUser}}</span>
                </div>
              </div>
            </li>
            <li class="no-data theme_font_tint" v-show="!hasMore">没有更多商品了~</li>
          </ul>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Countdown from "@/components/Vendor/countdown/countdown";

  export default {
    name: '',
    data() {
      return {
        secKillList: [],
        proList: [],
        countDownEndTime: 0,
        page: 0,
        rows: 12,
        hasMore: true,
        activityId: -1, // 秒杀id
        globalStatus: true,
        loading: false,
        onlyDeliveryType: '0',
        selectedType: 2,
        deliveryTypes: [{
          text: '配送',
          fontclass: 'mall-peisong',
          tag: '2'
        }, {
          text: '自提',
          fontclass: 'mall-ziti',
          tag: '1'
        }],
        pageInit: false
      }
    },
    mounted() {
      this.onlyDeliveryType = this.$route.query.onlyDeliveryType ? this.$route.query.onlyDeliveryType : '0'
      this.getAppProSecKillList()
    },
    methods: {
      selectedTypeEvent: function (tag) {
        this.$store.state.mall2.staticDeliverType = tag
        this.$bridgefunc.vuexStorage()
        this.selectedType = tag;
        if (tag == 1 && (this.$store.state.mall2.zitiAddress.id == '')) {
          this.backRefresh = true
          this.$router.push({
            path: '/mall2/mypickupaddress'
          })
        } else {
          this.hasMore = true
          this.page = 0
          this.proList = []
          this.getAppProSecKillList()
          // this.deductionCart();
        }
      },
      selectAddressClick: function () {//选择地址

        let path = ''
        if (this.selectedType == 2) {
          if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
            this.backRefresh = true;
          }
          path = '/mall2/addresslist';
        } else {
          if (this.$store.state.globalConfig.app_home_special_flag == 'cnooc') {
            return;
          }
          path = '/mall2/mypickupaddress';
          this.backRefresh = true;
        }
        if (this.$userCenter.checkLogined({path: path}, 0) == false) {
          return;
        }
        this.$router.push({
          path: path,
          query: {
            productType: this.productType || ''
          }
        })
      },
      timeToTitle: function (startDate) {
        if (this.$store.state.globalConfig.seckill_title_type == 'date') {
          return this.dateFilter(startDate)
        } else {
          return this.hourFilter(startDate)
        }
      },
      productEvent: function (product) {
        if (this.onlyDeliveryType == '1' || this.onlyDeliveryType == '2') {
          this.$store.state.mall2.staticDeliverType = this.onlyDeliveryType
        } else if (product.orginDeliveryType == '1' || product.orginDeliveryType == '2') {
          this.$store.state.mall2.staticDeliverType = product.orginDeliveryType
        } else {
          // if (product.orginDeliveryType && product.orginDeliveryType != '' && product.orginDeliveryType != '12' && product.orginDeliveryType != this.$store.state.mall2.staticDeliverType) {
          //   this.$store.state.mall2.staticDeliverType = product.orginDeliveryType
          // }
        }

        let path = '/mall2/detail/' + this.$util.getDataString()
        if (product.productType == 2) {
          path = '/mall2/ticketdetail';
        }
        let pushData
        if (product.productType > 500 && product.productType < 512) {
          // 都是欧菲
          path = '/video-recharge'
          pushData = {
            path: path,
            query: {
              activityId: this.activityId,
              spuId: product.spuId,
              spuName: product.spuName,
              spuImage: product.phMainUrl,
            }
          }
        } else {
          pushData = {
            path: path,
            query: {
              id: product.id,
              skuId: product.skuId,
              deliveryType: product.deliverType,
              productType: product.productType,
              isSecondsKill: 1,
              activityId: this.activityId
            }
          }
        }
        this.$router.push(pushData)
      },
      getAppProSecKillList() {
        let paramsData = {
          token: this.$store.state.login.token,
        }
        paramsData.deliverType = this.selectedType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        }
        this.$http.post('/app/json/product/getAppProSecKillList', paramsData).then(res => {
          let data = res.data;
          if (data.status == 0) {
            // 秒杀列表
            let secKillList = data.data.mktActivityList || []
            secKillList.map(item => {
              item.status = data.currentTime > item.startDate
              return item
            })
            if (secKillList[0]) {
              let startDate = secKillList[0].startDate
              let endDate = secKillList[0].endDate
              if (secKillList[0].status) {
                this.countDownEndTime = endDate && endDate.replace(/-/g, '/')
              } else {
                this.countDownEndTime = startDate && startDate.replace(/-/g, '/')
              }
              this.activityId = secKillList[0].id
              this.globalStatus = secKillList[0].status
            }
            this.secKillList = secKillList
            this.loadMore()
          }
        })
      },
      loadMore() {
        this.$Loading.open();
        this.page++
        this.loading = true
        let paramsData = {
          page: this.page,
          rows: this.rows,
          activityId: this.activityId,
          token: this.$store.state.login.token,
          fromFrontPage: '1'
        }
        paramsData.deliverType = this.selectedType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        }
        let url = '/app/json/product/getAppDesigneList'
        // let url = '/app/json/product/getAppProSearchList'
        this.$http.post(url, paramsData).then(res => {
          this.$actionStatistics.listAction('130030', JSON.stringify(paramsData), this.activityId)
          let data = res.data
          this.pageInit = true
          if (data.status == 0) {
            // 商品列表
            let proList = data.data.list || []
            proList.map(item => {
              item.dpedData = this.$mallCommon.priceFromItem(item)
              item.linePrice = this.$util.toDecimal2(item.dpedData.linePrice)
              return item
            })
            this.proList = this.proList.concat(proList)
            if (this.proList.length < data.data.page.count) {
              this.loading = false
            } else {
              this.hasMore = false
            }
          }
          this.$Loading.close()
        })
      },
      chooseSeckillHandler(item) {
        this.hasMore = true
        this.page = 0
        this.proList = []
        this.activityId = item.id
        this.globalStatus = item.status
        if (item.status) {
          this.countDownEndTime = item.endDate && item.endDate.replace(/-/g, '/')
        } else {
          this.countDownEndTime = item.startDate && item.startDate.replace(/-/g, '/')
        }
        this.loadMore()
      },
      dateFilter(val) {
        if (val) {
          let date = new Date(val.replace(/-/g, '/'))
          return `${this._padLeft(date.getMonth() + 1)}-${this._padLeft(date.getDate())}`
        } else {
          return ''
        }
      },
      hourFilter(val) {
        if (val) {
          let date = new Date(val.replace(/-/g, '/'))
          return `${this._padLeft(date.getHours())}:${this._padLeft(date.getMinutes())}`
        } else {
          return ''
        }
      },
      _padLeft(num) {
        return '00'.substr(num.toString().length) + num
      }
    },
    // activated() {
    //   // 判断配送自提变了界面需要刷新
    //   if (this.$store.state.mall2.staticDeliverType != this.selectedType) {
    //     this.selectedType = this.$store.state.mall2.staticDeliverType;
    //     this.backRefresh = true
    //   } else {
    //     // 如果是自提，需要判断自提点是否发生变化
    //     if (this.selectedType == 1) {
    //       if (this.listZitiId != this.$store.state.mall2.zitiAddress.id) {
    //         this.backRefresh = true
    //       }
    //     }
    //   }
    //
    //   if (this.backRefresh && this.pageInit) {
    //     this.backRefresh = false
    //     this.selectedTypeEvent(this.selectedType)
    //   } else {
    //     // this.$refs.listContent.setScrollTopValue(this.scrollTopValue1);
    //   }
    // },
    computed: {
      bgImg() {
        return require('../../../../assets/sekill/seckillBgUp.png')
      }
    },
    components: {Countdown},
    beforeRouteLeave(to, from, next) {
      // if (to.path != this.lastPath) {
      // this.scrollTopValue1 = this.$refs.listContent.getScrollTopValue();
      // } else {
      this.$keepaliveHelper.deleteCache(this)
      // }
      next()
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .seckill-container {
    display: flex
    justify-content space-between;
    flex-direction column;
    height 100%

    .seckill-menu {
      background-image url('../../../../../static/image/mall2/seckill/seckillBgDown.png')
      background-size 100% 100%
      background-repeat no-repeat
      height 129px
      padding 10px 0;
      overflow: hidden
      display: flex
      align-items flex-end

      .seckill-menu-item {
        width 25%;
        padding 0 10px;
        text-align: center;
        color: #fff;
        float: left

        &.active {
          .time {
            font-size: 20px;
            font-weight: 700;
          }

          .status {
            padding-top: 5px;
            font-size: 14px;
          }
        }

        .time {
          font-size: 16px;
          font-weight: 700;
        }

        .status {
          padding-top: 5px;
          font-size: 12px;
        }
      }
    }

    .count-down-container {
      padding 18px 10px
      display: flex
      justify-content space-between

      .tip {
        line-height: 1.428
      }

      .count-down {
        display flex
        align-items center

        .text {
          float: left
          font-size: 12px;
          padding-right: 6px;
        }

        .count-down-con {

        }
      }
    }

    .seckill-content {
      flex 1
      padding 10px;
      padding-top: 5px;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      position: relative;

      .seckill-list {
        .seckill-item {
          padding 11px 15px;
          border-radius 4px;
          overflow: hidden
          box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
          background: #fff;

          & + .seckill-item {
            margin-top: 8px;
          }

          .seckill-object {
            float left;
            width 120px;
            height 120px;
          }

          .seckill-body {
            overflow hidden
            padding-left: 10px;
            position: relative

            .price-z {
              font-size 16px;
              font-weight 500;
            }

            .price-x {
              font-size 12px;
              font-weight 500;
            }

            .left-no-space {
              margin-left -4px;
            }

            .pro-name {
              line-height: 21px;
              height 42px;
            }
            .font-size {
              font-size 16px
            }
            .price-info {
              padding-top: 15px;
              display: flex
              text-align center
              align-items flex-end
              justify-content space-between
              font-size 12px

              .btn1 {
                padding 6px 10px
                color: #fff;
                border-radius 20px;
                background: #f80f16
                &.disabled{
                  background: #d2d2d2
                }
              }
              .btn {
                padding 6px 6px
                color: #fff;
                border-radius 5px;
                background: #f80f16

                &.disabled {
                  background: #d2d2d2
                }

                .btn-content {
                  margin-bottom 6px
                }
              }
            }

            .btn-progress {
              display flex
              flex-direction row
              align-items center
              justify-content center

              .pro {
                width 46px
              }

              .pro-tip {
                margin-left 6px
                font-size 6px
              }
            }

            .discount-price {
              display: flex
              align-items center
              justify-content space-between
              padding-top: 10px;

              .price {
                font-size: 12px;
                text-decoration line-through
              }

              .progress-wrapper {
                width 130px;
                display flex
                align-items center

                .num {
                  padding-right: 10px;
                  font-size: 10px;
                }

                .progress {
                  flex 1

                  /deep/ .mt-progress {
                    height auto;
                    line-height: 21px;
                  }

                  /deep/ .mt-progress-runway {
                    background-color: #fff
                    border-radius 10px;
                    border: 1px solid rgba(248, 15, 22, 1)
                  }

                  /deep/ .mt-progress-progress {
                    background-color: rgba(248, 15, 22, 0.52)
                    border-radius 10px;
                  }
                }
              }
            }

            .discountGoodsCntPerUser {
              padding-top: 5px;
              font-size: 10px;
              text-align right;
            }
          }
        }

        .no-data {
          padding: 15px;
          text-align: center;
        }
      }
    }

    .sold-out {
      position: absolute
      bottom: 0;
      right 5px

      .img {
        width 44px;
      }
    }
  }

  .row {
    padding 5px 15px;
    display flex;

    &.axjf-tip {
      display flex;
      align-items center;
      padding 10px 15px;
      margin-bottom 4px;

      .label {
        flex 1;
      }

      .value {
        margin-right 10px;
      }

      i {
        font-size 12px;
      }
    }

    .type-btn {
      font-size $font-size-medium
      padding 4px 10px;
      // border-radius 15px;
      // border 0.6px solid transparent;

      &.type-btn:before {
        border-color transparent
      }

      .icon-size {
        font-size $font-size-medium
      }
    }

    .space {
      flex 1;
    }

    .local-div {
      max-width 180px;
      display flex;
      align-items center;
      font-size $font-size-medium-s

      .icon-size {
        font-size $font-size-medium
      }

      span {
        padding 2px;
      }
    }

    &.row-filter {
      justify-content: space-around;
    }

    &.row-channel {
      display: flex;
      overflow-x: auto;
      justify-content: space-between;
      align-items center;

      .channel-btn {
        padding 6px 0px 4px;
        padding-right 20px;

        .text {
          text-align: center;
          white-space: nowrap;
          padding-bottom 6px
          position relative;

          &.active {
            color #f80f16;
          }

          &.active::before {
            content: "";
            display: block;
            clear: both;
            background-color #f80f16;
            position: absolute;
            left: 0;
            right 0;
            bottom: 0;
            height 2px;
          }
        }
      }
    }

    .filter-btn {
      padding 7px;
      display flex;
      align-items center;
      justify-content: center;

      .cate {
        max-width 80px;
      }

      .arrows {
        display inline;
      }

      .arrow-icon {
        margin-top -4px;
        margin-bottom -4px;
        display block;
        font-size 12px;
      }

      .filter-size {
        font-size 17px;
      }

      .filter-size-1 {
        font-size 14px;
        padding 2px 3px 0px;
      }

      span {
        font-weight 500;
      }
    }
  }
</style>
