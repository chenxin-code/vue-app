/**Created by liaoyingchao on 2020-08-21.*/

<template>
  <div class="datetime-picker" v-show="visible" @click="visible = false">
    <div class="picker-body" @click.stop="clickStop">
      <div class="tools line_bottom">
        <div class="btn-cancel theme_font_gray" @click="cancelEvent">取消</div>
        <div class="title">{{options.title || '请选择时间'}}</div>
        <div class="btn-sure theme_font_red" @click="sureEvent">确定</div>
      </div>
      <div class="picker-content">
        <div class="date-list">
          <div class="list" :style="{height: '280px', transform: `translate(0px, ${dateTransform}px) translateZ(0px)`}" @touchmove="listTouchMove($event, 'date')" @touchend="listTouchEnd('date')">
            <div class="item" style="line-height: 40px;" v-for="(item, idx) in dateList" :class="{'active': idx == dateSelected}" :key="idx" @click="selectEvent(idx, 'date')">{{item.label}}</div>
          </div>
        </div>
        <div class="time-list">
          <div class="list" :style="{height: '280px', transform: `translate(0px, ${timeTransform}px) translateZ(0px)`}" @touchmove="listTouchMove($event, 'time')" @touchend="listTouchEnd('time')">
            <div class="item" style="line-height: 40px;" v-for="(item, idx) in timeList" :class="{'active': idx == timeSelected}" :key="item.label" @click="selectEvent(idx, 'time')">{{item.label}}</div>
          </div>
        </div>
        <div class="mid-div line_top line_bottom" style="height: 40px;margin-top: -20px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../../utils/util'

  export default {
    name: "datetime-picker",
    components: {},
    data() {
      return {
        visible: false,
        options: {
          beginDate: null, // date 类型,开始时间
          dates: 15, // 选择多少天之内的时间
          beginTime: null, // 开始时间 最小 0
          spaceHours: 1, // 间隔时间
          endTime: 24, // 结束时间 最大 24
        },
        dateList: [],
        timeList: [],
        dateTransform: 120,
        timeTransform: 120,
        dateSelected: 0,
        timeSelected: 0,
        preLocal: '',
        hasTouchMove: false,
        selectedDateTime: null, // 回调函数，回参 date， time
      }
    },
    methods: {
      // 确定按钮点击事件
      sureEvent: function () {
        this.visible = false
        if (this.selectedDateTime) {
          let date = this.dateList[this.dateSelected]
          let time = this.timeList[this.timeSelected]
          this.selectedDateTime(date, time)
        }
      },
      // 取消按钮点击事件
      cancelEvent: function () {
        this.visible = false
      },
      // click stop
      clickStop: function () {

      },
      //时间戳格式化 年-月-日 星期*
      getDateAndDays(date) {
        let oYear = date.getFullYear(),
          oMonth = date.getMonth() + 1,
          oDay = date.getDate()

        let days = date.getDay();

        switch(days) {
          case 1:
            days = '星期一';
            break;
          case 2:
            days = '星期二';
            break;
          case 3:
            days = '星期三';
            break;
          case 4:
            days = '星期四';
            break;
          case 5:
            days = '星期五';
            break;
          case 6:
            days = '星期六';
            break;
          case 0:
            days = '星期日';
            break;
        }
        let oTime = oYear + '-' + util.getzf(oMonth) + '-' + util.getzf(oDay);
        return {
          label: oTime + ' ' + days,
          dateStr: oTime
        };
      },
      // 格式化时间
      getTimeStr: function (time) {
        let iNum = Math.floor(time)
        let dNum = time - iNum
        let min = Math.floor(dNum * 60)
        return util.getzf(iNum) + ':' + util.getzf(min)
      },
      // ：时间 转 .时间
      timeForPointNum: function (time) {
        let arr = time.split(':')
        if (arr.length == 2) {
          let h = arr[0]
          let m = arr[1]
          return parseInt(h) + m / 60
        }
      },
      // 初始化数据
      initData: function () {
        let dt = this.options.beginDate || new Date()
        let dates = this.options.dates || 15
        this.dateList = []
        this.timeList = []

        while (dates > 0) {
          dates --;
          let cdt = new Date(dt)
          let ddic = this.getDateAndDays(cdt)
          this.dateList.push({
            date: cdt,
            label: ddic.label,
            dateStr: ddic.dateStr
          })
          dt = cdt.setDate(cdt.getDate()+1);
        }

        let beginTime = this.timeForPointNum(this.options.beginTime || '0:00')
        let spaceHours = this.options.spaceHours || 1
        let endTime = this.timeForPointNum(this.options.endTime || '24:00')
        while (beginTime < endTime) {
          this.timeList.push({
            time: beginTime,
            label: this.getTimeStr(beginTime)
          })
          beginTime += spaceHours
        }
      },
      // 列表 touch move 事件
      listTouchMove: function (event, type) {
        if (event.touches.length == 1) {
          let clientY = event.touches[0].clientY
          if (this.preLocal != '') {
            let mv = this.preLocal - clientY
            this.moveEvent(mv, type)
          }
          this.preLocal = clientY
        }
      },
      // 列表 touch end 事件
      listTouchEnd: function (type) {
        this.preLocal = ''
        this.moveEndEvent(type)
      },
      // 滚动事件
      moveEvent: function (mv, type) {
        this.hasTouchMove = true
        if (type == 'date') {
          this.dateTransform -= mv
          // 滚动同时选中
          this.dateSelected = this.scrollSelected(this.dateTransform)
        } else {
          this.timeTransform -= mv
          this.timeSelected = this.scrollSelected(this.timeTransform)
        }
      },
      // 滚动结束
      moveEndEvent: function (type) {
        if (this.hasTouchMove == false) {
          // 没有移动过就不触发这个
          return ;
        }
        this.hasTouchMove = false
        if (type == 'date') {
          this.dateSelected = this.getEndSelected(this.dateTransform, this.dateList.length)
          this.scrollTo(120 - this.dateSelected * 40, this.dateTransform, type)
        } else {
          this.timeSelected = this.getEndSelected(this.timeTransform, this.timeList.length)
          this.scrollTo(120 - this.timeSelected * 40, this.timeTransform, type)
        }
      },
      // list scroll to 动画
      scrollTo: function (to, old, type) {
        let step = (to - old) / 10
        // step 小于5，将其设置为5，保留正负
        if (Math.abs(step) < 5) {
          step = step / Math.abs(step) * 5;
        }
        let tm = setInterval(() => {
          if (Math.abs(to - old) < Math.abs(step)) {
            old = to
            clearInterval(tm)
            tm = null
          } else {
            old += step
          }
          if (type == 'date') {
            this.dateTransform = old
          } else {
            this.timeTransform = old
          }
        }, 10)
      },
      // 滚动时的选中位置
      scrollSelected: function (posy) {
        posy -= 120
        let selectedNum = -Math.round(posy / 40)
        if (selectedNum * 40+posy > -10 && selectedNum * 40+posy < 10) {
          return selectedNum
        }
        return -1
      },
      // 根据滚动结束位置计算最近的选项
      getEndSelected: function (posy, maxLen) {
        posy -= 120
        let selectedNum = -Math.round(posy / 40)
        if (selectedNum < 0) {
          selectedNum = 0
        } else if (selectedNum > maxLen - 1) {
          selectedNum = maxLen - 1
        }
        return selectedNum
      },
      // 点击选中列表的某项
      selectEvent: function (idx, type) {
        if (this.hasTouchMove == true) {
          // 如果移动过就不触发这个
          return ;
        }
        if (type == 'date') {
          this.dateSelected = idx
          this.scrollTo(120 - this.dateSelected * 40, this.dateTransform, type)
        } else {
          this.timeSelected = idx
          this.scrollTo(120 - this.timeSelected * 40, this.timeTransform, type)
        }
      }
    },
    mounted() {
      // 初始化数据
      this.initData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .datetime-picker {
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    z-index 1999
    background-color: rgba(0, 0, 0, 0.4);
    .picker-body {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      background-color white;
      .tools {
        display flex;
        align-items center;
        .title {
          font-size 16px;
          flex 1;
          text-align center;
        }
        .btn-cancel, .btn-sure {
          font-size 14px;
          padding 10px;
          line-height 20px;
        }
      }
      .picker-content {
        position relative;
        padding 0 10px;
        display flex;
        align-items center;
        overflow hidden;
        .mid-div {
          position absolute;
          z-index 1;
          top 50%;
          left 0;
          right 0;
          pointer-events: none;
        }
        .date-list, .time-list {
          flex 1;
          .list {
            .item {
              font-size 14px;
              text-align center;
              &.active {
                font-size 16px;
                font-weight 500;
              }
            }
          }
        }
      }
    }
  }
</style>
