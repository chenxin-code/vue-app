<template>
 <div>
     <nav-top @backEvent="$router.go(-1)" title="选择时间">
      <div class="shareBox"></div>
    </nav-top>
    <nav-content>
       <span class="selectMoths" @click="changeTime">
          <span v-if="show">按月选择</span>
          <span v-else>按日选择</span>
          <van-icon name="exchange" />
        </span>
        <div style="width:100%;float: left" v-if="show">
          <div class="currentTimes">
          <span @click="showcurrentTime = true">{{time}}</span>
          <van-icon name="delete" @click="deleteData" />
        </div>
        </div>
        <div class="time" v-else>
            <span class="span" @click="showStartTime = true">{{time1}}</span>
            <span>至</span>
            <span class="span" @change="setColumnValue" @click="showEndTime = true">{{time2}}</span>
            <van-icon name="delete" @click="deleteData" />
        </div>
        <div class="answer theme_bg_red" @click="commit">完成</div>
      <van-popup position="bottom" v-model="showcurrentTime">
        <van-datetime-picker v-model="currentDate" @confirm="confirmACurrentTime"
        @cancel="showcurrentTime = false" type="year-month" :formatter="formatter" />
      </van-popup>
          <!--开始时间弹框-->
      <van-popup position="bottom" v-model="showStartTime">
        <van-datetime-picker
          v-model="currentDateStart"
          type="date"
          @confirm="confirmActivitesTime"
          @cancel="showStartTime = false"
          @change="setColumnValue"
        />
      </van-popup>
    <!--结束时间弹框-->
    <van-popup position="bottom" v-model="showEndTime">
      <van-datetime-picker
        v-model="currentDateEnd"
        type="date"
        @confirm="confirmEndTime"
        @cancel="showEndTime = false"
        @change="setColumnValue"
      />
    </van-popup>
    </nav-content>
 </div>
</template>
<script>
import util from "@/utils/util";
import eventBus from '@/utils/eventBus.js'
export default {
    data() {
        return {
           showcurrentTime: false,
           show: true,
           time1: "开始时间",
           time2: "结束时间",
           time: '选择时间',
           showStartTime: false, // 开始时间弹框
           showEndTime: false, // 结束时间弹框
           currentDateStart: new Date(), // 开始时间弹框内容
           currentDateEnd: new Date(), // 结束时间弹框内容
           currentDate: new Date()
        }
    },
    methods: {
      changeTime () {
        this.show = !this.show
        // if (this.show == true) { //按月选择
        //  this.showcurrentTime = true
        // } else { //按日选择
        //  this.showcurrentTime = true
        // }
      },
      confirmActivitesTime(value) {
      // 开始时间 确认按钮
      this.showStartTime = false;
      this.time1 = util.getPayTimemin(value) + ":00";
    },
    confirmEndTime(value) {
      // 结束时间 确认按钮
      this.showEndTime = false;
      this.time2 = util.getPayTimemin(value) + ":59";
    },
    deleteData() {
      this.time = '选择时间'
      this.time1 == '开始时间'
      this.time2 == '结束时间'
    },
    setColumnValue(index, value) {
      console.log(index);
      console.log(value);
      // 获取时间对应列中选中的值
      index = new Date();
      console.log(index);
    },
    confirmACurrentTime(value) {
      console.log(value)
      this.time = util.getMyMonth(value);
      console.log(this.time)
      this.showcurrentTime = false
    },
    commit() {
      this.$router.go(-1)
    },
      formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    },
     destroyed(){
      if (this.show) {
        eventBus.$emit('timeAggregate', {time1: this.time,queryTimeType: 2})
      } else {
        eventBus.$emit('timeAggregate', {time1: this.time1,time2: this.time2,queryTimeType : 1})
      }
      eventBus.$off('timeAggregate')
    }
}
</script>
<style lang="stylus">
  .selectMoths {
    padding: 0 12px;
    background: #f02c2e;
    border-radius: 15px;
    color: white;
    float: left;
    height 30px;
    line-height 30px
    margin: 10px 0 10px 20px;
    display flex
    /deep/ .van-icon {
      font-size: 16px !important;
      margin: auto 0 auto 5px;
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 98%;
    .van-icon {
      font-size 20px !important
      margin: auto 0;
    }
    .span {
      padding: 0px 5px;
      color: #6a6a6a;
      width: 130px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-bottom: 0.026667rem solid #dcdcdc;
    }

    span {
      margin: auto;
    }
  }
  .currentTimes {
    padding: 0px 10px;
    color: #6a6a6a;
    width: 130px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-bottom: 0.026667rem solid #dcdcdc;
    display: flex;
    margin: 0 auto;
    .van-icon {
      font-size 20px !important
      margin: auto;
    }
  }
  .answer {
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: white;
      font-size: 18px;

      a {
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: white;
        font-size: 18px;
      }
    }
</style>
