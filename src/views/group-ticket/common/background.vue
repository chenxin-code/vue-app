<template>
  <div class="background">
    <div class="background-btn">
      <span @click="linkTo">我的拼团</span>
      <span @click="rules">活动规则</span>
    </div>
    <!--倒计时-->
    <div class="count-down-wrapper" v-if="groupDetail.state == 2 || groupDetail.state == 9" :style="`top:${$store.state.webtype == 2?'116':'90'}px`">
    <!-- <div class="count-down-wrapper" v-if="groupDetail.state == 2 || groupDetail.state == 9" style="top:90px"> -->
      <span class="count-down-label">成团倒计时</span>
      <div v-if="groupDetail.endTime">
        <countdown
          :endTime="groupDetail.endTime ? this.$util.getDateFromString(groupDetail.endTime) : ''"
          type="theme_bg_black"
          @timeOut="timeOut"
        />
      </div>
    </div>
  </div>
</template>

<script>
import countdown from "@/components/Vendor/countdown/countdown";

export default {
  props: {
    groupDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  components: {
    countdown
  },
  mounted() {},
  methods: {
    rules() {
      this.$router.push({
        path: "/group_ticket/rules"
      });
    },
    linkTo() {
      this.$router.push({
        path: "/group_ticket/my_vouchers"
      });
    },
    timeOut() {
      this.$emit("timeOut");
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.background {
  height: 160px;
  display: flex;
  flex-direction: row-reverse;
  background: url('../image/banner下@2x.png') repeat center center / 100% 100%;

  .background-btn {
    width: 70px;
    height: 50px;
    display: flex;
    margin-top: 10px;
    flex-direction: column-reverse;
    justify-content: space-between;

    span {
      width: 100%;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 10px 0 0 10px;
      background-color: rgba(0, 0, 0, 0.13);
    }
  }

  .count-down-wrapper {
    color: #fff;
    position: absolute;
    left: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
