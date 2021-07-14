<template>
  <div class="main">
    <div class="main-content">
      <van-swipe
        :loop="false"
        :width="88"
        :height="75"
        :show-indicators="false"
        class="swiper-cal"
      >
        <van-swipe-item v-for="(item, index) in arr" :key="index">
          <div
            class="swipe-item"
            :class="current == index ? 'active' : ''"
            @click="clickSwipe(item, index)"
            ref="swipeBox"
          >
            <div class="dateMonth" :style="dateMonthStyle">
              {{ item.dateMonth }}
            </div>
            <div class="dateWeek">{{ item.dateWeek }}</div>
            <div class="price">{{ item.price }}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="jump-con" @click="jumpChooseData">
        <div class="jump-con-left"></div>
        <div class="jump-con-right">
          <!-- 更多<br /><br />
          日期 -->
          <div>更多</div>
          <div>日期</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  storages,
  judgeType,
  userAgent,
  clientJudge,
  exchangDateStyle,
  getTodayTimestamp,
  exchangeTime,
} from "@/components/bulk/utils/index.js";
export default {
  name: "times-selector",
  components: {},
  props: {
    dateObj: {
      type: Object,
      default: () => {},
    },
    paramData: {
      type: Object,
      default: () => {},
    },
  },

  watch: {},
  data() {
    return {
      dateMonthStyle: "",
      arr: [],
      tourSend: {},
      current: 0,
      chooseTime: new Date(),
    };
  },
  mounted() {
    console.log("no恩偶尔", this.paramData);
    let listFeature = this.dateObj.proSkuFeatureValueList; /*规格集合*/
    let list = this.dateObj.proSkuList; /*sku集合*/
    let arrOther = [];
    let skuIdList = [];
    let skuList = [];
    let skuIdListObj = {
      adult: [],
      child: [],
    };
    let skuListObj = {
      adult: [],
      child: [],
    };
    /*规格集合-筛选skui类型*/
    listFeature.map((item, index) => {
      if (item.featureValue == "成人") {
        skuIdListObj.adult.push(item.skuId); //拿到数据的skuId
      } else if (item.featureValue == "儿童") {
        skuIdListObj.child.push(item.skuId);
      }
    });
    /*分类成人跟儿童的sku数组*/
    listFeature.map((item, index) => {
      if (
        item.featureId == listFeature[0].featureId &&
        skuIdListObj.adult.includes(item.skuId)
      ) {
        skuListObj.adult.push({
          dateMonth: this.modityDate(item.featureValue),
          dateWeek: exchangDateStyle(item.featureValue),
          skuId: item.skuId,
          time: item.featureValue,
          obj: item,
        });
      } else if (
        item.featureId == listFeature[0].featureId &&
        skuIdListObj.child.includes(item.skuId)
      ) {
        skuListObj.child.push({
          dateMonth: this.modityDate(item.featureValue),
          dateWeek: exchangDateStyle(item.featureValue),
          skuId: item.skuId,
          time: item.featureValue,
          obj: item,
        });
      }
    });
    skuListObj.adult.map((item, index) => {
      list.map((items, indexs) => {
        if (item.skuId == items.skuId) {
          skuListObj.adult[index]["price"] = "¥" + `${items.salePrice}`;
        }
      });
    });
    skuListObj.child.map((item, index) => {
      list.map((items, indexs) => {
        if (item.skuId == items.skuId) {
          skuListObj.child[index]["price"] = "¥" + `${items.salePrice}`;
        }
      });
    });
    this.tourSend = skuListObj;
    let todayTime = getTodayTimestamp(); //时间戳
    let newArr = JSON.parse(JSON.stringify(skuListObj.adult)); //成人的sku
    this.arr = newArr.filter((item) => exchangeTime(item.time) >= todayTime);
    if (this.arr.length > 0) {
      this.chooseTime = this.arr[0].time;
    } else {
      this.chooseTime = "";
    }

    let paramData = {
      tourSend: this.tourSend,
      chooseTime: this.chooseTime,
    };
    this.$emit("selectorValue", paramData);
  },
  methods: {
    //修改月份日的日期方法
    modityDate(str) {
      let strNew = str.slice(0, 10).split("-");
      return strNew[1] + "/" + strNew[2];
    },

    jumpChooseData() {
      storages().set("tourSend", this.tourSend);
      this.$router.push({
        path: "/travel/tourDate",
        query: {
          chooseTime: this.chooseTime,
          paramData: JSON.stringify(this.paramData),
        },
      });
    },
    clickSwipe(item, index) {
      this.current = index;
      this.chooseTime = item.time ? item.time : "";
      this.jumpChooseData();
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.main {
  padding-bottom: 10px;

  .main-content {
    width: 350px;
    margin-left: 12px;
    position: relative;

    .jump-con {
      border-left: 1px solid #FAFAFA;
      position: absolute;
      // opacity: 0.8;
      display: flex;
      z-index: 10;
      border-top: 1px soild #ffffff;
      top: -1px;
      right: 0;
      height: 75px;
      width: 50px;
      font-size: 13px;
      color: #666666;
      background-color: #ffffff;
      padding-top: 17px;

      .jump-con-left {
        flex: 0.2;
      }

      .jump-con-right {
        flex: 0.8;
      }
    }

    .swiper-cal {
      margin-top: 12px;
      padding-bottom: 5px;

      .swipe-item {
        text-align: center;
        width: 72px;
        height: 72px;
        border: 1px solid #999999;
        border-radius: 10px;

        .dateMonth {
          color: #333333;
          font-size: 14px;
          padding-top: 6px;
          border-radius: 10px 10px 0 0;
          background-color: #FAFAFA;
        }

        .dateWeek {
          font-size: 10px;
          color: #666666;
          margin-top: 6px;
          background-color: #ffffff;
        }

        .price {
          font-size: 13px;
          color: #e8374a;
          margin-top: 6px;
          background-color: #ffffff;
          border-radius: 0 0 10px 10px;
        }
      }

      .swipe-item.active {
        border: 1px solid #f00;
      }
    }
  }
}
</style>
