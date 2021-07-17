<template>
  <div class="bottom theme_bg_white" v-if="visible">
    <div class="top_bg" v-if="notch"></div>
    <div
      class="top-nav"
      :style="{
        height: initData.barHeight + this.$market.getNavHeight(true) + 'px',
      }"
    >
      <div
        class="top-content"
        :style="{
          marginTop: initData.barHeight + 'px',
          height: this.$market.getNavHeight(true) + 'px',
        }"
      >
        <div
          class="back-div"
          v-if="getIsWechat()"
          style="padding: 12px"
          @click="backEvent"
        >
          <i
            class="iconfont mall-fanhui theme_font_black"
            style="font-size: 20px"
          ></i>
        </div>
        <div
          class="search-div theme_bg_white_f5"
          style="
            left: 50px;
            right: 50px;
            height: 30px;
            top: 7px;
            padding: 0 15px;
            border-radius: 15px;
          "
        >
          <i
            class="iconfont mall-sousuo theme_font_tint"
            style="font-size: 16px"
          ></i>
          <form class="search-input" action="" id="form">
            <input style="display: none" type="text" name="keyword" />
            <input
              id="searchInput"
              class=""
              type="search"
              :placeholder="
                initData.flag == false ? initData.text : '搜你想要的商品'
              "
              v-model="searchStr"
              @keyup.enter="searchgoods"
            />
          </form>
        </div>
        <div
          class="cancel-con theme_font_tint"
          style="padding: 12px; line-height: 20px; font-size:14px"
          @click="cancelBtn"
        >
          取消
        </div>
        <!--<div class="cancel-con" style="padding: 12px;line-height: 20px; color: #00f; font-size: 13px;" v-if="searchStr != ''"  @click="searchgoods">搜索</div>-->
      </div>
    </div>
    <div class="sortlist">
      <div
        class="row shadow-cell"
        v-for="(item, index) in sorts"
        v-if="item.sort.length > 0"
      >
        <div class="top-con">
          <span class="title theme_font_gray_i">{{ item.title }}</span>
          <i
            v-if="index == 0"
            class="iconfont mall-shanchu theme_font_gray_i"
            @click="clearRecordings"
          ></i>
        </div>
        <div class="namelist">
          <div
            class="name theme_bg_white_f5 theme_font_gray single-line"
            v-for="el in item.sort"
            @click="clickItem(el)"
          >
            {{ el }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../../../vuex/store";
import http from "@/utils/http";
import Loading from "@/components/Vendor/Loading/index";
import { mapMutations } from "vuex";

export default {
  name: "search",
  components: {},
  data() {
    return {
      initData: {
        barHeight: 20,
      },
      visible: false,
      searchEvent: null,
      searchStr: "",
      sorts: [
        {
          title: "最近搜索",
          sort: [],
        },
        {
          title: "热门搜索",
          sort: [],
        },
      ],
      notch:false,
    };
  },
  methods: {
    getIsWechat: function () {
      return store.state.webtype != 2;
    },
    backEvent: function () {
      this.searchEvent("");
    },
    searchgoods: function () {
      this.searchEvent(this.searchStr);
      store._mutations.setShowCategory[0](false);
    },
    cancelBtn: function () {
      //取消
      console.log("cancel");
      this.visible = false;
    },
    clearRecordings: function () {
      //清除
      console.log("clear");
      let item = this.sorts[0];
      item.sort = [];
      this.clearSearchHistory();
    },
    clickItem: function (el) {
      this.searchStr = el;
      this.searchEvent(this.searchStr);
      store._mutations.setShowCategory[0](false);
    },
    stopInput: function () {
      document.getElementById("searchInput").blur();
    },
    getHotSku: function () {
      Loading.open();
      let url = "/app/json/product/getHotSku";
      let params = {};
      this.$http.post(url, params).then(
        (res) => {
          Loading.close();
          let data = res.data;
          if (data.status == 0) {
            let arr = data.data;
            if (arr.length > 8) {
              //取前8个
              arr = arr.splice(0, 8);
            }
            if (arr.length > 0) {
              let item = this.sorts[1];
              item.sort = arr;
            }
          }
        },
        (error) => {
          Loading.close();
        }
      );
    },
    ...mapMutations(["setShowCategory"]),
  },
  created() {
    this.getHotSku();
    if(store.state.commonNotch){
      this.notch = true;
    }else{
      this.notch = false
    }
  },
  mounted() {
    let item = this.sorts[0];
    item.sort = this.initData.searchHistory;
    setTimeout(() => {
      document.getElementById("searchInput").focus();
    }, 200);
    if (this.initData.initClear) {
      this.searchStr = "";
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.top_bg {
  height: 0.933333rem;
  background-color:  #fff;
}

.bottom {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 199;
  overflow: hidden;

  .top-nav {
    overflow: hidden;

    .top-content {
      position: relative;
      width: 100%;

      .back-div {
        position: absolute;
        left: 0px;
        top: 0px;
        height: 100%;
        overflow: hidden;
      }

      .search-div {
        position: absolute;
        display: flex;
        align-items: center;

        .icon-font {
          font-size: $font-size-medium;
        }

        .search-input {
          flex: 1;
          margin-left: 10px;
          height: 100%;
          font-size: $font-size-medium;

          input {
            background: none;
            width: 100%;
            height: 100%;
          }
        }
      }

      .cancel-con {
        position: absolute;
        right: 0px;
        top: 0px;
        height: 100%;
        overflow: hidden;
      }
    }
  }

  .search {
    display: flex;
    align-items: center;

    .graybg {
      flex: 1;
      display: flex;
      align-items: center;
      height: 70px;
      border-radius: 20px;
      overflow: hidden;

      i {
        margin-left: 5px;
        font-size: 25px;
      }

      .search-input {
        margin-left: 10px;
        font-size: $font-size-medium-x;
      }
    }

    .cancel-con {
      margin-left: 20px;
      margin-right: 10px;
      font-size: $font-size-medium;
    }
  }

  .sortlist {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    /* background-color #4caf50 */
    .row {
      padding: 16px 10px;

      /* height 200px */
      .top-con {
        .title {
          font-size: $font-size-medium;
        }

        i {
          float: right;
          right: 6px;
          font-size: $font-size-medium;
        }
      }

      .namelist {
        overflow: hidden;

        /* margin-top 20px */
        .name {
          max-width: 100%;
          display: inline-block;
          padding: 4px 13px;
          margin-top: 10px;
          margin-right: 10px;
          border-radius: 10px;
          font-size: $font-size-medium;
        }
      }
    }
  }
}
</style>
