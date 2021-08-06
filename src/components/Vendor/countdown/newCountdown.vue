/**Created by liaoyingchao on 2018/12/20.*/

<template>
  <div class="countdown" :class="{ quan: type == 'theme_bg_quan' }">
    <div
      class="red-div theme_font_white"
      :class="[type || 'theme_bg_red']"
      v-if="d != 0 && !hiddenDay"
    >
      {{ d }}
    </div>
    <span v-if="d != 0 && !hiddenDay">天</span>
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">
      {{ h }}
    </div>
    :
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">
      {{ m }}
    </div>
    :
    <div class="red-div theme_font_white" :class="[type || 'theme_bg_red']">
      {{ s }}
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "countdown",
  // 这里都传时间戳，方便计算
  props: ["endTime", "type", "hiddenDay", "callback"], // 默认红色 type: className 秒杀倒计时样式
  components: {},
  data() {
    return {
      d: "0",
      h: "00",
      m: "00",
      s: "00",
      time: null,
      timeOut: 0,
    };
  },
  created() {
    this.timeOut = moment(this.endTime) - moment();
    this.getTime();
  },
  methods: {
    getTime() {
      this.time = setInterval(() => {
        this.timeOut = this.timeOut - 1000;
        if (this.timeOut <= 0) {
          clearInterval(this.time);
          this.d = "0";
          this.h = "00";
          this.m = "00";
          this.s = "00";
        } else {
          this.d = moment.duration(this.timeOut).days();
          this.h = moment.duration(this.timeOut).hours();
          this.m = moment.duration(this.timeOut).minutes();
          this.s = moment.duration(this.timeOut).seconds();
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
      }, 1000);
    },
  },
  mounted() {
    this.$once("hook:beforeDestroy", () => {
      console.log("beforeDestroy");
      console.log(this.time);
      if (this.time) {
        clearInterval(this.time);
      }
    });
  },
  // beforeDestroy() {
  //   console.log(this.time);
  //   if (this.time) {
  //     clearInterval(this.time);
  //   }
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.countdown {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .red-div {
    min-width: 20px;
    text-align: center;
    margin: 0 3px;
    border-radius: 3px;
    padding: 4px 2px;
    font-size: 10px;
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
</style>
