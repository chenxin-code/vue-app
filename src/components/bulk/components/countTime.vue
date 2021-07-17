/**Created by liaoyingchao on 2018/12/20.*/

<template>
  <div class="goodPanel-remain">
    <div class="remain_title">{{ timeText }}</div>
    <div class="remain-times" v-if="timeText != '活动已结束'">
      <van-count-down
        :time="getCountdownTime()"
        :auto-start="true"
        @finish="finish"
      >
        <template #default="timeData">
          <span v-if="timeData.days != 0">
            <span class="block">{{ timeData.days }}</span>
            <span class="colon">天:</span>
          </span>
          <span class="block">{{ timeData.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.seconds }}</span>
        </template>
      </van-count-down>
    </div>
  </div>
</template>

<script>
export default {
  name: "countDown",
  props: {
    endTime: {
      type: [String],
    },
  },
  components: {},
  data() {
    return {
      timeText: "距离结束还剩:",
    };
  },
  created() {},
  methods: {
    getTimeTitle() {
      let nowT = new Date().getTime();
      let endT = this.$util.getDateFromString(this.endTime) * 1000;
      if (nowT < endT) {
        this.timeText = "距离结束还剩:";
      } else {
        this.timeText = "活动已结束";
      }
    },
    getCountdownTime() {
      let nowT = new Date().getTime();
      let endT = this.$util.getDateFromString(this.endTime) * 1000;
      if (nowT < endT) {
        return endT - nowT;
      } else {
        this.getTimeTitle();
      }
    },
    finish() {
      this.getTimeTitle();
    },
  },
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.goodPanel-remain {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
}

.goodPanel-remain .remain_title {
  font-size: 13px;
  font-weight: 400;
  color: #d0021b;
  line-height: 18.5px;
  letter-spacing: 1px;
}

.remain-times {
  margin-left: 10.5px;
}

.colon {
  display: inline-block;
  margin: 0 4px;
  color: #ee0a24;
}

.block {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 17px;
  background: #d0021b;
  border-radius: 3.5px;
  font-size: 11px;
  font-weight: 400;
  color: #ffffff;
  line-height: 15px;
  letter-spacing: 1px;
}
</style>
