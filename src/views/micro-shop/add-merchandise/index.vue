
<template>
  <div class="list">
    <nav-top :noTitle="true" @backEvent="backEvent">
      <div class="search-div microSearch" v-if="getPutaggregate.empFlag == 0 && getGlobalConfig.microshop_open == 1">
        <div class="region" @click="toRegion">
          <span style="display: flex;align-items: center">{{ouName}}&nbsp;<van-icon name="arrow-down" /> </span>
        </div>
      </div>
      <div class="search-div theme_bg_white_f5 microSearch" @click="toSearchEvent" v-else>
        <i class="iconfont mall-sousuo theme_font_tint microSearchI"></i>
        <span class="theme_font_tint microSearchSpan">{{!!searchKey ? searchKey : '输入你想要的商品名称'}}</span>
      </div>
      <div class="right-btn microBtn" @click="listStyleEvent">
        <i class="iconfont mall-datubiao theme_font_common microBtnI" v-if="styleObj.listStyle"></i>
        <i class="iconfont mall-qiehuan theme_font_common microBtnI" v-if="!styleObj.listStyle"></i>
      </div>
    </nav-top>
    <nav-content>
      <div class="search-box" v-if="getPutaggregate.empFlag == 0 && getGlobalConfig.microshop_open == 1">
        <div class="search-div theme_bg_white_f5 microSearch" @click="toSearchEvent">
          <i class="iconfont mall-sousuo theme_font_tint microSearchI"></i>
          <span class="theme_font_tint microSearchSpan">{{!!searchKey ? searchKey : '输入你想要的商品名称'}}</span>
        </div>
      </div>
      <!-- <div class="row">
        <div
          class="type-btn"
          :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"
          @click="selectedTypeEvent(item.tag)"
          v-for="(item,index) in deliveryTypes"
          :key="index"
        >
          <i
            class="iconfont theme_font_common icon-size"
            :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"
          ></i>
          <span
            class="theme_font_common"
            :class="{theme_standard_font_i: selectedType == item.tag}"
          >{{item.text}}</span>
        </div>
      </div> -->
      <div class="all-content">
        <list
          ref="listDate"
          @productEvent="productEvent"
          @addToCart="addToCart"
          :params="params"
          :styleObj="styleObj"
          :screenArr="screenArr"
        ></list>
      </div>
    </nav-content>
    <merchant v-if="isMerchant" @closeEvent='closeEvent'/>
  </div>
</template>

<script>
import Search from "@/components/mall2/common/search";
import PullTo from "@/components/Vendor/vue-pull-to/vue-pull-to";
import merchant from './common/merchant.vue'
import list from "../common/list";
import {mapState, mapGetters } from "vuex";
 import Scroll from '@/components/base/scroll/scroll'

const PARAMS = {
  isJsonData: true,
  page: 0,
  rows: 10,
  skuName: "",
  priceMin: "",
  priceMax: "",
  profitMin: "",
  profitMax: "",
  orderType: "", // 1上架时间  2利润  3价格
  sortWay: "" //排序方式 ASC升序   DESC降序
};
export default {
  name: "add",
  components: {
    PullTo,
    list,
    Scroll,
    merchant
  },
  computed: {
    ...mapGetters(["getPutaggregate",'getGlobalConfig','userInfo'])
  },
  data() {
    return {
      isMerchant: false,
      deliveryTypes: [
        {
          text: "配送",
          fontclass: "mall-peisong",
          tag: "2"
        },
        {
          text: "自提",
          fontclass: "mall-ziti",
          tag: "1"
        }
      ],
      params: {
        isJsonData: true,
        page: 1,
        rows: 20,
        skuName: '',
        priceMin: "",
        priceMax: "",
        profitMin: "",
        profitMax: "",
        ouCode: '',
        // deliverType: '2',
        groupFlag: this.$route.query.groupFlag,
        orderType: 1, // 1上架时间  2利润  3价格
        sortWay: "ASC", //排序方式 ASC升序   DESC降序
        classStaLevel: "",
        classStaId: ""
      },
      ouName: '',
      screenArr: [
        {
          name: "上架时间",
          type: 1,
          default: 1,
          allScreen: true,
          typeText: "sortWay",
          sort: "orderType",
          classStaLevel: "classStaLevel",
          classStaId: "classStaId",
          priceLow: "priceMin",
          priceHigh: "priceMax",
          profitMin: "profitMin",
          profitMax: "profitMax"
        },
        { name: "利润", type: 2 },
        { name: "价格", type: 3 }
      ],
      styleObj: {
        listStyle: true,
        rowStyle: 1,
        isObject: 0,
        activityList: false,
        isHeight: "94",
        url: "/app/json/micro_store_front_end/getProSkuListToAddMicroStore"
      },
      loading: false,
      listData: [],
      searchKey: "",
      selectedType: 2
    };
  },
  created(){
    this.$request.post('/app/json/micro_store_front_end/queryMerchantList').then(res => {
      let data = res.data
      if (res.status === 0) {
        let list = data || []
        if (list.length) {
          this.ouName = list[0].ouName
          this.params.ouCode = list[0].ouCode
        }
      } else {
        this.$toast(res.info)
      }
    })
    if (this.getPutaggregate.empFlag == 0 && this.getGlobalConfig.microshop_open == 1) {
      this.styleObj.isHeight = '86'
    } else {
      this.styleObj.isHeight = '94'
    }
  },
  methods: {
    backEvent() {
      this.$keepaliveHelper.deleteCache(this)
      this.$router.go(-1);
    },
    toSearchEvent() {
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
          this.$mallCommon.pushSearchHistory(searchStr);
          this.searchKey = searchStr;
          this.params.page = 0;
          this.params.skuName = searchStr;
        }
      });
    },
    selectedTypeEvent(tag) {
      // this.selectedType = tag;
      // this.$store.state.mall2.staticDeliverType = tag
      // this.params.deliverType = tag;
    },
    listStyleEvent() {
      this.styleObj.listStyle = !this.styleObj.listStyle;
    },
    productEvent(product) {
      console.log(product)
      let path = "/micro_sho/detail/" + this.$util.getDataString();
      if (product.productType == 2){
        path = '/micro_sho/ticket_detail';
      }
      if (product.groupFlag) {
        path = "/micro_sho/purchasedetail/" + this.$util.getDataString();
      }
      this.$router.push({
        path: path,
        query: {
          id: product.id,
          skuId: product.skuId,
          storeOuCode: product.storeOuCode,
          lastPath: this.$route.path,
          deliveryType: product.deliverType,
          productType: product.productType,
          profit: product.profit,
          proSkuDistributionId: product.proSkuDistributionId,
          listData: product
        }
      });
    },
    addToCart(item) {
      // 添加
      this.$Loading.open();
      this.$http
        .post("/app/json/app_distribution_order/addProToMicroStore", {
          skuId: item.skuId,
          storeId: this.getPutaggregate.id
        })
        .then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            this.$Toast("添加成功!");
            this.$refs.listDate.setItem(item);
          } else {
            this.$Toast(res.data.info);
          }
        });
    },
    toRegion() {
      this.isMerchant  = true
    },
    closeEvent(item) {
      this.isMerchant  = false
      if (item) {
        this.ouName = item.ouName
        this.params.ouCode = item.ouCode
        // this.$refs.listDate.setData(this.params);
      }
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.search-box {
  padding 2px 10px 10px
}
.list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../../../../static/image/microShop/list-bg.png') repeat center center / 100% 100%;

  .microSearch {
    left: 50px;
    right: 50px;
    height: 30px;
    top: 7px;
    padding: 6px 15px;
    border-radius: 15px;

    .microSearchI {
      font-size: 16px;
    }
    .region {
      width: 100%;
      display flex
      justify-content center
      font-size: 14px;
    }
    .microSearchSpan {
      font-size: 14px;
      margin-left: 10px;
    }
  }

  .microBtn {
    right: 0px;
    height: 44px;
    top: 0px;
    padding-right: 10px;

    .microBtnI {
      font-size: 24px;
    }
  }

  .all-content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    box-shadow 0px -2px 2px #efefef
    border-radius 10px
    // margin-top 8px
  }
}
.row {
  display: flex;
  padding: 10px 14px;

  .type-btn {
    font-size: $font-size-medium;
    padding: 4px 10px;
    border-radius: 15px;
    border: 0.6px solid transparent;

    .icon-size {
      font-size: $font-size-medium;
    }
  }
}
</style>
