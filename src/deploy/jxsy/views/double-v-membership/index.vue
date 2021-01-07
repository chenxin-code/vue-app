
<template>
  <div class="box">
    <nav-top @backEvent="backEvent">{{isDisplay}}</nav-top>
    <opening v-if="isDisplay == 1" @checkTwo='checkTwo'/>
    <opened v-if="isDisplay == 2" :statusObj="statusObj" />
  </div>
</template>
<script>
import mixin from "./mixin";
export default {
  name: "home",
  mixins: [mixin],
  components: {
    opened: () => import("./opened/index.vue"),
    opening: () => import("./opening/index.vue")
  },
  data() {
    return {
      statusObj: {
        isEffect:  true
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    this.$keepaliveHelper.deleteCache(this)
    next()
  },
  mounted() {
    this.checkTwoVMemmber()
  },
  methods: {
    checkTwo() {
      this.checkTwoVMemmber();
    },
    backEvent() {
      this.$keepaliveHelper.deleteCache(this);
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /deep/ .list-wrapper {
    background: none;
  }

  /deep/ .nav-content {
    width: 100%;
    background-color: #fafbfd;
  }

  /deep/ .mark {
    height: 60px;
    width: 60px;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../../../../../static/image/double-v-membership/bg@2x.png') repeat center center / 100% 100%;

    >:first-child {
      color: #fff;
      font-size: 13px;
      display: block;
      margin-top: 6px;
      transform: rotate(-45deg);
    }
  }

  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /deep/ .popupCard {
    height: 26%;
    flex-direction: column;
    line-height: 26px;

    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .popupCardBtn {
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;

      >* {
        width: 115px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ebc695;
      }

      >:first-child {
        border-radius: 30px 0 0 30px;
      }

      >:last-child {
        background-color: #ebc695;
        border-radius: 0 30px 30px 0;
      }
    }
  }
}
</style>
