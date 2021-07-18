<template>
  <!-- 团购首页 -->
  <div id="page-purchase">
    <div class="header-x">
      <channelSearch @searchFun="funSearch"></channelSearch>
    </div>
    <div class="section-x">
      <purchaseNav @navToMsg="navToMsg"></purchaseNav>
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
            <van-cell style="height: auto; padding: 16px 0 0;background:#f6f6f6;">
              <goodPanel
                v-for="(item, index) in saleDataList"
                :key="index"
                class="lux"
                :resouce="item"
              >
              </goodPanel>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 团长入口 -->
    <div
      v-if="entrance"
      class="entrance-tuanzhang"
      @click="$router.push({ path: '/bulk_index' })"
    >
      <img src="../activity/images/pintuan.png" />
    </div>
  </div>
</template>
<script>
import appLocalstorage from "@zkty-team/x-engine-module-localstorage";
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
      communityId: "",
      categoryId: "",
      page: 1,
      pageSize: 10,
      wrapperHeight: 0,
      saleDataList: [],
      isLoading: false,
      loading: false,
      finished: false,
      offset: 15,
      entrance: false,
      searchText: "",
    };
  },
  created() {
    this.$http
      .get("/app/json/group_buying_head_info/findSelfInfo")
      .then((res) => {
        if (res.data.result == "success") {
          this.entrance = true;
        }
      });
    if (this.$store.state.webtype == "2" || this.$store.state.webtype == "3") {
      this.$store.state.communityId = this.$store.state.projectId;
      this.communityId = this.$store.state.projectId;
      console.log("res-------------------", this.communityId);
    } else {
      // this.communityId = "2248412888374968908";
      // this.communityId = "2252994639227258048";
      appLocalstorage
        .get({
          key: "LLBProjectId",
          isPublic: true,
        })
        .then((res) => {
          this.communityId = res.result;
          this.$store.state.communityId = this.communityId;
          console.log("res-------------------", JSON.stringify(res));
        });
    }
    this.communityId = "2248412888374968908";
    this.$store.state.communityId = this.communityId;
  },
  mounted() {
    this.$nextTick(() => {
      this.wrapperHeight =
        document.getElementsByClassName("goodlist-wraper")[0].offsetHeight;
    });
    setTimeout(() => {
      this.getList(1);
    }, 100);
  },
  methods: {
    /*tab切换*/
    navToMsg(data) {
      this.saleDataList = [];
      this.categoryId = data.id;
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.getList(1);
    },
    /**
     *  下拉刷新方法
     */
    onRefresh() {
      this.saleDataList = [];
      this.loading = true;
      this.finished = false;
      this.isLoading = true;
      this.page = 1;
      this.saleDataList = [];
      this.getList(1);
    },
    /**
     *  上拉加载方法
     *  页面打开时初始化会调用onLoad方法 如果想去掉初始化调用使用,给List添加属性immediate-check=false
     */
    onLoad() {
      // 调用请求数据方法
      this.loading = true;
      if (!this.finished) {
        this.getList();
      }
    },
    funSearch(val) {
      this.searchText = val;
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.saleDataList = [];
      this.getList(1, "search");
    },
    /**
     *  请求数据方法
     */
    getList(pages, isSearch) {
      //   if (!pages) this.page++;
      //   if (pages) this.page = page;
      let { page } = this;
      let url = `/app/json/groupbuying_sku_index_app/index?communityId=${this.communityId}&categoryId=${this.categoryId}&skuName=${this.searchText}&pageIndex=${this.page}&pageSize=${this.pageSize}`;
      this.$http
        .get(url)
        .then((res) => {
          this.loading = false;
          this.isLoading = false;
          if (res.data.result == "success") {
            if (page < res.data.totalPages || page == res.data.totalPages) {
              res.data.data.map((item, index) => {
                item.groupbuySkuPicurl = item.groupbuySkuPicurl.split(",");
                if (item.avatarList.length > 3)
                  item.avatarList = item.avatarList.slice(0, 3);
              });
              this.saleDataList =
                isSearch == "search"
                  ? res.data.data
                  : this.saleDataList.concat(res.data.data);
              this.page++;
              if (page == res.data.totalPages) {
                this.finished = true;
              }
            } else {
              this.finished = true; //如果超过总页数就显示没有更多内容了
            }
          } else {
            this.refreshing = false;
            this.error = true; //加载错误状态
          }
        })
        .catch((e) => {
          this.loading = false;
          this.refreshing = false;
          this.error = true; //加载错误状态
        });
    },
  },
};
</script>
<style lang="stylus" scoped>
#page-purchase {
  width: 100%;
  height: 100vh;
  /* background:#B52232; */
  display: flex;
  flex-direction: column;
}

.header-x {
  // height: 56px;
  // background: #FF7BA6;
  // padding-top: 10px;
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
  padding: 0px 15px 16px;
  box-sizing: border-box;
  background: #f6f6f6;
  /* padding-bottom: 30px; */
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

.entrance-tuanzhang {
  width: 78px;
  height: 78px;
  position: fixed;
  left: 0px;
  bottom: 16%;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
