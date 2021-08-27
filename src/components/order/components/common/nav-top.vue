<!--
 * @Description: 这是***页面
 * @Date: 2021-08-16 10:52:04
 * @Author: shuimei
 * @LastEditTime: 2021-08-27 11:38:15
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
        <template #right>
          <van-popover
            v-if="showPopoverTemp"
            v-model="showPopover"
            trigger="click"
            :actions="actions"
            @select="onSelect"
            placement="bottom-end"
            class="nav-popover"
          >
            <template #reference>
              <div class="more" @click="showPopover = true">
                <img :src="moreIcon" alt="" />
                <span>更多</span>
              </div>
            </template>
          </van-popover>
        </template>
      </van-nav-bar>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import device from "@zkty-team/x-engine-module-device";
import navToMicroApplication from "@zkty-team/x-engine-module-router";
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
    },
    showPopoverTemp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusHeight: "20px",
      navHeight: "0px",
      showPopover: false,
      actions: [
        { text: "历史缴费记录", name: "history" },
        { text: "发票查询", name: "invoice" }
      ],
      moreIcon: require("../../img/more-icon.png")
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
    //跳转微应用
    navToMicroapp(microappUri, microappPath, isHideNavbar) {
      navToMicroApplication.openTargetRouter({
        type: "microapp",
        uri: microappUri, // 微应用包名
        path: microappPath, // 微应用具体路由
        hideNavbar: isHideNavbar
      });
    },
    onSelect(action) {
      if (action.name === "history") {
        this.navToMicroapp(
          "com.times.microapp.AppcPrepay",
          "/bill/index",
          false
        );
      } else if (action.name === "invoice") {
        this.navToMicroapp("com.times.microapp.AppcInvoice", "/", true);
      }
    },
    onBack() {
      this.$emit("backEvent");
    },
    goPage() {
      if (this.showPopoverTemp) {
        this.showPopover = true;
      } else {
        this.$emit("navToPage");
      }
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
  height: var(--nav-height);
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
  .nav-popover {
    .more {
      img {
        height 12px
        width 12px
      }
      span {
        margin-left: 4px;
      }
    }
  }
}
</style>
