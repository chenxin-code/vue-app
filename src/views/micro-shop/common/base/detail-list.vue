
<template>
  <div class="detail-list">
    <div class="row theme_bg_white" v-for="(item, idx) in listData" :key="idx" @click="productEvent(item)" >{{dataProcessing(item)}}
      <div class="img-div">
        <img v-lazy="item.picMainUrl" />
        <span v-if="item.topFlag" class="topping font-small">置顶</span>
      </div>
      <div class="info-div">
        <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
        <!-- 微店 -->
         <div class="info-row price" v-if="!item.groupFlag">
          <div class="price-content">
            <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePrice)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePrice)}}</span>&nbsp;&nbsp;
            <span  class="theme_font_red theme_border_red act-item" v-if="styleObj.url != '/app/json/app_distribution_order/getMicroStorePros' && item.profit"  >
              <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
              <span>{{item.rewardType == 0 ? '¥':''}}{{item.profit || 0.00}} {{text(item.rewardType)}}</span>
            </span>
          </div>
        </div>
        <!-- 企业团购 -->
        <div class="info-row price" v-if="item.groupFlag">
          <div class="price-content">
            <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMin)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMin)}}</span>
            <span class="theme_font_red">~</span>
            <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMax)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMax)}}</span>
          </div>
        </div>
<!-- 选货市场 -->
        <div v-if="styleObj.rowStyle ==1 && !styleObj.btn">
          <!-- 微店 -->
          <div class="info-row num-info" v-if="!item.groupFlag">
            <div class="car-c">
              <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
              <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: rgb(206, 143, 39);" @click.stop="addToCart({})" ></i>
            </div>
          </div>
          <!-- 企业团购 -->
          <div class="info-row num-info space-between" v-if="item.groupFlag">
            <div>
              <span class="theme_font_red theme_border_red price-x act-item" v-if="styleObj.url != '/app/json/app_distribution_order/getMicroStorePros' && item.profitMax" >
                <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                 <span v-if="item.rebateModelEmp == 2">{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} {{text(item.rewardType)}}</span>
                 <span v-else>{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} ~ {{item.profitMax || 0.00}} {{text(item.rewardType)}}</span>
              </span>
            </div>
            <div>
              <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
              <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: rgb(206, 143, 39);" @click.stop="addToCart({})" ></i>
            </div>
          </div>
        </div>
<!-- 逛微店 -->
        <div class="info-row num-info space-between" v-if="styleObj.rowStyle ==2">
          <div class="font-small theme_font_tint">
            起购数量：{{item.minPurNumber || 0}}
          </div>
          <div>
            <i class="iconfont mall-gouwuche theme_font_red car-size" style="float: right;" @click.stop="addShopping(item)"  ></i>
          </div>
        </div>
<!-- 商品管理 -->
        <div v-if="styleObj.rowStyle ==3">
          <!-- 微店 -->
          <div class="info-row num-info" v-if="!item.groupFlag">
            <span v-if="item.isRecommend" class="theme_border_red theme_font_red act-item-t">推荐商品</span>
            <div class="car-c">
<!--              <span v-if="params.queryType == 1" style="width: 20px;height: 20px;float: right;"  @click.stop="addshareBtn(item)"><img style="width: 100%;height: 100%;"  src="../img/分享.png" alt=""></span>-->
              <span v-if="params.queryType == 1" style="width: 20px;height: 20px;float: right;" @click.stop="addshareBtn(item)"><i class="iconfont mall-gengduo more-icon theme_font_tint"></i></span>
              <van-icon v-if="params.queryType == 2" class="car-size" size="20px" name="upgrade" style="float: right;" @click.stop="upperShelf(item)" />
              <i v-if="params.queryType == 0" class="icon iconfont mall-shanchu car-size" style="float: right;" @click.stop="deleteShare(item)" ></i>
            </div>
          </div>
          <!-- 企业团购 -->
          <div class="info-row num-info space-between" v-if="item.groupFlag">
            <div>
              <span class="theme_font_red theme_border_red price-x act-item" v-if="styleObj.url != '/app/json/app_distribution_order/getMicroStorePros'" >
                <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                <span v-if="item.rebateModelEmp == 2">{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} {{text(item.rewardType)}}</span>
                 <span v-else>{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} ~ {{item.profitMax || 0.00}} {{text(item.rewardType)}}</span>
              </span>
            </div>
          </div>
          <div class="info-row num-info space-between" v-if="item.groupFlag">
            <div>
              <span class="theme_border_red theme_font_red act-item-t" v-if="item.isRecommend">推荐商品</span>
            </div>
            <div class="car-c">
              <span v-if="params.queryType == 1" style="width: 20px;height: 20px;float: right;" @click.stop="addshareBtn(item)"><i class="iconfont mall-gengduo more-icon theme_font_tint"></i></span>
              <van-icon v-if="params.queryType == 2" class="car-size" size="20px" name="upgrade" style="float: right;" @click.stop="upperShelf(item)" />
              <i v-if="params.queryType == 0" class="icon iconfont mall-shanchu car-size" style="float: right;" @click.stop="deleteShare(item)" ></i>
              <!-- <span v-if="params.queryType == 1" style="width: 20px;height: 20px;float: right;"  @click.stop="addshare(item)"><img style="width: 100%;height: 100%;" src="../img/分享.png" alt=""></span>
              <van-icon v-if="params.queryType == 2" class="car-size" size="20px" name="upgrade" style="float: right;" @click.stop="upperShelf(item)" />
              <i v-if="params.queryType == 0" class="icon iconfont mall-shanchu car-size" style="float: right;" @click.stop="deleteShare(item)" ></i> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueLazyLoad from "vue-lazyload";
import PriceOrder from "@/components/commonui/price/price-order";

export default {
  name: "detail-list",
  props: {
    listData: Array,
    hiddenCar: Boolean,
    showEdit: Boolean,
    styleObj: Object,
    params: Object
  },
  components: {
    PriceOrder
  },
  data() {
    return {
      // showActivities: ["团购", "领券", "积分兑换"],
    };
  },
  methods: {
    getInteger: function(price) {
      let str = this.$util.toDecimal2(price);
      let arr = str.split(".");
      return arr[0];
    },
    getDecimals: function(price) {
      let str = this.$util.toDecimal2(price);
      let arr = str.split(".");
      return arr[1];
    },
    getSkuNameStr: function(item) {
      let skuName = item.skuName;
      if (item.interfaceType == "2") {
        skuName =
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` +
          skuName;
      } else if (item.interfaceType == "1") {
        skuName =
          `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` +
          skuName;
      }
      return skuName;
    },
    itemSelect: function(item, idx) {
      item.selected = !item.selected;
      this.listData.splice(idx, 1, item);
      this.$emit("selectedItemEvent", item);
    },
    getShowPrice: function(item) {
      if (
        (item.activityPrice == 0 || item.activityPrice == "") &&
        (item.points == "" || !item.points)
      ) {
        return false;
      } else {
        return true;
      }
    },
    dataProcessing: function(item) {
      // 数据，尤其是价格，需要做初始化处理
      // 全局价格处理
      let dpedData = this.$mallCommon.priceFromItem(item);
      item.dpedData = dpedData;
      // 展示活动
      let showActivities = [];
      if (item.activityTypes) {
        for (let i = 0; i < item.activityTypes.length; i++) {
          let text = item.activityTypes[i];
          let activityTag =
            item.activityTags.length > i ? item.activityTags[i] : "";
          if (
            !~showActivities.indexOf(text) &&
            activityTag.indexOf("不显示") == -1
          ) {
            showActivities.push(text);
          }
        }
      }
      item.showActivities = showActivities;
    },
    productEvent: function(item) {
      this.$emit("productEvent", item);
    },
    addToCart: function(item) {
      this.$emit("addToCart", item);
    },
    addshareBtn: function(item) {
      this.$emit("addshare", item);
    },
    addShopping: function(item) {
      this.$emit("addShopping", item);
    },
    deleteShare: function(item) {
      this.$emit("deleteShare", item);
    },
    upperShelf(item) {
      this.$emit("upperShelf", item);
    },
    text(rewardType) {
      // 3 积分 8 油滴 9 豌豆 12 元
      let text = "";
      if (rewardType == 3) {
        text = "积分";
      } else if (rewardType == 8) {
        text = "油滴";
      } else if (rewardType == 9) {
        text = "豌豆";
      } else if (rewardType == 0) {
        text = "元";
      }
      return text;
    }
  },
  created() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
@import './css/price.styl';

.detail-list {
  padding: 0 8px;
  overflow: hidden;
  // height: 500px;
  // overflow-y: auto;
  // -webkit-overflow-scrolling: touch;
  .space-between {
    display: flex;
    justify-content: space-between;
    /*align-items: center;*/
  }
  .row {
    margin-top: 8px;
    padding: 8px;
    overflow: hidden;
    border-radius: 6px;

    .img-div {
      float: left;
      position: relative;
      width: 120px;
      height: 120px;

      img {
        width: 100%;
        height: 100%;
      }
      .topping {
        border-radius 20px
        padding: 3px 10px
        display: block;
        position: absolute;
        top: 0px
        left: 0px
        background-color: red
        color #fff
      }
    }

    .info-div {
      padding: 0 10px;
      overflow: hidden;

      .title {
        padding: 1px 0;
        margin: 5px 0;
        font-size: $font-size-medium;
        line-height: 18px;
        height: 36px;
      }
      .act-item {
        border-width 1px
        border-style solid
      }
      .act-item-t {
        padding 2px 4px;
        font-size 12px;
        border-radius 10px;
        border-width 1px
        border-style solid
      }
      .info-row {
        padding: 9px 0 5px;
      }

      .num-info {
        padding-top: 8px;
        /*padding-bottom: 0;*/

        .car-c {
          float: right;
          margin-top: -3px;
        }

        .car-size {
          padding: 5px;
          font-size: 18px;
        }

        span:nth-child(2) {
          /*margin-left: 10px;*/
        }

        .wish-icon-c {
          extend-click();

          .wish-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;

            &:last-child {
              display: none;
            }
          }

          &.is-add-wish {
            .wish-icon {
              display: none;
            }

            .wish-icon:last-child {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
