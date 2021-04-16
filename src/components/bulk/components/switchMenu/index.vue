<template>
  <div class="component-switchMenu">
    <div
      class="menu-item-x"
      v-for="(item, index) in nav"
      :key="index"
      @click="toPage(item)"
    >
      <img :src="routePath == item.url ? item.src : item.nosrc" alt="" />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "switchMenu",
  data() {
    return {
      nav: [
        {
          name: "活动",
          src: require("./activity.png"),
          nosrc: require("./activityno.png"),
          url: "/bulk_index",
        },
        {
          name: "订单",
          src: require("./order.png"),
          nosrc: require("./orderno.png"),
          url: "/bulk_order_list",
        },

        {
          name: "售后",
          src: require("./saleafter.png"),
          nosrc: require("./saleafterno.png"),
          url: "/bulk_after_sales",
        },
        {
          name: "营收状态",
          src: require("./profit.png"),
          nosrc: require("./profitno.png"),
          url: "/myprofit",
        },
      ],
    };
  },
  methods: {
    toPage(item) {
      if (this.$route.path == item.url) {
        return;
      } else {
        this.$router.push(item.url);
      }
    },
  },
  computed: {
    routePath: {
      get() {
        switch (this.$route.path) {
          case "/bulk_index":
            return "/bulk_index";
            break;
          case "/bulk_order_list":
            return "/bulk_order_list";
            break;
          case "/bulk_after_sales":
            return "/bulk_after_sales";
            break;
          case "/myprofit":
            return "/myprofit";
            break;
          default:
            return "/bulk_index";
            break;
        }
      },
      set() {},
    },
  },
};
</script>
<style>
.component-switchMenu {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 10px 28.5px 10px 36px;
  /* height: 49px; */
  box-sizing: border-box;
}
.menu-item-x {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666666;
}
.menu-item-x img {
  width: 22px;
  height: 22px;
}
.menu-item-x span {
  margin-top: 5.5px;
  font-size: 9px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 12.5px;
}
</style>
