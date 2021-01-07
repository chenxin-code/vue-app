<template>
  <div class="seconds-kill" :class="{'min-height': $store.state.webtype == '-1'}" v-if="$market.moduleIsShow(moduleData)">
    <div v-if="isShow && moduleData.styleTempl == '1' && productList.length > 0" class="style1">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allSecondsKill'})" @click="hotEvent('allSecondsKill');allSecondsKill()">
          <img src="static/images/seconds-kill/miaosha.png"/>
          <div class="field">{{fieldString}}</div>
          <div class="remaining">还剩：</div>
          <Countdown @timeOut="myTimeOut" :endTime="endTime" type="theme_bg_black"></Countdown>
          <div style="flex: 1;"></div>
          <img class="arrow" src="static/images/my-order/all-order.png"/>
        </div>
        <div class="items-row">
          <HScroll ref="hscroll1" :dataList="productList" :click="false">
            <div class="pro-itm" v-for="(item,idx) in productList" :key="idx">
              <div class="item" :class="hotareaClass({idCode: moduleData.idCode + item.id})" @click="hotEvent(item.id);productEvent(item)">
                <img @load="loadImage" :src="item.phMainUrl"/>
                <div class="price">
                  <span>￥</span>
                  <span class="price-z">{{item.dpedData.integer}}</span>
                  <span>.{{item.dpedData.decimals}}</span>
                </div>
                <div class="price-line" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                  <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{$market.toDecimal2(item.dpedData.linePrice)}}</div>
              </div>
            </div>
          </HScroll>
        </div>
      </div>
    </div>
    <div v-if="isShow && moduleData.styleTempl == '2' && productList.length > 0 && $market.moduleIsShow(moduleData)" class="style2"
         :style="$market.getModuleBgStyle(moduleData)">
      <div class="content">
        <div class="title-row" :class="hotareaClass({idCode: moduleData.idCode + 'allSecondsKill'})" @click="hotEvent('allSecondsKill');allSecondsKill()">
          <img class="bg-img" src="static/images/seconds-kill/title-bg.png"/>
          <div class="title-content">
            <div class="field">{{fieldString}}</div>
            <!--<div class="remaining">还剩：</div>-->
            <Countdown @timeOut="myTimeOut" :endTime="endTime" type="theme_bg_quan"></Countdown>
            <div style="flex: 1;"></div>
            <!--<img class="arrow" src="static/images/icon-more-1.png"/>-->
          </div>
        </div>
        <div class="items-row">
          <HScroll ref="hscroll2" :dataList="productList" :click="false">
            <div class="pro-itm" v-for="(item,idx) in productList" :key="idx">
              <div class="item" :class="hotareaClass({idCode: moduleData.idCode + item.id})" @click="hotEvent(item.id);productEvent(item)">
                <img  @load="loadImage" :src="item.phMainUrl"/>
                <div class="price">
                  <span>￥</span>
                  <span class="price-z">{{item.dpedData.integer}}</span>
                  <span>.{{item.dpedData.decimals}}</span>
                </div>
                <div class="price-line" :class="{'line-through': $store.state.globalConfig.priceShowType == 2}">
                  <span v-if="$store.state.globalConfig.priceShowType == 1">原价:</span>￥{{$market.toDecimal2(item.dpedData.linePrice)}}</div>
              </div>
            </div>
          </HScroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Countdown from "@/components/Vendor/countdown/countdown";
  import HScroll from '@/components/base/horizontal-scroll/horizontal-scroll'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: 'seconds-kill',
    components: {
      Countdown,
      HScroll
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        mktActivity: {},
        productList: [],
        fieldString: '',
        isShow: false,
        endTime: 0,
        beforeClear: true
      };
    },
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    created() {
      if (this.$store.state.webtype == -1 && !this.moduleData.idCode) {
        this.moduleData.idCode = this.$util.randomString()
      }
      this.beforeClear = true
      this.getProducts();
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      modeleReshow: function () {
        // this.beforeClear = false
        // this.getProducts()
      },
      productEvent: function (item) {
        this.$market.secondsKillProEvent(item, this.mktActivity.id, this.moduleData.onlyDeliveryType)
      },
      allSecondsKill: function () {
        this.$market.customPush({
          path: '/mall2/seckilllist',
          query: {
            onlyDeliveryType: this.moduleData.onlyDeliveryType
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
      dateFilter(val) {
        if (val) {
          let date = new Date(val.replace(/-/g,'/'))
          return date.getMonth() + 1 + '月' + date.getDate() + '日场'
        } else {
          return ''
        }
      },
      hourFilter(val) {
        if (val) {
          val = val.replace(/-/g, '/')
          let date = new Date(val)
          return `${date.getHours()}${this._padLeft(date.getMinutes())}场`
        } else {
          return ''
        }
      },
      myTimeOut: function () {
        // 秒杀到期，重新请求数据
        this.getProducts();
      },
      _padLeft(num) {
        if (parseInt(num) == 0) {
          return '点'
        }
        return ':' + '00'.substr(num.toString().length) + num
      },
      getProducts: function () {
        if (this.beforeClear) {
          this.mktActivity = {}
          this.productList = []
          this.fieldString = ''
        }
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProSecKillList';
        let paramsData = {
          fromFrontPage: '1'
        };
        if (this.$store.state.webtype == '-1') {
          paramsData.fromFrontPage = ''
        }
        if (this.$store.state.webtype != '-1') {
          paramsData.token = this.$store.state.login.token
        }
        paramsData.deliverType = this.$store.state.mall2.staticDeliverType
        if (this.$store.state.mall2.staticDeliverType == 1) {
          paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
        }
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == 0) {
              let mktActivityList = data.data.mktActivityList;
              if (mktActivityList && mktActivityList.length > 0) {
                this.mktActivity = data.data.mktActivityList[0]
                this.fieldString = this.timeToTitle(this.mktActivity.startDate)
                this.productList = [];
                let tempArr = [];
                for (let i = 0; i < data.data.list.length; i++) {
                  let item = this.$market.dataProcessing(data.data.list[i])
                  tempArr.push(item);
                }
                this.productList = tempArr;

                let timeStart = this.mktActivity.startDate.replace(/-/g, '/')
                let startTime = (new Date(timeStart)).getTime() / 1000
                let nTime = this.$store.state.severTime.currentTime
                if (startTime > nTime) {
                  this.endTime = startTime
                } else {
                  let time = this.mktActivity.endDate.replace(/-/g, '/')
                  this.endTime = (new Date(time)).getTime() / 1000
                }
                this.isShow = true;
                this.$nextTick(()=>{
                  let ref = '';
                  if(this.moduleData.styleTempl == '2'){
                    ref = 'hscroll2';
                  }else if(this.moduleData.styleTempl == '1'){
                    ref = 'hscroll1';
                  }
                  let el = this.$refs[ref];
                  if(el){
                    el._refresh();
                  }
                })

              } else {
                this.isShow = false;
              }
            }
          },
          error => {
          }
        );
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          let ref = '';
          if(this.moduleData.styleTempl == '2'){
            ref = 'hscroll2';
          }else if(this.moduleData.styleTempl == '1'){
            ref = 'hscroll1';
          }
          let el = this.$refs[ref];
          if(el){
            el._refresh();
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/common/stylus/variable.styl';
  //
  .seconds-kill {
    .style1 {
      padding 5px 8px;

      .content {
        box-shadow 0 1px 8px #efefef;
        border-radius 8px;
        padding 8px;

        .title-row {
          padding 8px 0px;
          // border-bottom 0.5px solid #ddd;
          display flex;
          align-items center;

          img {
            height 16px;
          }

          .field {
            margin-left 10px;
            font-size 12px;
          }

          .remaining {
            font-size 12px;
            margin-left 10px;
          }

          .arrow {
            margin-left 5px;
            height 12px;
          }
        }

        .items-row {
          /*margin-top 4px;
          padding-top 8px;*/
          /*overflow-x auto;
          overflow-y hidden;
          white-space: nowrap;*/

          .pro-itm {
            display inline-block;
            overflow hidden
          }

          .item {
            width 90px;
            padding 5px;
            overflow hidden;

            .price {
              font-size 10px;
              font-weight 500;

              .price-z {
                font-size 18px;
                margin 5px -4px;
              }
            }

            .price-line {
              margin-top 3px;
              font-size 10px;
              color #999;
              //text-decoration: line-through
            }

            img {
              width 80px;
              height 80px;
            }

            .text {
              margin-top 8px;
              font-size 12px;
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
            }
          }
        }
      }
    }

    .style2 {
      .content {
        .title-row {
          position relative;
          overflow hidden;
          // border-bottom 0.5px solid #ddd;

          .bg-img {
            display block;
            width 100%;
          }

          .title-content {
            position absolute;
            left 100px;
            right 0px;
            top 0px;
            bottom 0px;
            display flex;
            align-items center;

            .field {
              margin-left 10px;
              margin-right 15px;
              font-size 12px;
            }

            .remaining {
              font-size 12px;
              margin-left 10px;
            }

            .arrow {
              margin-right 20px;
              height 21px;
            }
          }
        }

        .items-row {
          overflow-x auto;
          overflow-y hidden;
          white-space: nowrap;

          .pro-itm {
            display inline-block;
            overflow hidden
          }

          .item {
            width 84px;
            padding 0 5px 5px;

            .price {
              color #C80902;
              font-size 10px;
              font-weight 500;

              .price-z {
                font-size 18px;
                margin 5px -4px;
              }
            }

            .price-line {
              margin-top 4px;
              font-size 10px;
              color #999;
              //text-decoration: line-through
            }

            img {
              width 74px;
              height 74px;
            }

            .text {
              margin-top 8px;
              font-size 12px;
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
            }
          }

          .item:nth-child(1) {
            margin-left 12px;
          }

          .item:nth-last-child(1) {
            margin-right 12px;
          }
        }
      }
    }
  }

  .min-height {
    min-height 30px;
  }
</style>

