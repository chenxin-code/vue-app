/**Created by liaoyingchao on 2018/12/20.*/

<template>
  <div
    class="countdown"
    :class="{ quan: type == 'theme_bg_quan' }"
    :style="color == 'blue' ? 'color:#fff;' : ''"
  >
    <div
      :style="color == 'blue' ? 'color:#fff;background:none' : ''"
      class="red-div theme_font_white"
      :class="[type || 'grewColor']"
      v-show="d != 0 && !hiddenDay"
    >
      {{ d + "天" }}
    </div>
    <!-- <span :style="color == 'blue' ? 'color:#fff;background:none' :''" v-if="d != 0 && !hiddenDay">天</span> -->
    <div
      :style="color == 'blue' ? 'color:#fff;background:none' : ''"
      class="red-div theme_font_white"
      :class="[type || 'grewColor']"
    >
      {{ h === '0' ? '00' : h }}
    </div>
    <div class="point">:</div>
    <div
      :style="color == 'blue' ? 'color:#fff;background:none' : ''"
      class="red-div theme_font_white"
      :class="[type || 'grewColor']"
    >
      {{ m === '0' ? '00' : m }}
    </div>
    <div class="point">:</div>
    <div
      :style="color == 'blue' ? 'color:#fff;background:none' : ''"
      class="red-div theme_font_white"
      :class="[type || 'grewColor']"
    >
      {{ s === '0' ? '00' : s }}
    </div>
    <div class="text" v-if="isShowEndText">后结束</div>
  </div>
</template>

<script>
import countDownJs from "./js/index";

export default {
  name: "countdown",
  // 这里都传时间戳，方便计算
  props: ["endTime", "type", "hiddenDay", "color",'isShowEndText','background'], // 默认红色 type: className 秒杀倒计时样式
  components: {},
  data() {
    return {
      d: "0",
      h: "00",
      m: "00",
      s: "00",
      trigger: true,
    };
  },
  methods: {
    parsingTime: function () {
      if (this.endTime) {
        let curTime = this.$store.state.severTime.currentTime;
        let endTime = this.endTime;
        let vTime = endTime - curTime;
        this.d = 0;
        this.h = "0";
        this.m = "0";
        this.s = "0";
        if (vTime < 0) {
          // 没有剩余时间了
          // 1个时间周期只触发一次
          if (this.trigger) {
            this.trigger = false;
            setTimeout(() => {
              this.$emit("timeOut");
            }, 1000);
          }
        } else {
          this.trigger = true;
          if (vTime > 59) {
            this.s = vTime % 60;
            vTime = parseInt(vTime / 60);
            if (vTime > 59) {
              this.m = vTime % 60;
              vTime = parseInt(vTime / 60);
              if (vTime > 23) {
                this.h = parseInt(vTime % 24);
                vTime = parseInt(vTime / 24);
                this.d = vTime;
              } else {
                this.h = vTime;
              }
            } else {
              this.m = vTime;
            }
          } else {
            if (vTime >= 0) {
              this.s = vTime;
            }
          }
          if (this.h < 10) {
            this.h = "0" + this.h;
          }
          if (this.m < 10) {
            this.m = "0" + this.m;
          }
          if (this.s < 10) {
            this.s = "0" + this.s;
          }
        }
      }
    },
  },
  created() {
    this.parsingTime();
    countDownJs.heartbeat();
  },
  destroyed() {
    countDownJs.removeHeartbeat();
  },
  watch: {
    "$store.state.severTime.currentTime": function () {
      this.parsingTime();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.grewColor {
  background: #FD5B92;
}
.detail{
  background: #E6306D;
}
.list{
  background: #FD5B92;
}

.point {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 18px;
}

.text {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 18px;
}

.countdown {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d0021b;

  .red-div {
    // background: #FD5B92;
    border-radius: 5px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 18px;
    padding: 2px;
    margin: 0 5px;
  }

  &.quan {
    color: #C80902;

    .red-div {
      width: 26px;
      height: 26px;
      text-align: center;
      margin: 0 3px;
      border-radius: 24px;
      padding: 6px;
      font-size: 10px;
      color: white;
      background-color: #C80902;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.countdown :last-child{
  margin-right: 0;
}
.countdown :first-child{
  margin-right :0;
  margin-left :0;
}
</style>
