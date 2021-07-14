<template>
  <div class="housekeep-content">
    <times-nav-bar :title="$route.meta.title" @onBack="onBack" :fixed="true">
      <div slot="right" class="item-location" @click="onLocation">
        <img class="icon-location" :src="localLogo" alt="" />
        <span>{{ areaInfo.areasName }}</span>
      </div>
    </times-nav-bar>
    <div class="van-content">
      <van-tabs
        class="van-tabs-self"
        sticky
        @click="onTab"
        v-if="classStatusList.length > 1"
      >
        <van-tab
          v-for="(item, index) in classStatusList"
          :title="item.label"
          :key="index"
        >
          <div class="van-view">
            <template v-if="interfaceList && interfaceList.length > 0">
              <van-list
                v-model="loading"
                :finished="finished"
                finished-text="到底了"
                @load="onLoad"
              >
                <div class="classification-content">
                  <div class="classification-list">
                    <traveItemComponent
                      :item="item"
                      v-for="(item, index) in interfaceList"
                      :key="index"
                      @onTravelDetail="onTravelDetail"
                    />
                  </div>
                </div>
              </van-list>
            </template>
            <template v-else>
              <times-no-data top="50%" />
            </template>
          </div>
        </van-tab>
      </van-tabs>
      <div class="van-tabs-self van-tabs-other" v-else>
        <template v-if="interfaceList && interfaceList.length > 0">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="到底了"
            @load="onLoad"
          >
            <div class="classification-content">
              <div class="classification-list">
                <traveItemComponent
                  :item="item"
                  v-for="(item, index) in interfaceList"
                  :key="index"
                  @onTravelDetail="onTravelDetail"
                />
              </div>
            </div>
          </van-list>
        </template>
        <template v-else>
          <times-no-data top="50%" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import communal from "@/api/request/apiAddress/communal";
import traveItemComponent from "./components/travel-item-component.vue";
import zkApiService from "@/api/zkRequest/apiList";
export default {
  name: "housekeepListPage",
  components: {
    traveItemComponent
  },
  data() {
    return {
      //切换tab状态
      classStatus: 0,
      //上拉加载交易单
      finished: false,
      loading: false,
      //列表数据tab
      classStatusList: [],
      //分类表单
      categoryForm: {
        pageIndex: 1,
        pageSize: 10,
        businessType: 4,
        parentId: 1
      },
      //产品列表
      interfaceForm: {
        keyword: "",
        businessTypeId: 4,
        projectCommunityId: "",
        storeNo: "",
        categoryId: "",
        pageNum: 1,
        pageSize: 10,
        sortBy: "DESC"
      },
      interfaceList: [],
      interfaceData: {
        records: []
      },
      interfaceItem: {},
      localLogo: require("@assets/images/global/img_local_icon.png")
    };
  },
  async created() {
    // //获取传参
    // this.categoryForm.businessType = Number(
    //   this.$route.query.businessType || this.categoryForm.businessType
    // );
    // //获取1-3级分类标签
    // await this.getCategoryAllList();
    // //请求第一个Tab
    // this.onTab();
    // this.fetchDefaultAreas();
  },
  async activated() {
    this.interfaceData.records = [];
    this.interfaceList = [];
    //获取传参
    this.categoryForm.businessType = Number(
      this.$route.query.businessType || this.categoryForm.businessType
    );
    //获取1-3级分类标签
    await this.getCategoryAllList();
    try {
      await this.fetchDefaultAreas();
    } catch (error) {
      console.log(error);
    }
    //请求第一个Tab
    this.onTab();
  },
  computed: {
    //获取默认城市
    defaultAreaCity() {
      return this.$store.state.communal.defaultAreaCity;
    },
    //获取选择的小区
    selectArea() {
      return this.$store.state.communal.selectArea;
    },
    //展示的小区
    areaInfo() {
      return this.selectArea && this.selectArea.areasName
        ? this.selectArea
        : this.defaultAreaCity;
    }
  },
  methods: {
    //点击切换tab数据
    async onTab(item = this.classStatus) {
      console.log("onTab---->", item);
      const tab = Number(item);
      this.classStatus = tab;
      const cateGroryItem = this.classStatusList[tab];
      //请求分类列表数据
      this.interfaceForm = {
        ...this.interfaceForm,
        businessTypeId:
          this.$route.query.businessTypeId || this.interfaceForm.businessTypeId,
        categoryId: cateGroryItem.id,
        pageNum: 1,
        projectCommunityId: this.areaInfo.originalId
      };
      this.interfaceData.records = [];
      this.interfaceList = [];
      await this.productList(this.interfaceForm);
    },
    //点击列表详情
    onTravelDetail(item) {
      this.$router.push({
        path: "/travel/tourPage",
        query: {
          spuCode: item.spuCode,
          id: item.id,
          businessType: this.categoryForm.businessType,
          projectCommunityId: this.areaInfo.originalId
        }
      });
    },
    //请求完整分类
    async getCategoryAllList() {
      //1级分类
      const classStatusList = await this.getParentCategoryList(
        this.categoryForm
      );
      //2级分类
      let classStatusSecondList = [];
      for (let item of classStatusList) {
        const element = item;
        const classStatusList = await this.getParentCategoryList({
          ...this.categoryForm,
          parentId: element.id
        });
        classStatusSecondList = [...classStatusSecondList, ...classStatusList];
      }
      //3级分类
      let classStatusThreeList = [];
      for (let item of classStatusSecondList) {
        const element = item;
        const classStatusList = await this.getParentCategoryList({
          ...this.categoryForm,
          parentId: element.id
        });
        classStatusThreeList = [...classStatusThreeList, ...classStatusList];
      }
      this.classStatusList = classStatusThreeList.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
      this.interfaceItem = this.classStatusList[0];
      return Promise.resolve();
    },
    //查询分类
    getParentCategoryList(params) {
      return new Promise((resolve, reject) => {
        zkApiService.getCategoryList(params).then(res => {
          console.log("getCategoryList--->", res);
          resolve(res.data);
        });
      });
    },
    //查询分类
    productList(params) {
      return new Promise((resolve, reject) => {
        zkApiService.productList(params).then(res => {
          console.log("productList--->", res);
          const data = res.data;
          const records = [...this.interfaceData.records, ...data.records];
          this.interfaceData = {
            ...data,
            records: records
          };
          this.interfaceList = this.interfaceData.records;
          //只需要展示一个
          const total = data.total;
          const length = this.interfaceList.length;
          if (total > length) {
            this.loading = false;
            this.finished = false;
            this.interfaceForm.pageNum++;
          } else {
            this.loading = true;
            this.finished = true;
          }
          resolve(res.data);
        });
      });
    },
    //交易单异步更新数据
    onLoad() {
      // 异步更新数据
      this.productList(this.interfaceForm);
    },
    //点击详情
    onLocation() {
      this.$router.push({
        path: "/communal/communalListPage",
        query: {}
      });
    },
    //点击左侧菜单栏
    //返回上一页
    onBack() {
      window.history.back();
    },
    //获取默认城市地区
    fetchDefaultAreas() {
      return new Promise((resolve, reject) => {
        const params = {};
        communal
          .getDefaultAreas(params)
          .then(res => {
            console.log("getDefaultAreas--->", res);
            if (res.code == 200) {
              const data = res.data;
              this.$store.dispatch("communal/setdefaultAreaCity", data);
            } else {
              if (res.message) {
                this.$toast(res.message);
              }
            }
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.housekeep-content {
  .van-tabs-self {
    margin-top: 40px;
  }
  .van-tabs-other {
    margin-top: 60px;
  }
  .van-nav--self {
    .title {
      margin-left: 6px;
    }
  }
  .item-location {
    position: relative;
    min-width: 204px;
    height: 64px/2;
    .icon-location {
      display: block;
      width: 204px/2;
      height: 64px/2;
      position: absolute;
      top: 0;
      right: 0;
    }
    span {
      font-size: 12px;
      position: absolute;
      top: 5px;
      right: 40px;
      z-index: 2;
    }
  }
}
</style>
