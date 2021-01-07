<template>
  <div class="sign-in-container">
    <nav-top @backEvent="$router.go(-1)" title="日期选择"></nav-top>
    <nav-content>
      <div class="calendar-container">
        <div class="calendar-wrapper">
          <div class="calendar-content">
            <div class="line"></div>
            <div class="month-choose-wrapper">
              <div @click="prevMonth" class="btn left-btn"></div>
              <div class="month">{{monthFormat}}月</div>
              <div @click="nextMonth" class="btn right-btn"></div>
            </div>
            <ul class="calendar-list">
              <li :key="index" class="calendar-item other" v-for="(item, index) in 7">
                <span class="text">{{weeks[index]}}</span>
              </li>
<!--              <li :class="{today: item.type === 'today', checked: item.hasSignIn, other: item.type === 'prevMonth' || item.type === 'nextMonth'}" :key="index+10" @click="signHandler(item,index)"-->
              <li :class="{colour:item.selectData==true,red:item.redData==true}" :key="index+10" @click="signHandler(item,index)"
                  class="calendar-item"
                  v-for="(item, index) in calendar">
                <span class="text">{{item.desc}}</span>

                <template v-if="item.obj">
                  <span class="money" :class="{colour:item.selectData==true,red:item.redData==true}" v-if="item.obj.price">￥{{item.obj.suggest_price}}</span>
                  <span style="display: none;">{{item.obj.price}}</span>
                  <span style="display: none;">{{item.obj.price}}</span>
                </template>
                <template v-else>
                  <span class="money" :class="{colour:item.selectData==true,red:item.redData==true}" v-if="item.price &&item.price>0">￥{{item.price}}</span>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="box">
        <p>可用时间</p>
        <p>{{obj.startTime}}~{{obj.expireTime}}</p>
        <span>（限{{obj.week}}可用）</span>
      </div>
      <div class="box box1">
        <div>
          <p>购票数量</p>
          <span>￥{{price}}元</span>
        </div>
        <div class="div divs"><div class="num"><span :class="{gray:grayDate==true}" @click="less">-</span><input @input="inputs" type="number" v-model="nums" :disabled="grayDate"><span :class="{gray:grayDate==true}" @click="add">+</span></div></div>
      </div>
    </nav-content>
    <div class="box div4">
      <p>总额：<span class="span1">￥{{allMoney}}</span></p>
      <span class="span2" :class="{gray:grayDate==true}" @click="toOrder">下一步</span>
    </div>
  </div>
</template>

<script>
  import jsCalendar from 'js-calendar'
  import api from './api'
  import store from "../../vuex/store";

  export default {
    name: "calendar",
    mixins: [api],
    data() {
      return {
        title: '',
        initPage: false,
        showRecord: false, // 签到记录
        tableMonth: -1, // 当前月份
        calendar: [],
        stationList: [], // 油站列表
        sideFiltrateModalShow: false,
        price: '0',
        loading: false,
        allMoney: 0,
        finished: false,
        danjia: '',
        grayDate: true, //加减号禁止点击
        obj: {},
        page: 0,
        station: {
          stationCode: '',
          stationName: ''
        }, // 展示的油站
        stationModel: '', // 油站code
        signInData: {}, // 签到信息
        searchName: '', // 搜索名称
        areaShowName: '附近',
        winPrize: [],
        searchType: '', // 查询类型
        cityId: '', // 普通的签到需要cityID
        channel: '', // 海油 区分项目类型
        weeks: ['一', '二', '三', '四', '五', '六', '日'],
        itemId: '',
        lastPath: '',
        today: '', //当天日期
        calendarDay: '', //所选的日历日期
        priceA: '',
        priceB: '',
        priceC: '',
        datePrice: [],
        shareInfo: {
          isShare: 0
        },
        nums: 0
      }
    },
    created() {
      this.lastPath = this.$route.query.lastPath
    },
    beforeRouteLeave(to, from, next) {
      // console.log(this.$route.query.lastPath)
      if (to.path == this.lastPath) {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    mounted() {
      this.nowDate = new Date()
      this.tableYear = this.nowDate.getFullYear()
      this.tableMonth = this.nowDate.getMonth()
      this.itemId = this.$route.query.itemId
      this.messageData()
      this.today = this.getNowFormatDate()
      console.log(this.today);
    },
    computed: {
      monthFormat() {
        let arry = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        return arry[this.tableMonth]
      },
      numberOfDaysTotal() {
        let num = 0
        if (this.signInData && this.signInData.gameSigninRecordModelList && this.signInData.gameSigninRecordModelList.length > 0) {
          num = this.signInData.gameSigninRecordModelList[this.signInData.gameSigninRecordModelList.length - 1].daysTotal
        }
        return num
      }
    },
    methods: {
      messageData() { //门票列表(日历信息接口datePrices对象)
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          itemId: that.$route.query.itemId,
          pageThis: that.page,
          pageSize: 10,
          keyWord: ''
        };
        this.$Loading.open();

        that.ticketListData(params).then(res => {
          this.$Loading.close();
          if (res.data.result) {
            that.obj = res.data.data[0] || {}
            if (Object.keys(res.data.data[0].datePrices).length == 0) { //后台设置的日历，为空对象
              this.getCalendar()
              that.calendar.forEach(function(item,index) {
                item.redData = false
                var time = new Date(item.date);
                var formatTime = time.getFullYear() + '' + (time.getMonth() + 1) + '' + time.getDate();
                if (Number(formatTime) == Number(that.today.replace(/-/g, ""))) {
                  console.log('同一天')
                  item.price = res.data.data[0].original_price // 当天价格，市场价、票面原价
                  item.priceA =  res.data.data[0].nett_price   //当天分销价
                  item.priceB =  res.data.data[0].back_cash    //当天的返现
                  item.priceC =  res.data.data[0].market_price  //当天指导价
                } else{
                  console.log('bu同一天')
                  item.price = res.data.data[0].sku_suggest_price //默认市场价sku_market_price
                  item.priceA = res.data.data[0].sku_user_price //默认分销价
                  item.priceB = res.data.data[0].sku_back_cash  //默认返现
                  item.priceC = res.data.data[0].sku_suggest_price //默认指导价
                }
                if (item.price>0) {
                  item.selectData = true
                } else {
                  item.selectData = false
                }
              })
            } else { //后台设置日历的情况,price就是分销价
              console.log(666);
              console.log(typeof res.data.data[0].datePrices);
              console.log(res.data.data[0].datePrices);
              var arr = [];
              var obj = res.data.data[0].datePrices
              for(var i in obj){
                arr.push(Object.assign({},obj[i],{date:i}))
              }
              that.datePrice = arr
              that.getCalendar()
              that.selectCalendar()
            }
          }
        });
      },
      selectCalendar() {
        let that = this
        if (that.datePrice.length==0) {
          return
        }
        that.calendar.forEach(function (item) {
          that.datePrice.forEach(function (item1) {
            if(item1.date === that.$util.formatDate(item.date,'yyyy-MM-dd')){
              item.selectData = true
            }
          })
        })
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      getCalendar() {
        let calendar = []
        let generator = new jsCalendar.Generator({onlyDays: true, weekStart: 1, lang: 'zh'})
        let today = this._clearHours(new Date())
        let jsCal = generator(this.tableYear, this.tableMonth)
        let dayNum = 0
        console.log(jsCal)
        jsCal.cells.forEach((cell, index) => {
          if (cell.type === 'prevMonth' || cell.type === 'monthDay' || cell.type === 'nextMonth') {
            const time = cell.date && this._clearHours(cell.date)
            cell.type = time === today ? 'today' : cell.type

            if(Object.keys(this.obj.datePrices).length == 0) {

            } else {
              this.datePrice.forEach(item => {
                if (this._clearHours(item.date) === time) {
                  cell.obj = item
                  console.log(cell.obj);
                }
              })
            }
            cell.redData = false
            cell.selectData = false
            calendar.push(cell)
          }
        })
        this.calendar = calendar
      },
      signHandler(params,index) { //点击日期
        console.log(params);
        if (Object.keys(this.obj.datePrices).length == 0) {
          var time = new Date(params.date);
          var formatTime=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
          console.log(formatTime);
          this.calendar.forEach(function(item) {
            item.redData = false
          })
          this.calendar[index].redData = true
          console.log(this.calendar);
          this.grayDate = false // 加减号可以点击
          this.nums = 1
          this.calendarDay = formatTime
          this.price = params.price //市场价、单价
          console.log(this.price);
          this.priceA = params.market_price //分销价
          this.priceC =  params.suggest_price
          this.allMoney = (Number(this.price) * this.nums).toFixed(2)
        } else {
          if (this.calendar[index].selectData == true) {
            var time = new Date(params.date);
            var formatTime=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
            console.log(formatTime);
            this.calendar.forEach(function(item) {
              item.redData = false
            })
            this.calendar[index].redData = true
            this.grayDate = false // 加减号可以点击
            this.nums = 1
            this.calendarDay = formatTime
            this.price = params.obj.price //市场价、单价
            console.log(this.price);
            this.priceA = params.obj.market_price //分销价
            this.priceC =  params.obj.suggest_price
            this.allMoney = (Number(this.price) * this.nums).toFixed(2)
          } else {
            this.$Toast('当前日期不可购买')
          }
        }
      },
      signIn() {
        this.signHandler({date: new Date()})
      },
      _clearHours(time) {
        const cloneDate = new Date(time)
        cloneDate.setHours(0, 0, 0, 0)
        return cloneDate.getTime()
      },
      toOrder() {
        if (this.grayDate == true) {
          this.$Toast('请先选择日期')
        } else {
          store.commit('putpeople', [])
          let that = this
          that.$router.push({
            path: '/carefree_trave/writingOrder',
            query: {
              itemId: that.$route.query.itemId,
              nums: that.nums,
              allMoney: that.allMoney,
              price: that.price, //单价
              priceA: that.priceA,
              priceB: that.priceB,
              priceC: that.priceC
            }
          })
        }
      },
      less() {
        if (this.grayDate == true) {
          this.$Toast('请先选择日期')
        } else {
          if (this.nums>0) {
            this.nums --
            this.allMoney =  (this.allMoney - this.price).toFixed(2)
          } else {
            this.nums = 0
            this.allMoney = 0
          }
          if (this.nums == 0) {
            this.grayDate = true
          }
        }
      },
      inputs(data) {
        console.log(data);
        if (data.srcElement.value == 0) {
          this.grayDate = true
        }
      },
      add() {
        if (this.grayDate == true) {
          this.$Toast('请先选择日期')
        } else {
          console.log(333,this.price);
          this.nums ++
          this.allMoney = (Number(this.price) * this.nums).toFixed(2)
        }
      },
      prevMonth() {
        this.tableMonth--
        if (this.tableMonth < 0) {
          this.tableMonth = 11
          this.tableYear--
        }
        this.nowDate = new Date()
        this.nowDate.setMonth(this.tableMonth)
        this.nowDate.setFullYear(this.tableYear)
        this.getCalendar()
        this.messageData()
        this.selectCalendar()
      },
      nextMonth() {
        this.tableMonth++
        if (this.tableMonth > 11) {
          this.tableMonth = 0
          this.tableYear++
        }
        this.nowDate.setMonth(this.tableMonth)
        this.nowDate.setFullYear(this.tableYear)
        this.getCalendar()
        this.messageData()
        this.selectCalendar()
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .sign-in-container {
    height: 100%;
    background-color: #f6f6f6 !important;
    position: relative;

    .tool-bar {
      align-items center

      .table-view-cell {
        display flex
      }

      .tool-bar-left {
        flex: 1
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 17px;
        position: relative;
      }

      .tool-bar-right {
        flex-shrink 0
      }

      .c-icon {
        vertical-align: middle
        color: #f62e2e
        font-size: 18px
      }

      .tool-bar-btn {
        margin-left: 3px;
        color: #8c8c8c;
        // position: absolute;
        // right: 2px;
        // top: 50%;
        //  transform translateY(-50%)
      }

      .text {
        color: #8c8c8c;
        padding-left: 6px;
        vertical-align: middle
      }
    }

    .calendar-container {
      position: relative
      background: #fff;
      top 30px;

      .calendar-banner {
        .banner {
          width 100%
        }
      }

      .info {
        position: absolute
        top: 30px;
        left 0
        padding 0 10px;
        /*display flex*/
        /*justify-content space-between*/
        /*align-items center*/
        overflow: hidden
        width 100%

        .sign-days {
          font-size: 16px;
          color: #fff;
        }

        .sign-btn {
          color: #875f21;
          background: linear-gradient(110deg, #fde3a2, #c6b382)
          padding 5px 22px;
          border-radius 30px;
          font-size: 16px;
          float: right
        }
      }
    }

    .calendar-wrapper {
      background: #fff
      padding 10px 0;

      .calendar-content {
        /**box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1); **/
        background white
        border-radius 8px;
        padding 15px;
        position: relative;
        margin-top: -48px;
        z-index: 10;
        background: #ffff;

        .calendar-gift {
          position: absolute
          width: 140px;
          top: -53px;
          left: 20px;
          z-index 3
        }

        .line {
          width 80%
          border-top: 12px dotted #fff;
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .sign-record-btn {
          text-align: right;
          font-size: 14px;
          color: #ba333f;
          font-weight: 600;
        }

        .month-choose-wrapper {
          display flex
          align-items center
          justify-content space-between
          padding 15px 0

          .month {
            font-size: 14px;
            font-weight: 600
          }

          .btn {
            width 28px;
            height 28px;
            position relative

            &:after {
              content ''
              position: absolute
              left: 50%;
              top: 50%;
              transform translate3d(-50%, -50%, 0)
              border-width 8px
              border-color transparent #b5b5b5 transparent transparent
              border-style solid
            }
          }

          .right-btn {
            &:after {
              border-color transparent transparent transparent #b5b5b5
            }
          }
        }
      }
    }

    .calendar-list {
      overflow: hidden
      text-align: center

      .calendar-item {
        padding 6px 0
        width 14.285%
        float: left
        position: relative
        font-size: 12px;
        display flex
        color #9c9c9c
        flex-direction column

        &.other {
          color: #ccc
        }

        .text {
          position: relative;
          /*width: 26px;*/
          height: 26px;
          line-height: 26px;
          display: inline-block;
          /*font-weight 600*/
          font-size 18px;

          .name {
            position: absolute;
            bottom: -16px;
            left: 50%;
            transform scale(0.5) translateX(-100%)
            font-size: 14px;
            color: #868686;
            font-style: normal;
            white-space: nowrap;
          }
        }

        &.today {
          .text {
            border-radius 50%;
            /**color: #fff
            background: linear-gradient(180deg, #FFC107, #FF9800, #FF5722) **/
            color #ff6a56

            .name {
              bottom: -22px;
            }
          }

          &.checked:before {
            bottom: -10px;
          }
        }

        &.checked:before {
          content: '\F014'
          font-family 'vant-icon'
          position: absolute
          bottom: -5px;
          left: 50%;
          transform translateX(-50%)
          font-size: 10px;
          color: #09cc0f;
        }

        .icon-gift {
          width: 16px;
          height: 16px;
          margin-top: -5px;

          &.active {
            animation shake 1s infinite
          }
        }
      }
    }

    .record-list {
      .table-view-cell {
        padding 0;

        &:after {
          left: 30px;
        }
        overflow visible

        &:not(:last-child):before {
          content '';
          left: 18px;
          top: 21px;
          position: absolute
          width: 1px;
          height: 200%;
          -webkit-transform: scale(.5);
          transform: scale(.5);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          pointer-events: none;
          box-sizing: border-box;
          background: #f62e2e
          z-index: 9;
        }
      }

      .record-more {
        padding 11px 15px;
        overflow hidden
        background: #fff;
        position: relative

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          -ms-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: 0 0;
          -ms-transform-origin: 0 0;
          transform-origin: 0 0;
          pointer-events: none;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          border: 0 solid #e5e5e5;
          border-bottom-width: 1px;
        }

        .more {
          color: #f62e2e;
          float: right

          .text {
            padding-right: 10px;
          }
        }
      }

      .record-item {
        color: #545454
        font-size: 14px;
        padding 11px 20px 11px 30px;

        .record {
          display flex
          align-items center
          justify-content space-between
        }

        .record-name {
          position: relative

          &:before {
            position: absolute
            content ''
            width 5px;
            height 5px;
            border-radius: 50%;
            background: #f62e2e
            left: -14px;
            top: 50%;
            transform translateY(-50%)
            z-index: 10;
          }
        }

        .record-date {
          padding: 5px 0;
          font-size: 12px;
          color: #999
        }

        .record-price {
          flex-shrink 0
          text-align: right
          color: #f62e2e;
        }
      }
    }

    .filtrate-modal-wrapper {
      position: absolute;
      top: 0;
      left: 10%;
      width: 90%;
      bottom: 0
      background: #fff;
      z-index: 900;
      transition: all 0.3s
      box-shadow: 0 0 30px 2px rgba(0, 0, 0, 0.2);

      .filtrate-container {
        width: 100%;
        height: 100%;
      }

      .filtrate-tit {
        font-weight: normal;
        height 40px
        line-height: 40px;
        padding-left: 10px
        box-shadow: 2px 0 15px 0 rgba(0, 0, 0, 0.1);
        z-index: 9;
        position: relative;
        display flex
        align-items center

        .address-name {
          flex-shrink 0;
          font-size: 12px;
          text-align: center
          color: $color-text-gray
          padding-right: 8px

          .text {
            vertical-align middle
            padding-right: 4px;
            display inline-block
            overflow: hidden
            text-overflow ellipsis
            white-space nowrap
            max-width 64px;
          }

          .arrow-down {
            vertical-align: middle
          }
        }

        .address-search {
          flex 1
          padding-right: 10px;
          position: relative

          .icon {
            font-size: 14px;
            text-rendering: auto;
            position: absolute
            left: 10px;
            top: 50%;
            transform translateY(-50%)
            color: $color-text-gray
            z-index 9
          }

          .search-wrapper {
            background: #f4f4f4;
            border-radius: 18px;
            padding-left: 30px;
            height: 30px;
            font-size: 14px;
            width: 100%;
            position: relative

            .search {
              background: #f4f4f4;
              padding-right: 10px;
              height 26px
              line-height 26px
              position: absolute
              left: 32px;
              transform translateY(-50%)
              top: 50%
              border-radius: 0;
              border: none;
              -webkit-appearance none
            }
          }
        }
      }

      .filtrate-content {
        position: absolute;
        top: 40px;
        bottom: 44px;
        width: 100%;
        overflow-y: auto
        -webkit-overflow-scrolling touch
      }

      .filtrate-btn {
        bdr-t()
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 44px;
        display: table;

        .reset, .u-confirm {
          display: table-cell;
          text-align: center;
          line-height: 44px;
          font-size: 16px;
          background: #fff;
        }

        .u-confirm {
          background: #f23031;
          color: #fff;
        }
      }
    }
  }

  .record-list-modal {
    .title {
      padding 11px 15px;
      position: relative
      z-index 9
      box-shadow: 2px 0 15px 0 rgba(0, 0, 0, 0.1);

      .icon {
        float: right
        font-size: 18px;
        color: #5b5b5b
      }
    }

    .record-list-modal-content {
      max-height 300px;
      min-height 200px
      overflow-y auto
      -webkit-overflow-scrolling: touch;
    }

    .record-item {
      color: #545454
      font-size: 14px;

      .record {
        display flex
        align-items center
        justify-content space-between
      }

      .record-award {
        display flex
        justify-content space-between
      }

      .record-price {
        flex-shrink 0
        text-align: right
        color: #333333;
        display flex

        .record-price-label {
          flex-shrink 0
        }

        .record-price-text {
          flex 1
          text-align: left;
        }

        .font-theme {
          color: $color-theme
        }
      }

      .record-date {
        padding: 5px 0;
        font-size: 12px;
        color: #999
      }

      .record-ouname {
        font-size: 12px;
        color: #999

        .tip {
          width 20px
          height 20px;
          text-align: center
          line-height: 20px;
          background: #f23031
          color: #fff;
          border-radius 50%
          font-size: 10px;
          vertical-align: middle
          margin-left: 5px;
          display inline-block
        }
      }
    }

  }

  .sign-default-instruction {
    background: #fff;
    padding 10px;

    .title {
      font-size: 14px;
      font-weight: 600
    }

    .content {
      padding-top: 6px;
      line-height: 20px;
      color: #999
    }
  }

  .no-data {
    padding 15px;
    text-align: center
    color: #999
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all .3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0)
  }

  @keyframes shake {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    50% {
      -webkit-transform: scale3d(1.08, 1.08, 1.08);
      transform: scale3d(1.08, 1.08, 1.08);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  /deep/ .sign-in-container .calendar-list .calendar-item[data-v-9b8bb57e] {
    /*display: flex;*/
    /*flex-direction: column-reverse;*/
    text-align: center;
  }

  .money {
    color #9c9c9c
    font-size 13px
  }
  .div {
    display flex;
    justify-content space-between
    font-size 14px;
    span:nth-child(2) {
      font-size 12px;
    }
    .num {
      input {
        width: 60px;
        background: #efefef;
        text-align: center;
        border-radius: 6px;
        padding: 7px 0;
        margin: 0 10px;
      }
      span {
        background: #666666;
        height: 25px;
        width: 25px;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        color: white;
        font-size: 24px;
      }
    }
  }
  .divs {
    span {
      margin: auto 0;
    }
  }
  .box {
    padding: 20px;
    margin: 15px 0;
    background: white;
    p {
      font-size: 16px;
      margin-bottom: 8px;
    }
    span {
      font-size 12px;
      line-height 20px;
      color #827e7e
    }
  }
  .box1 {
    display: flex;
    justify-content: space-between;
    span {
      font-size 16px;
      color black
    }
  }
  .div4 {
    position: fixed;
    display: flex;
    justify-content: space-between;
    margin-bottom 0
    bottom: 0;
    width: 100%;
    left: 0;
    p {
      font-size 16px
      margin auto 0

      .span1 {
        font-size 18px;
        font-weight 600
      }
    }

    .span2 {
      background: #deb98c;
      color: #fff;
      padding: 0 40px;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      border-radius: 6px;
    }
  }
  /deep/ .nav-content {
    overflow-y auto !important
    margin-bottom 70px;
  }
  .sign-in-container .calendar-list .colour {
    /*color #f23031*/
    color #000000
  }
  .sign-in-container .calendar-list .red {
    color: white;
    background: #deb98c;
  }
  .gray {
    background #efefef !important
  }
  .left-btn {
    left 30%;
  }
  .right-btn {
    right 30%
  }
</style>
