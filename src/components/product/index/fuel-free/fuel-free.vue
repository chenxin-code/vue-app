/**Created by liaoyingchao on 2019-06-11.*/

<template>
  <div class="fuel-free" :style="getBgStyle()" v-if="$market.moduleIsShow(moduleData)">
    <div class="block-img" v-if="moduleData.topImg != ''">
      <img :src="moduleData.topImg">
    </div>
    <div class="fuel-free-content" :style="getOutSideStyle()">
      <div class="content" :style="getSidesStyle()">
        <div class="title-row">
          <swiper :options="titleOption" ref="swiper_fuelfree" v-if="periods && periods.length > 1">
            <swiper-slide v-for="(item, idx) in periods" :key="idx">
              <div class="text" :class="{activity: selectedIndex == 0}" :style="getTextColor()" @click="periodSelected(idx)">第{{item}}期中奖名单</div>
            </swiper-slide>
          </swiper>
          <swiper :options="titleOption" ref="swiper_fuelfree" v-else>
            <swiper-slide v-for="(item, idx) in periods" :key="idx">
              <div class="text" :class="{activity: selectedIndex == 0}" :style="getTextColor()" @click="periodSelected(idx)">本期中奖名单</div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="fuel-free-form">
          <div class="row header line_bottom" :style="getHeaderBg()">
            <div class="row-d" :style="getTextColor()">手机号</div>
            <div class="row-d" :style="getTextColor()">加油时间</div>
            <div class="row-d" :style="getTextColor()">加油站</div>
            <div class="row-d" :style="getTextColor()">奖品</div>
          </div>
          <div class="form-scroll">
            <div class="row line_bottom" v-for="(item,idx) in drawRosters" :key="idx">
              <div class="row-d single-line" :style="getFormTextColor()">{{getPhoneStr(item)}}</div>
              <div class="row-d single-line" :style="getFormTextColor()">{{getTimeStr(item)}}</div>
              <div class="row-d single-line" :style="getFormTextColor()">{{item.ouName}}</div>
              <div class="row-d single-line" :style="getFormTextColor()">{{item.draw}}</div>
            </div>
          </div>
          <div class="line line1"></div>
          <div class="line line2"></div>
          <div class="line line3"></div>
        </div>
      </div>
    </div>
    <div class="block-img" v-if="moduleData.bottomImg != ''">
      <img :src="moduleData.bottomImg">
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Bus from "../bus";

  export default {
    name: "fuel-free",
    components: {},
    data() {
      let that = this
      return {
        titleOption: {
          // allowSlideNext: true,
          // allowSlidePrev: true,
          slidesPerView: 'auto',
          centeredSlides: true,
          //spaceBetween: 30,
          // 循环滑动
          loop: false,
          on: {
            slideChange: function () {
              that.selectedPeriod = this.realIndex + 1
              that.selectedPeriod += ''
              that.getFuelFreeDatas()
            },
          }
        },
        selectedIndex: 0,
        periods: null,
        selectedPeriod: '1',
        drawRosters: [],
        formTextColor: 'color: #'
      }
    },
    props: [
      'usePorpData',
      'propData',
    ],
    computed: {
      ...mapGetters(['clientWidth']),
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData
        }
        return this.$store.state.pageData
      },
      moduleData: function () {
        return this.pageData.screenModule.data
      }
    },
    methods: {
      periodSelected: function (idx) {
        this.$refs.swiper_fuelfree.swiper.slideTo(idx)
        // this.selectedPeriod = idx+1
        // this.getFuelFreeDatas()
      },
      getFormTextColor: function () {
        let styleStr = '';
        let color = this.moduleData.formTextColor
        if (color != '') {
          styleStr += "color: " + color +";"
        }
        return styleStr
      },
      getTextColor: function () {
        let styleStr = '';
        let color = this.moduleData.textColor
        if (color != '') {
          styleStr += "color: " + color +";"
        }
        return styleStr
      },
      getHeaderBg: function () {
        let styleStr = '';
        let color = this.moduleData.headerBgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        return styleStr
      },
      getPhoneStr: function (item) {
        let phone = item.userName
        let reg = /^1[0-9]{10}$/;
        if (reg.test(phone)) {
          let str1 = phone.substr(0,3);
          let str2 = phone.substr(7,4);
          return str1 + '****' + str2;
        } else {
          return phone
        }
      },
      getTimeStr: function (item) {
        let time = item.refuelTime
        var oDate = new Date(time),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMinute = oDate.getMinutes(),
          oSecond = oDate.getSeconds(),

          oTime = oMonth + '-' + oDay + ' ' + oHour + ':' + oMinute + ':' + oSecond;//最后拼接时间
        return oTime;
      },
      getBgStyle: function () {
        let styleStr = '';
        let color = this.moduleData.bgColor
        if (color != '') {
          styleStr += "background-color: " + color +";"
        }
        let img = this.moduleData.bgImgUrl
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }
        return styleStr
      },
      getOutSideStyle: function () {
        let styleStr = '';
        let upMargin = this.moduleData.upMargin
        let downMargin = this.moduleData.downMargin
        if (upMargin > 0) {
          styleStr += 'padding-top: ' + upMargin + '%;'
        }
        if (downMargin > 0) {
          styleStr += 'padding-bottom: ' + downMargin + '%;'
        }
        let img = this.moduleData.middleBgImg
        if (img != '') {
          styleStr += "background: url('" + img + "') no-repeat center center / 100% 100%;"
        }

        return styleStr;
      },
      getSidesStyle: function () {
        let styleStr = '';
        let sidesMargin = this.moduleData.sidesMargin
        if (sidesMargin > 0) {
          styleStr += 'margin-left: ' + sidesMargin + '%; margin-right: ' + sidesMargin + '%;'
        }

        return styleStr;
      },
      getFuelFreeDatas: function () {
        let url = this.$market.apiBaseURL() + '/app/json/app_refuel_free_activity_order/getDrawRoster';
        let paramsData = {
          freeActId: this.moduleData.activityId,
          periods: this.selectedPeriod
        };
        this.$http.post(url, paramsData).then(
          res => {
            let data = res.data;
            if (data.status == '0') {
              let acData = data.data;
              this.periods = acData.periods
              this.drawRosters = acData.drawRosters
            }
          },
          error => {
          }
        );
      }
    },
    created() {
      console.log(this.moduleData)
      this.getFuelFreeDatas()
      Bus.$on('fuelRefresh', () => {
        this.selectedPeriod = '1'
        this.getFuelFreeDatas()
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .fuel-free {
    width 100%
    height 100%
    overflow hidden
    display flex;
    flex-direction column;
    .block-img {
      img {
        display block;
        width 100%;
      }
    }
    .fuel-free-content {
      flex 1;
      .content {
        height 100%;
        position relative;
        //background-color yellow;
        .title-row {
          overflow hidden;
          .swiper-slide {
            width auto;
          }
          .text {
            padding 0 30px;
            height 24px;
            line-height 24px;
            font-size 14px;
            font-family 'LiSu'
            &.activity {
              font-size 20px;
              font-weight 600;
            }
          }
        }
        .fuel-free-form {
          position absolute;
          left 0;
          right 0;
          bottom 0;
          top 36px;
          border-radius: 10px;
          //overflow hidden;
          z-index 2;

          .line {
            content: " ";
            position: absolute;
            left 0;
            top: 0;
            bottom 0;
            width 1px;
            border-left: 1px solid #ddd;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleX(0.5);
            transform: scaleX(0.5);
            &.line1 {
              left 25%
            }
            &.line2 {
              left 50%
            }
            &.line3 {
              left 75%
            }
          }

          .row {
            height 40px;
            //line-height 40px;
            display flex;
            align-items center;
            font-size 12px;
            &.header {
              font-size 14px;
              border-radius: 10px 10px 0 0;
              overflow hidden;
              .row-d {
                font-weight 600;
              }
            }
            .row-d {
              line-height 34px;
              flex 1;
              text-align center;
              padding 3px;
            }
          }

          .form-scroll {
            position absolute;
            left 0;
            right 0;
            bottom 0;
            top 40px;
            border-radius: 0 0 10px 10px;
            overflow-y auto;
            z-index 2;
          }

          &.fuel-free-form:before {
            content: "";
            position: absolute;
            top: -50%;
            bottom: -50%;
            left: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            border: solid 1px #ddd;
            border-radius: 20px;
            box-sizing: border-box;
            z-index -1;
          }
        }
      }
    }
  }
</style>
