<template>
  <!-- 团购首页 -->
  <div id="page-purchase">
    <div class="header-x">
      <channelSearch></channelSearch>
    </div>
    <div class="section-x">
      <purchaseNav></purchaseNav>
      <div class="goodlist-wraper">
        <van-pull-refresh
          v-model="isLoading"
          @refresh="onRefresh"
          :style="{ height: wrapperHeight + 'px', overflow: 'auto' }"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :offset="offset"
            class="content"
          >
            <van-cell>
              <goodPanel
                v-for="(item, index) in saleDataList"
                :key="index"
                class="lux"
              ></goodPanel>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <!-- <goodPanel
          v-for="(item, index) in 8"
          :key="index"
          class="lux"
        ></goodPanel> -->
      </div>
    </div>
  </div>
</template>
<script>
import channelSearch from "@/components/bulk/components/channelSearch";
import purchaseNav from "@/components/bulk/components/purchaseNav";
import goodPanel from "@/components/bulk/components/goodPanel";
import Vue from "vue";
import { PullRefresh, Toast, List, Cell } from "vant";
Vue.use(PullRefresh).use(Toast).use(List).use(Cell);
export default {
  name: "purchase",
  components: {
    channelSearch,
    purchaseNav,
    goodPanel,
  },
  data() {
    return {
      wrapperHeight: 0,
      saleDataList: [],
      list: [],
      isLoading: false,
      loading: false,
      finished: false,
      offset: 15,
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
  mounted() {
    this.$nextTick(() => {
      this.wrapperHeight = document.getElementsByClassName(
        "goodlist-wraper"
      )[0].offsetHeight;
    });
     this.getList();
  },
  methods: {
    /**
     *  下拉刷新方法
     */
    onRefresh() {
      // 调用请求数据方法
      this.getList();
    },
    /**
     *  上拉加载方法
     *  页面打开时初始化会调用onLoad方法 如果想去掉初始化调用使用,给List添加属性immediate-check=false
     */
    onLoad() {
      // 调用请求数据方法
      this.getList();
    },
    /**
     *  请求数据方法
     */
    getList() {
      setTimeout(() => {
        this.list = [{}, {}, {}, {}, {}, {}];
        this.saleDataList = this.saleDataList.concat(this.list);
        this.loading = false;
        this.isLoading = false;
        if (this.saleDataList >= 100) {
          this.finished = true;
        }
        console.log("加载");
      }, 1000);
    },
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