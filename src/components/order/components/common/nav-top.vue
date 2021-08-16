<!--
 * @Description: 这是***页面
 * @Date: 2021-08-16 10:52:04
 * @Author: shuimei
 * @LastEditTime: 2021-08-16 14:07:14
-->
<template>
  <div
    :style="{ '--status-height': statusHeight, '--nav-height': navHeight }"
    class="total-content"
  >
    <div class="nav" ref="navHeightRefs">
      <van-nav-bar
        :title="title"
        :left-text="navLeftName"
        :right-text="navRightName"
        @click-left="onBack"
        @click-right="goPage"
        left-arrow
      >
      </van-nav-bar>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import device from "@zkty-team/x-engine-module-device";
export default {
  name: "navBar",
  props: {
    title: {
      type: String,
      default: ""
    },
    navLeftName: {
      type: String,
      default: ""
    },
    navRightName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      statusHeight: "20px",
      navHeight: "0px"
    };
  },
  beforeCreate() {
    return device
      .getStatusHeight({
        __event__: () => void 0
      })
      .then(({ content }) => {
        this.statusHeight = content + "px";
        console.log(`statusHeight`, content);
      });
  },
  mounted() {
    setTimeout(() => {
      this.navHeight = this.$refs.navHeightRefs.offsetHeight + "px";
    }, 150);
  },
  methods: {
    onBack() {
      this.$emit("backEvent");
    },
    goPage() {
      this.$emit("navToPage");
    }
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
$nav-left-title = 17px;
$nav-right-title = 14px;
$nav-color = #333333;
.nav {
  width: 100%;
  position: fixed;
  top: 0px;
  justify-content: space-between;
  background: #ffffff;
  padding-top: calc(var(--status-height) + 10px);
  z-index: 11;
  box-sizing: border-box;
  /deep/.van-nav-bar {
    .van-nav-bar__content {
      .van-nav-bar__left {
        .van-icon-arrow-left {
          color: $nav-color;
          font-size: 20px;
        }
      }
      .van-nav-bar__text {
        font-size: $nav-left-title;
        color: $nav-color;
        font-weight: 500;
        font-family: "PingFangSC-Medium";
      }
      .van-nav-bar__right {
        .van-nav-bar__text {
          font-size: $nav-right-title;
        }
      }
    }

  }
}
</style>
