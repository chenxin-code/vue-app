<template>
  <!-- // created by hjc  -->
  <!-- 首页顶部新增类目 -->
  <div class="category" :style="{ backgroundColor: bgColor }" v-if="!$store.state.isPreview && !isPreview">
    <div class="categoryList" ref="categoryList">
      <div
        class="categoryItem"
        v-for="(item, index) in categoryList"
        :key="index"
        @click="navToSearch(item, index)"
      >
        <div
          class="categoryName"
          :class="item.id == currentSelect ? 'select' : ''"
          :style="{ color: textColor }"
          :ref="'category' + index"
        >
          {{ item.name }}
        </div>
        <img
          :src="
            $route.name == '新首页'
              ? require('./images/selectIcon.png')
              : $route.name == '商品列表'
              ? require('./images/selectIconRed.png')
              : ''
          "
          v-show="item.id == currentSelect"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "category",
  props: ["category", "NoCategory", "domIndex"],
  data() {
    return {
      categoryList: [],
      currentSelect: 0,
      isPreview:false,
    };
  },
  created() {
    this.$http.post("/app/json/product/getAppProCategoryList").then((res) => {
      this.categoryList = res.data.data.list;
      this.categoryList.unshift({
        clsType: "",
        id: 0,
        cateLevel: "",
        name: "推荐",
        parentId: "",
        phUrl: "",
        sort: "",
      });

      if (this.domIndex) {
        this.$nextTick(() => {
          this.$refs.categoryList.scrollTo(
            this.$refs["category" + this.domIndex][0].offsetLeft - 20,
            0
          );
        });
      } else if (this.NoCategory && this.$route.name == "商品列表") {
        this.$nextTick(() => {
          this.$refs.categoryList.scrollTo(
            this.$refs["category" + "1"][0].offsetLeft - 20,
            0
          );
        });
      }

      if (this.NoCategory && this.$route.name == "商品列表" && !this.$route.query.searchKey) {
        this.$emit("toggle", this.categoryList[1].id);
        this.currentSelect = this.categoryList[1].id;
      }
      if (this.category) {
        this.currentSelect = this.category;
      }
    });

    this.$route.query.isPreview?this.isPreview = true:this.isPreview = false;
  },
  mounted() {},
  components: {},
  methods: {
    navToSearch(item, index) {
      this.currentSelect = item.id;

      this.$sensors.track("mall_tab_click", {
        which_page:this.$route.name,
        page_path:this.$route.path,
        tab_name: item.name,
        tab_id: item.id,
        url: item.id == 0?"/common":"/mall2/list",
        tab_rank: index+1,
      })

      if (item.id == 0) {
        this.$router.push("/common");
      } else {
        if (this.$route.name == "新首页") {
          let path = "/mall2/list/" + this.$util.getDataString();
          this.$router.push({
            path,
            query: {
              category: item.id,
              cateLevel: 1,
              domIndex: index,
            },
          });
        } else if (this.$route.name == "商品列表") {
          this.$emit("toggle", item.id);
        }
      }

    },
    ...mapMutations(["setShowCategory"]),
  },
  computed: {
    bgColor: {
      get() {
        switch (this.$route.name) {
          case "商品列表":
            return "#ffffff";
          case "新首页":
            this.currentSelect = 0;
            this.setShowCategory(true);
            return "#f44981";

          default:
            return "#f44981";
        }
      },
      set() {},
    },
    textColor: {
      get() {
        switch (this.$route.name) {
          case "商品列表":
            return "#f74440";
          case "首页":
            this.setShowCategory(true);
            this.currentSelect = 0;
            return "#ffffff";

          default:
            return "#ffffff";
        }
      },
      set() {},
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.category {
  width: 100%;
  height: 50px;
  // background-color: #FB3C3C;
  padding: 0 18px;
  display: flex;
  align-items: center;

  // overflow-y: auto;
  // position: relative;
  .categoryList {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    height: 100%;

    // position: absolute;
    // left: 0;
    // top: 0;

    // padding-top: 10px;
    .categoryItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      white-space: nowrap;
      height: 100%;

      .categoryName {
        font-size: 16px;
        font-weight: 300;
        // color: #FFFFFF;
      }

      img {
        width: 12px;
        height: 6px;
        margin-top: 4px;
      }

      .select {
        font-size: 18px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #FFFFFF;
      }
    }
  }
}
</style>

