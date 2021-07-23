/**Created by liaoyingchao on 2018/10/23.*/

<template>
  <div class="category">
    <nav-top :noTitle="true" :noBack="!hasBack" @backEvent="$router.go(-1)">
      <div
        class="search-div theme_bg_white_f5"
        style="left: 50px; right: 50px; height: 30px; top: 7px; padding: 0 15px; border-radius: 15px;"
        @click="toSearchEvent"
      >
        <i class="iconfont mall-sousuo theme_font_tint" style="font-size: 20px;font-size: 16px;"></i>
        <span class="theme_font_tint" style="font-size: 14px;margin-left: 10px;">搜你想要的商品</span>
      </div>
    </nav-top>
    <nav-content>
      <div ref="leftScroll" class="left-div theme_bg_white_f5" @scroll="scrollEvent">
        <div
          class="cat-div"
          :class="{theme_bg_white_i: selectedId == idx}"
          v-for="(item, idx) in category"
          @click="categoryEvent(idx)" :key="idx"
        >
          <div
            class="title-div theme_font_gray"
            :class="{'theme_standard_bdr_i theme_font_black_i title-div-selected': selectedId == idx}"
          >{{item.name}}</div>
        </div>
      </div>
      <div ref="rightScroll" class="right-div" @scroll="scrollEvent">
        <SubPage :divKeywords="subDivKeywords" v-if="subPageRefresh"></SubPage>
        <div class="sub-right-div">
          <div class="block-div" v-for="(item, idx) in subCategories" :key="`subCategories${idx}`">
            <div class="title-row theme_font_black">
              <div class="title">{{item.name}}</div>
              <div
                class="more-btn theme_standard_font"
                v-if="item.clsType != 0"
                @click="toProductList(item, 2)"
              >
                <span>全部</span>
                <i class="iconfont mall-gengduojiantou more-size"></i>
              </div>
            </div>
            <div
              class="s-cate"
              v-for="(subItem, cIndex) in item.childList"
              @click.stop="toProductList(subItem, 3)" :key="`childList${cIndex}`">
              <div class="cate-img">
                <img :src="subItem.phUrl" />
              </div>
              <div class="cate-name single-line theme_font_black">{{subItem.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
    <AdPage :pageAdKeywords="'AD_Key_Categories'"></AdPage>
  </div>
</template>

<script>
import Search from "@/components/mall2/common/search";
import SubPage from "@/components/product/index/subpage/subpage";
import AdPage from "@/components/product/index/subpage/adpage";

export default {
  name: "category",
  props: {
    hasBack: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SubPage,
    AdPage
  },
  data() {
    return {
      category: [],
      selectedId: 1,
      subCategories: [],
      scrollTopValue1: 0,
      scrollTopValue2: 0,
      subDivKeywords: "",
      subPageRefresh: false
    };
  },
  methods: {
    scrollEvent: function() {
      this.scrollTopValue1 = this.$refs.leftScroll.scrollTop;
      this.scrollTopValue2 = this.$refs.rightScroll.scrollTop;
    },
    toSearchEvent: function() {
      Search.open({
        initData: {
          barHeight: this.$store.state.barHeight,
          searchHistory: this.$store.state.mall2.searchHistory
        },
        clearSearchHistory: () => {
          this.$store.state.mall2.searchHistory = [];
        },
        searchEvent: searchStr => {
          Search.close();
          console.log(searchStr);
          if (searchStr == "") {
            return;
          }
          this.$mallCommon.pushSearchHistory(searchStr);
          // this._loadProList()
          let path = "/recommend-commodity/skuList";
          this.$router.push({
            path: path,
            query: {
              lastPath: this.$route.path,
              searchKey: searchStr
            }
          });
        }
      });
    },
    categoryEvent: function(idx) {
      if (idx == 0) {
        let path = "/recommend-commodity/skuList";
        this.$router.push({
          path: path,
          query: {
            lastPath: this.$route.path
          }
        });
        return;
      }
      this.selectedId = idx;
      this.subDivKeywords = this.$market.getCategorySubPageKey(
        this.category[idx].id
      );
      this.subPageRefreshEvent();
      this.subCategories = this.category[idx].childList;
      this.$refs.rightScroll.scrollTop = 0;
    },
    subPageRefreshEvent: function() {
      this.subPageRefresh = false;
      this.$nextTick(() => {
        this.subPageRefresh = true;
      });
    },
    toProductList: function(item, cateLevel) {
      let cateId = item.id;
      let path = "/recommend-commodity/skuList";
      this.$router.push({
        path: path,
        query: {
          category: cateId,
          categoryName: item.name,
          cateLevel: cateLevel,
          clsType: item.clsType,
          lastPath: this.$route.path
        }
      });
    },
    _loadProCateList: function(id) {
      // this.$Loading.open();
      let url = "/app/json/product/getAppProCategoryList";
      let paramsData = {
        token: this.$store.state.login.token
      };
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.category = [
              {
                name: "全部分类",
                id: "",
                childList: [
                  {
                    name: "全部分类",
                    id: ""
                  }
                ]
              }
            ];
            for (let i = 0; i < data.data.list.length; i++) {
              this.category.push(data.data.list[i]);
            }
            // this.category = data.data.list;

            if (this.category.length > 1) {
              this.selectedId = 1;
              this.subCategories = this.category[1].childList;
            }
            // _this.proCateList = data.data.rows;
            // let item = this.proCateListTwo[this.nowIndex]
            // item.subList = data.data.rows;
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    }
  },
  created() {
    this._loadProCateList("0");
  },
  activated() {
    console.log("categories activated");
    console.log(this.scrollTopValue1);
    console.log("categories activated");
    if (this.scrollTopValue1 > 0) {
      this.$refs.leftScroll.scrollTop = this.scrollTopValue1;
    }
    console.log(this.$refs.leftScroll.scrollTop);
    if (this.scrollTopValue2 > 0) {
      this.$refs.rightScroll.scrollTop = this.scrollTopValue2;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != '商品列表') {
      this.$keepaliveHelper.deleteCache(this)
      this.scrollTopValue1 = 0
      this.scrollTopValue2 = 0
    }
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.category {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left-div {
    height: 100%;
    width: 90px;
    float: left;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .cat-div {
      padding: 10px 0;

      .title-div {
        margin: 6px 0;
        border-left-width: 4px;
        border-color: transparent;
        border-style: solid;
        font-size: $font-size-medium;
        text-align: center;
      }

      .title-div-selected {
        font-weight: 500;
        font-size: $font-size-medium-x;
      }
    }
  }

  .right-div {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .sub-right-div {
      padding: 0 8px 0 10px;
      overflow: hidden;

      .block-div {
        box-shadow: 0 1px 8px #efefef;
        margin-bottom: 8px;
        border-radius: 8px;
        padding: 5px 4px;
        overflow: hidden;

        .title-row {
          font-size: $font-size-small;
          font-weight: 600;
          display: flex;
          align-items: center;
          padding: 4px 0px 0;
          height: 25px;
          line-height: 25px;

          .title {
            flex: 1;
          }

          .more-btn {
            padding: 8px 0;

            .more-size {
              font-size: $font-size-medium-x;
            }
          }
        }

        .s-cate {
          padding: 6px 0px 10px;
          width: 33.3%;
          float: left;

          .cate-img {
            position: relative;
            margin-left: 15%;
            width: 70%;
            padding-bottom: 70%;

            img {
              position: absolute;
              display: block;
              left: 0px;
              top: 0px;
              width: 100%;
              height: 100%;
            }
          }

          .cate-name {
            font-size: $font-size-small-s;
            padding: 10px 5px 0px 5px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
