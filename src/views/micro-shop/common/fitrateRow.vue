
<template>
  <div class="box">
    <div class="filter theme_font_black" @click="filterEvent('')" v-if="rowBtn[0].allScreen">
      <i class="iconfont mall-datubiao filter-size-1 theme_font_black"></i>
      <span>{{skuName}}</span>
    </div>
    <div
      class="filter-btn theme_font_black"
      @click="filterEvent(item.type)"
      v-for="(item,index) in rowBtn"
      :key="index"
    >
      <span :class="{theme_standard_font_i: params.orderType === item.type}">{{item.name}}</span>
      <div v-show="params.orderType === item.type">
        <i
          class="iconfont mall-sanjiaoxiabiao arrow-icon theme_font_tint"
          :class="{theme_standard_font_i: params.sort == 'ASC'}"
        ></i>
        <i
          class="iconfont mall-xiala arrow-icon theme_font_tint"
          :class="{theme_standard_font_i: params.sort == 'DESC'}"
        ></i>
      </div>
    </div>
    <div class="filter-btn theme_font_black" @click="superFilter" v-if="rowBtn[0].allScreen">
      <span>筛选</span>
      <i class="iconfont mall-shaixuan filter-size theme_font_tint"></i>
    </div>
    <AllCategory
      v-show="showAllCategory"
      @closeEvent="showAllCategory = false"
      @cateEvent="cateEvent"
    ></AllCategory>
    <Filtrate
      @filtrateEvent="filtrateEvent"
      @closeEvent="closeEvent"
      :category="category"
      :screenArr="screenArr"
      v-show="showCreated"
    ></Filtrate>
  </div>
</template>

<script>
import Filtrate from "./filtrate.vue";
import AllCategory from "@/components/mall2/list/category/all-categories";
export default {
  name: "filtrateRow",
  props: {
    screenArr: {
      type: Array,
      required: false,
      default: []
    }
  },
  data() {
    return {
      isType: this.screenArr.length ? this.screenArr[0].default : 0,
      skuName: "全部分类",
      showAllCategory: false,
      showCreated: false,
      category: "",
      params: {
        sort: "ASC",
        orderType: this.screenArr.length ? this.screenArr[0].default : 0
      },
      objData: {},
      rowBtn: this.screenArr
    };
  },
  methods: {
    cateEvent(item) {
      this.skuName = item.name;
      this.showAllCategory = false;
      this.$emit(
        "setData",
        Object.assign({}, this.objData, {
          classStaLevel: item.cateLevel,
          classStaId: item.id
        })
      );
    },
    filterEvent(type) {
      if (type !== "") {
        this.params.orderType = type;
        if (this.isType == type) {
          this.params.sort = this.params.sort == "ASC" ? "DESC" : "ASC";
        } else {
          this.params.sort = "ASC";
          this.isType = type;
        }
        this.params.page = 0;
        if (this.rowBtn.length) {
          let typeText = this.rowBtn[0]["typeText"];
          let sort = this.rowBtn[0]["sort"];
          (this.objData[typeText] = this.params.sort),
            (this.objData[sort] = this.params.orderType),
            this.$emit("setData", this.objData);
        }
      } else {
        this.showAllCategory = true;
      }
    },
    superFilter() {
      this.showCreated = true;
    },
    filtrateEvent(filtrateData) {
      let priceLow = this.rowBtn[0]["priceLow"];
      let priceHigh = this.rowBtn[0]["priceHigh"];
      let profitMin = this.rowBtn[0]["profitMin"];
      let profitMax = this.rowBtn[0]["profitMax"];
      this.objData[priceLow] = filtrateData.priceMin;
      this.objData[priceHigh] = filtrateData.priceMax;
      this.objData[profitMin] = filtrateData.profitMin;
      this.objData[profitMax] = filtrateData.profitMax;
      this.$emit("setData", Object.assign({}, this.objData));
      this.showCreated = false;
    },
    closeEvent() {
      this.showCreated = false;
    }
  },
  components: {
    Filtrate,
    AllCategory
  }
};
</script>
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.box {
  display: flex;
  .filter{
    width 80px
    line-height 30px
    display flex
    align-items center
  }

  .filter-btn {
    padding: 7px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    .arrows {
      display: inline;
    }

    .arrow-icon {
      margin-top: -4px;
      margin-bottom: -4px;
      display: block;
      font-size: 12px;
    }

    .filter-size {
      font-size: 17px;
    }

    .filter-size-1 {
      font-size: 14px;
      padding: 2px 3px 0px;
    }

    span {
      font-weight: 500;
    }
  }
}
</style>
