<template>
  <!-- 团购首页 -->
  <div id="page-purchase">
    <div class="header-x">
      <channelSearch></channelSearch>
    </div>
    <div class="section-x">
      <purchaseNav></purchaseNav>
      <div class="goodlist-wraper">
        <goodPanel
          v-for="(item, index) in 8"
          :key="index"
          class="lux"
        ></goodPanel>
      </div>
    </div>
  </div>
</template>
<script>
import channelSearch from "@/components/bulk/components/channelSearch";
import purchaseNav from "@/components/bulk/components/purchaseNav";
import goodPanel from "@/components/bulk/components/goodPanel";
export default {
  name: "purchase",
  components: {
    channelSearch,
    purchaseNav,
    goodPanel,
  },
  data() {
    return {
      goodsList: [
        {
          img:
            "https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=246823831,3207833213&fm=26&gp=0.jpg",
          name: "新鲜大西瓜",
          price: "20.82",
          purchasePrice: "18.82",
          alreadyNum: "18",
          remainNum: "2",
          remainPurchaseTime: "05:04:31",
          advantors: [
            {
              src:
                "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg",
            },
            {
              src:
                "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg",
            },
            {
              src:
                "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1429175118,2649084526&fm=111&gp=0.jpg",
            },
          ],
        },
      ],
    };
  },
};
</script>
<style scoped>
#page-purchase {
  width: 100%;
  height: 100vh;
  /* background:#B52232; */
  display: flex;
  flex-direction: column;
}
.header-x {
  height: 50px;
  background: #b52232;
}
.section-x {
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: auto;
}
.footer-x {
  height: 70px;
}
.goodlist-wraper {
  width: 100%;
  flex: 1;
  height: 0;
  overflow: auto;
  padding: 10px 10px;
  box-sizing: border-box;
  background: #f6f6f6;
  padding-bottom: 30px;
  box-shadow: 0px 1px 11px 3px rgba(231, 230, 230, 0.5);
}
.lux:nth-last-child(1)::after {
  background: none !important;
}
.lux:nth-last-child(1) {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.lux:first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.footer {
  width: 100%;
  height: 55px;
}
</style>