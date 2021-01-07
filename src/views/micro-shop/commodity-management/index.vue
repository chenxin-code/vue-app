<template>
  <div class="list">
    <!-- <nav-top @backEvent="backEvent" title="商品管理"></nav-top> -->
    <nav-top :noTitle="true" @backEvent="backEvent">
      <!-- <div class="search-div microSearch" v-if="getPutaggregate.empFlag == 0 && getGlobalConfig.microshop_open == 1">
        <div class="region" @click="toRegion">
          <span style="display: flex;align-items: center">{{ouName}}&nbsp;<van-icon name="arrow-down" /> </span>
        </div>
      </div> -->
      <div class="search-div theme_bg_white_f5 microSearch" @click="toSearchEvent">
        <i class="iconfont mall-sousuo theme_font_tint microSearchI"></i>
        <span class="theme_font_tint microSearchSpan">{{!!searchKey ? searchKey : '输入你想要的商品名称'}}</span>
      </div>
      <!-- <div class="right-btn microBtn" @click="listStyleEvent">
        <i class="iconfont mall-datubiao theme_font_common microBtnI" v-if="styleObj.listStyle"></i>
        <i class="iconfont mall-qiehuan theme_font_common microBtnI" v-if="!styleObj.listStyle"></i>
      </div> -->
    </nav-top>
    <nav-content>
      <div class="main">
        <div class="row">
          <div>
            <div
              class="type-btn"
              :class="{theme_light_bg: selectedType == item.tag, theme_standard_bdr_i: selectedType == item.tag}"
              @click="selectedTypeEvent(item.tag)"
              v-for="(item,index) in deliveryTypes"
              :key="index">
              <i
                class="iconfont theme_font_common icon-size"
                :class="[item.fontclass, {theme_standard_font_i: selectedType == item.tag}]"
              ></i>
              <span
                class="theme_font_common"
                :class="{theme_standard_font_i: selectedType == item.tag}"
              >{{item.text}}</span>
            </div>
          </div>
          <div class="type-btn" @click="isRecommendBtn" v-if='getPutaggregate.empFlag == 1'>
            <van-icon :name="isRecommend ? 'arrow-up':'arrow-down'" style="margin-right: 4px;margin-top: -3px;vertical-align:middle;"/><span>{{recommendText}}</span>
          </div>
        </div>
        <div class="screen">
          <div
            v-for="(screenItem,screenIndex) in screenArr"
            :key="screenIndex"
            class="btn"
            :class="{theme_standard_font_i: screenType == screenItem.type}"
            @click="screenBtn(screenItem)"
          >{{`${screenItem.name}（${screenItem.number}）`}}</div>
        </div>
        <list
          ref="list"
          @productEvent="productEvent"
          @addshare="addshareBtn"
          @listData="listData"
          @upperShelf="upperShelf"
          @deleteShare="deleteShare"
          :params="params"
          :styleObj="styleObj"
        ></list>
      </div>
    </nav-content>
    <!-- 分享 -->
    <Share v-if="popupShow" :shareObj="shareObj" @setshareData="setshareData" @qRcodeStstus='qRcodeStstus'/>
    <van-action-sheet
    v-model="isRecommend"
    :actions="actions"
    @select="onSelect"
  />
    <van-action-sheet
      v-model="isThreePoints"
      :actions="threePointsArr"
      @select="onSelectPoints"
    />
  </div>
</template>

<script>
import list from "../common/list";
import Share from "../common/share.vue";
import { mapGetters } from "vuex";
import Search from "@/components/mall2/common/search";
export default {
  name: "shop-preview",
  components: {
    list,
    Share
  },
  computed: {
    ...mapGetters(["getPutaggregate",'getGlobalConfig'])
  },
  data() {
    return {
      actions: [
        {
          name: '全部商品',
          value: ''
        },
        {
          name: '自主商品',
          value: '2'
        },
        {
          name: '推荐商品',
          value: '1'
        }
      ],
      itemAddshare: {},
      isThreePoints: false,
      threePointsArr: [],
      threePointsArrQB: [
        {
          name: '商品分享',
          value: '1'
        }
      ],
      threePointsArrZD: [
        {
            name: '商品下架',
            value: '0'
        },
        {
          name: '商品置顶',
          value: '2'
        },
      ],
      threePointsArrQZD: [
        {
          name: '商品下架',
          value: '0'
        },
        {
          name: '取消置顶',
          value: '2'
        }
      ],
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
      screenArr: [
        { name: "出售中", number: "0", type: 1 },
        { name: "已下架", number: "0", type: 2 },
        { name: "无效商品", number: "0", type: 0 }
      ],
      params: {
        page: '',
        rows: '',
        skuName: '',
        groupFlag: this.$route.query.groupFlag,
        queryTypeRecommend: '',
        deliverType: this.$store.state.mall2.staticDeliverType, // 配送方式 2快递运输 1上门自提 12都支持
        queryType: '1', // 查询类型 1 出售中 2 已下架 0 无效商品
      },
      styleObj: {
        listStyle: false,
        rowStyle: 3,
        isObject: 1,
        isHeight: "88",
        url: "/app/json/app_distribution_order/getProList"
      },
      isType: "",
      selectedType: this.$store.state.mall2.staticDeliverType,
      screenType: '1',
      showView: true,
      popupShow: false,
      shareObj: {
        groupFlag: 0,
        popupShow: false,
        codeShow: false,
        deliverType: this.$store.state.mall2.staticDeliverType,
      },
      objData: {},
      isRecommend: false,
      recommendText: '全部商品',
      codeStstus: false,
      searchKey: "",
      // headPic: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.codeStstus) {
      this.shareObj.codeShow = false
    } else {
      if(this.popupShow){
        this.popupShow = false
      }else{
        next()
      }
    }
  },
  created(){
    if (this.$store.state.globalConfig.delivertype_default == '1') {
      this.deliveryTypes = [{
        text: "自提",
        fontclass: "mall-ziti",
        tag: "1"
      }];
    } else if (this.$store.state.globalConfig.delivertype_default == '2') {
      this.deliveryTypes = [{
        text: "配送",
        fontclass: "mall-peisong",
        tag: "2"
      }];
    }
    // this.params.deliverType = this.$store.state.mall2.staticDeliverType;
    // this.selectedType = this.$store.state.mall2.staticDeliverType;
    // this.screenType = this.$store.state.microSho.screenType || '1';
    // this.params.queryType = this.$store.state.microSho.screenType || '1';
  },
  methods: {
    backEvent() {
      this.$router.go(-1);
    },
    qRcodeStstus(status){
      this.codeStstus = status
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
      this.selectedType = tag;
      this.shareObj.deliverType = tag
      this.$store.state.mall2.staticDeliverType = tag
      if (this.selectedType == 2) {
        this.showView = true;
      } else {
        this.showView = false;
      }
      this.params.deliverType = tag;
      this.screenType = 1
      this.params.queryType = '1';
    },
    screenBtn(item) {
      this.screenType = item.type;
      this.params.queryType = item.type;
      this.$store.state.microSho.screenType = item.type;
    },
    listData(item) {
      let obj = item.data || {};
      this.$set(this.screenArr[2], "number", obj.numsForInvalid);
      this.$set(this.screenArr[0], "number", obj.numsForSale);
      this.$set(this.screenArr[1], "number", obj.numsForSoldOut);
    },
    setshareData(item) {
      this.popupShow = false;
      this.shareObj = Object.assign({}, item);
    },
    upperShelf(item) {
      this.$messagebox
        .confirm("确定上架？", "提示")
        .then(action => {
          this.$Loading.open();
          let url = "/app/json/app_distribution_order/updateProFromMicroStore";
          let paramsData = {
            token: this.$store.state.login.token,
            skuId: item.skuId,
            storeId: this.getPutaggregate.id,
            status: "1"
          };
          this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast("上架成功！");
              this.$refs.list._loadProList(true);
            } else {
              this.$Toast(data.info);
            }
          });
        })
    },
    deleteShare(item) {
      this.$messagebox
        .confirm("该商品已经停止分销，是否要删除？", "提示")
        .then(action => {
          this.$Loading.open();
          let url = "/app/json/app_distribution_order/removeProFromMicroStore";
          let paramsData = {
            token: this.$store.state.login.token,
            storeId: this.getPutaggregate.id,
            skuId: item.skuId,
            proSkuDistributionId: item.proSkuDistributionId
          };
          this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.$Toast("删除成功！");
              this.$refs.list._loadProList(true);
            } else {
              this.$Toast(data.info);
            }
          });
        })
        .catch(() => {});
    },
    productEvent(product) {
      if (this.screenType == 0) {
        return;
      }
      let path = "/micro_sho/detail/" + this.$util.getDataString();
      if (product.groupFlag) {
          path = "/micro_sho/purchasedetail/" + this.$util.getDataString();
      }
      this.$router.push({
        path: path,
        query: {
          id: product.skuId,
          skuId: product.skuId,
          lastPath: this.$route.path,
          deliveryType: product.deliverType,
          deliverType: product.deliverType,
          // deliverType: this.$store.state.mall2.staticDeliverType,
          productType: product.productType,
          isRecommend: product.isRecommend,
          proSkuDistributionId: product.proSkuDistributionId,
          groupFlag: this.$route.query.groupFlag,
          obj: {
            queryType: this.screenType
          }
        }
      });
    },
    addshareBtn(item) {
      this.isThreePoints = true
      this.itemAddshare = item
      if (item.isRecommend) {
        this.threePointsArr = [...this.threePointsArrQB, ...[{
          name: '取消',
          value: '-1'
        }]]
      } else {
        if (item.topFlag) {
          this.threePointsArr = [...this.threePointsArrQB, ...this.threePointsArrQZD, ...[{
              name: '取消',
              value: '-1'
          }]]
        } else {
          this.threePointsArr = [...this.threePointsArrQB, ...this.threePointsArrZD, ...[{
              name: '取消',
              value: '-1'
          }]]
        }
      }
    },
    onSelectPoints(item) {
      if (item.value == 0) {
        this.upDownMethod()
      } else if (item.value == 1) {
        this.shareObj = Object.assign({}, this.shareObj, this.itemAddshare, {
          phMainUrl: this.itemAddshare.mainMobilePicUrl,
          showTitle: this.itemAddshare.skuName,
          dpedData:{
            linePrice: this.itemAddshare.salePrice
          }
        });
        this.popupShow = true;
        this.shareObj.popupShow = true;
        this.shareObj.groupFlag = this.$route.query.groupFlag;
      } else if (item.value == 2) {
        this.microStoreProTop()
      }
      this.isThreePoints = false
    },
    microStoreProTop() {
      this.$messagebox.confirm(`确定要操作该商品吗!`,"提示").then(action => {
        this.$Loading.open();
        this.$http.post("/app/json/app_distribution_order/microStoreProTop", {
          // id: this.itemAddshare.id,
          id: this.itemAddshare.microStoreProId
        }).then(res => {
          this.$Loading.close();
          if (res.data.status == 0) {
            this.$Toast(`操作成功!`);
            this.$refs.list._loadProList(this.params);
          } else {
            this.$Toast(res.data.info);
          }
        });
      })
    },
    upDownMethod() {
      this.$messagebox.confirm(`确定要下架该商品吗!`,"提示").then(action => {
        this.$Loading.open();
        this.$http.post("/app/json/app_distribution_order/updateProFromMicroStore", {
          skuId: this.itemAddshare.skuId,
          storeId: this.getPutaggregate.id,
          status: 0
        }).then(res => {
          this.$Loading.close();
            if (res.data.status == 0) {
              this.$Toast(`下架成功!`);
              this.$refs.list._loadProList(this.params);
            } else {
              this.$Toast(res.data.info);
            }
        });
      })
    },
    isRecommendBtn(){
      this.isRecommend=true
    },
    onSelect(item){
      this.recommendText = item.name
      this.isRecommend = false
      this.params.queryTypeRecommend = item.value
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable.styl';

.list {
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
  .main {
    height: 100%;

    .row {
      display: flex;
      justify-content space-between
      align-items center
      padding: 10px 14px;

      .type-btn {
        font-size: $font-size-medium;
        padding: 4px 10px;
        border-radius: 15px;
        border: 0.6px solid transparent;
        display inline-block

        .icon-size {
          font-size: $font-size-medium;
        }
      }
    }
    .screen {
      display: flex;
      justify-content: space-between;
      padding: 10px 24px;
      font-size: 12px;
      font-weight: 500;
      box-shadow 0px -2px 2px #efefef
      border-radius 10px
    }
  }
}
</style>
