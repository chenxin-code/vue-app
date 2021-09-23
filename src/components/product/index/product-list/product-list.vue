<template>
  <div
    class="product-list home_intro_list"
    :class="{'min-height' : usePorpData != true}"
    :style="$market.getModuleBgStyle(moduleData)"
    v-if="(getModuleIsShow() && moduleData.rows.length > 0) || usePorpData != true"
  >
    <div
      class="title-img"
      v-if="moduleData.titleImg != ''"
    >
      <img :src="moduleData.titleImg" />
      <div
        class="title-content"
        v-if="moduleData.showTime && moduleData.type == '3' && moduleData.useApi == 3"
      >
        <!--<div class="field">{{fieldString}}</div>-->
        <div class="remaining">{{timeText}}</div>
        <Countdown
          @timeOut="myTimeOut"
          :endTime="endTime"
          type="theme_bg_quan"
          v-if="showCountdown"
        ></Countdown>
          <!--<div style="flex: 1;"></div>-->
          <!--<img class="arrow" src="static/images/icon-more-1.png"/>-->
          </div>
          </div>
          <div class="tip"></div>
          <div
            class="channels-div" 
            v-if="moduleData.useApi == '4' && moduleData.channels && moduleData.channels.length > 1"
          >
            <div
              class="channel"
              :class="{selected: selectedChannel && selectedChannel.id == channel.id}"
              v-for="(channel,index) in moduleData.channels"
              :key="index"
              @click.stop="selectChannel(channel)"
            >{{channel.name}}
              </div>
              </div>
              <ProductLlistGrid
                :myIndex="myIndex"
                :usePorpData="usePorpData"
                :propData="propData"
                v-if="moduleData.type == '1'"
              ></ProductLlistGrid>
                <!--<ProductLlistDetail :myIndex="myIndex" :usePorpData="usePorpData" :propData="propData" v-if="moduleData.type == '2'"></ProductLlistDetail>-->
                <ProductLlistHScroll
                  :myIndex="myIndex"
                  :usePorpData="usePorpData"
                  :propData="propData"
                  v-if="moduleData.type == '3'"
                ></ProductLlistHScroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Countdown from "@/components/Vendor/countdown/countdown";
import ProductLlistGrid from "./product-list-grid";
import ProductLlistHScroll from "./product-list-hscroll";
import HScroll from "@/components/base/horizontal-scroll/horizontal-scroll";
import componentApi from "../_js/component-api";

// import ProductLlistDetail from './product-list-detail';
// import ProductLlistEdit from './product-list-edit';
export default {
  name: "product-list",
  components: {
    HScroll,
    Countdown,
    ProductLlistGrid,
    // ProductLlistDetail,
    ProductLlistHScroll
  },
  mixins: [componentApi],
  props: ["myIndex", "usePorpData", "propData", "scrollSite"],
  data() {
    return {
      endTime: "",
      timeText: "还剩：",
      showCountdown: true,
      beforeClear: true,
      selectedChannel: null
    };
  },
  methods: {
    selectChannel: function(channel) {
      this.moduleData.selectedId = channel.id;
      this.selectedChannel = channel;
      this._getCurrentDatas(null, channel);
    },
    getModuleIsShow: function() {
      // if (this.moduleData.showTime && this.moduleData.type == '3' && this.moduleData.useApi == 3) {
      //   // 如果是活动的秒杀
      if (this.showCountdown == false) {
        // 如果时间已过期
        // 就不显示了
        return false;
      }
      // }
      return true;
    },
    getEndTime: function() {
      if (
        this.moduleData.showTime &&
        this.moduleData.type == "3" &&
        this.moduleData.useApi == 3 &&
        this.moduleData.rows.length > 0
      ) {
        let item = this.moduleData.rows[0];
        let timeStart = item.mktStartDate.replace(/-/g, "/");
        let startTime = new Date(timeStart).getTime() / 1000;
        let nTime = this.$store.state.severTime.currentTime;
        this.showCountdown = true;
        if (startTime > nTime) {
          this.endTime = startTime;
          this.timeText = "距开始：";
        } else {
          let time = item.mktEndDate.replace(/-/g, "/");
          this.endTime = new Date(time).getTime() / 1000;
          this.timeText = "还剩：";
          if (this.endTime <= nTime) {
            this.timeText = "活动已结束";
            this.showCountdown = false;
          }
        }
      }
    },
    myTimeOut: function() {
      this.getProducts();
    },
    modeleReshow: function() {
      // this.beforeClear = false
      // this.getProducts()
    },
    getProducts: function() {
      if (this.moduleData.useApi == 2) {
        this._getCurrentDatas(null, null);
      } else if (this.moduleData.useApi == 3) {
        this._getCurrentDatas(null, null);
      } else if (this.moduleData.useApi == 4) {
        this._getCurrentDatas(null, null);
      } else {
        let arr = [];
        for (let i = 0; i < this.moduleData.rows.length; i++) {
          let item = this.moduleData.rows[i];
          if (item.skuId != "") {
            arr.push(item.skuId);
          }
        }
        if (arr.length > 0) {
          this._getCurrentDatas(arr, null);
        }
      }
    },
    queryMktActivityByIdList: function() {
      let url =
        this.$market.apiBaseURL() +
        "/app/json/app_market/queryMktActivityByIdList";
      let idList = [];
      for (let i = 0; i < this.moduleData.productFrom.activity.length; i++) {
        let item = this.moduleData.productFrom.activity[i];
        idList.push(item.activityId);
      }
      let paramsData = {
        idList: idList.toString()
      };
      if (
        this.$store.state.login.token &&
        this.$store.state.login.token != ""
      ) {
        paramsData.token = this.$store.state.login.token;
      }
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            let actList = data.data;
            if (actList.length > 0) {
              let activity = actList[0];
              this._getCurrentDatas(null, activity);
            }
          }
        },
        error => {}
      );
    },
    queryChannelList: function() {
      let url =
        this.$market.apiBaseURL() + "/app/json/product/getAppProChannelList";
      let paramsData = {
        token: this.$store.state.login.token,
        channelGroupId: this.moduleData.productFrom.id
      };
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            let channels = data.data.list;
            if (channels.length > 0) {
              let channel = channels[0];
              this.moduleData.channels = channels;
              this.moduleData.selectedId = channel.id;
              this.selectedChannel = channel;
              this._getCurrentDatas(null, channel);
            }
          }
        },
        error => {}
      );
    },
    clearProductInfo: function() {
      for (let i = 0; i < this.moduleData.rows.length; i++) {
        let item = this.moduleData.rows[i];
        item.showTitle = " ";
        item.phMainUrl = "";
        item.activityPrice = 0;
        item.stockNum = 0;
      }
    },
    _getCurrentDatas: function(skuIds, currentData) {
      let cacheRows = this.moduleData.rows;
      if (this.beforeClear) {
        this.moduleData.rows = [];
      }
      // 只有这个类用这个接口
      let url =
        this.$market.apiBaseURL() + "/app/json/product/getAppDesigneList";
      // if (this.usePorpData != true) {
      //   url = this.$market.apiBaseURL() + '/app/json/product/getAppDesigneList';
      // }
      let paramsData = {
        fromFrontPage: "1"
        // token: this.$store.state.login.token,
      };
      if (this.$store.state.webtype == "-1") {
        paramsData.fromFrontPage = "";
      }
      if (
        this.$store.state.login.token &&
        this.$store.state.login.token != "" &&
        this.usePorpData == true
      ) {
        paramsData.token = this.$store.state.login.token;
      }
      if (skuIds) {
        paramsData.skuIds = skuIds;
        paramsData.page = 1;
        paramsData.rows = 300;
      } else {
        paramsData.page = 1;
        paramsData.rows = this.moduleData.productFrom.number;
        if (this.moduleData.useApi == 2) {
          const backCates = this.moduleData.productFrom.backCates;
          if (
            this.moduleData.productFrom.multiple == "2" &&
            backCates &&
            backCates.length > 1
          ) {
            // 多选分类
            let categoryIdList = [];
            for (let i = 0; i < backCates.length; i++) {
              const backCate = backCates[i];
              categoryIdList.push(backCate.id);
            }
            paramsData.categoryIdList = JSON.stringify(categoryIdList);
          } else {
            let cate = this.moduleData.productFrom.cate;
            paramsData.clsType = cate.clsType;
            paramsData.categoryId = cate.id;
            paramsData.cateLevel = cate.cateLevel;
          }
        } else if (this.moduleData.useApi == 3) {
          if (!currentData) {
            if (this.moduleData.productFrom.activity.length > 1) {
              this.queryMktActivityByIdList();
              return;
            }
            currentData = this.moduleData.productFrom.activity;
          }
          paramsData.activityId = currentData.activityId
            ? currentData.activityId
            : currentData.id;
        } else if (this.moduleData.useApi == 4) {
          if (!currentData) {
            this.queryChannelList();
            return;
          }
          paramsData.categoryId = currentData.id;
          paramsData.clsType = "4";
        }
      }
      paramsData.deliverType = this.$store.state.mall2.staticDeliverType;
      // if (this.$store.state.mall2.staticDeliverType == 1) {
      paramsData.pickUpId = this.$store.state.mall2.zitiAddress.id;
      paramsData.pickupStoreOuCode = this.$store.state.mall2.zitiAddress.storeCode;
      // } else {
      let sad = this.$store.state.mall2.selectAddress;
      paramsData.area = {
        provinceId: sad.provinceId,
        cityId: sad.cityId,
        countryId: sad.countryId,
        countyId: sad.countryId,
        townId: sad.townId
      };
      // }
      this.$http.post(url, paramsData).then(
        res => {
          let data = res.data;
          if (data.status == 0) {
            this.moduleData.rows = [];
            let list = data.data.list;
            let hasStockAlways = this.$store.state.globalConfig.hasStockAlways;
            let newRows = [];
            if (skuIds) {
              for (let i = 0; i < skuIds.length; i++) {
                let skuid = skuIds[i];
                let item = null;
                for (let j = 0; j < list.length; j++) {
                  let litem = list[j];
                  if (litem.skuId == skuid) {
                    item = litem;
                  }
                }
                if (item) {
                  let newitem = this.$market.dataProcessing(item);
                  if (hasStockAlways == "1") {
                    newitem.stockNum = newitem.stockNum || 1;
                  }
                  newRows.push(newitem);
                }
              }
            } else {
              for (let i = 0; i < list.length; i++) {
                let item = this.$market.dataProcessing(list[i]);
                if (hasStockAlways == "1") {
                  item.stockNum = item.stockNum || 1;
                }
                newRows.push(item);
              }
            }
            newRows.forEach(item => {
              const row = cacheRows.find(cr => cr.skuId == item.skuId);
              this.$set(item, "cornerMark", row ? row.cornerMark : 0);
              this.$set(
                item,
                "selfCornerMarkUrl",
                row ? row.selfCornerMarkUrl : ""
              );
            });
            this.moduleData.rows = newRows;
            this.getEndTime();
          }
        },
        error => {}
      );
    },
    lazyLoadPageData: function() {
      this.getProducts();
    }
  },
  computed: {
    pageData: function() {
      if (this.usePorpData == true) {
        return this.propData;
      }
      return this.$store.state.pageData;
    },
    moduleData: function() {
      return this.pageData.moduleList[this.myIndex].data;
    }
  },
  mounted() {
    this.beforeClear = false;
    this.clearProductInfo();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.home_intro_list {
  width: 100%;
  height: 100%;
  margin-top:-7px;
  background-color:#F8F8F8 !important;
  .title-img {
    position: relative;
    width: 100%;

    img {
      display: block;
      width: 100%;
    }

    .title-content {
      position: absolute;
      left: 45%;
      right: 0px;
      top: 0px;
      bottom: 0px;
      display: flex;
      align-items: center;

      .field {
        margin-left: 10px;
        margin-right: 15px;
        font-size: 12px;
      }

      .remaining {
        font-size: 12px;
        margin-left: 10px;
      }

      .arrow {
        margin-right: 20px;
        height: 21px;
      }
    }
  }

  .tip {
  }

  .channels-div {
    padding: 0 10px 15px;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    .channel {
      display: inline-block;
      padding: 10px 5px 5px;
      text-align: center;
      min-width: 16.6%;
      font-size: 14px;
      color: #121212;
      line-height:14px;
      flex:1;
    }

    .selected {
      font-size: 16px;
      font-weight: 500;
      position: relative;
      color: #E8374A;

      &.selected::after {
        content: ' ';
        position: absolute;
        left: 50%;
        bottom: -4px;
        background: url("./images/selectIconRed.png");
        background-size: cover;
        width: 12px;
        margin-left: -6px;
        height: 6px;
      }
    }
  }

  &.min-height {
    min-height: 30px;
  }
}
</style>
