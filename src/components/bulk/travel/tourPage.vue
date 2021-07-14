<template>
  <div class="main">
    <van-sticky style="width: 100%">
      <div class="banner">
        <van-nav-bar
          :left-arrow="false"
          safe-area-inset-top
          @click-left="$router.go(-1)"
          :border="false"
        >
          <template #left>
            <van-icon name="arrow-left" color="#000" />
          </template>
          <template #title>
            <div class="navTitle">商品详情</div>
          </template>
        </van-nav-bar>
      </div>
    </van-sticky>
    <div v-if="hasDate && hasDate != 'loading'">
      <div class="top-swipe">
        <van-swipe :autoplay="3000" @change="onChange" class="swiper-item">
          <van-swipe-item
            class="my-swipe"
            v-for="(item, index) in bannerImg"
            :key="index"
            ><img :src="item"
          /></van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/{{ bannerImg.length }}
            </div>
          </template>
        </van-swipe>
      </div>
      <div class="row spacebetween title-content">
        <div>
          <div class="price-con">
            <span class="con-one">
              ¥{{ $util.toDecimal2(productDetail.proSkuList[0].salePrice) }}
            </span>
            <span class="con-two">
              ¥{{ $util.toDecimal2(productDetail.proSkuList[0].marketPrice) }}
            </span>
          </div>
          <div class="word-con">
            {{ productDetail.spuName }}
          </div>
        </div>
        <div class="column center goods_time">
          <div class="goods_time_title">{{ timeText }}</div>
          <van-count-down
            v-if="timeDown"
            :time="timeDown"
            :auto-start="true"
            @finish="finish"
          >
            <template #default="timeData">
              <span v-if="timeData.days != 0">
                <span class="block">{{ timeData.days }}</span>
                <span class="colon"> &nbsp;&nbsp;天:</span>
              </span>
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
      </div>
      <div class="calendar">
        <div class="calendar-title">{{ chooseDate }}</div>
        <times-selector
          :dateObj="dateObj"
          :paramData="param"
          @selectorValue="selectorValue"
        />
      </div>
      <div class="order">
        <span class="line"></span>
        <span class="txt">图文详情</span>
        <span class="line"></span>
        <div
          class="word-detail img-max-width"
          v-html="htmlDom"
          ref="wordDetail"
        ></div>
      </div>

      <div class="bottom-button" ref="bottombtn">
        <div class="right" @click="jumpChooseData">立即预定</div>
      </div>
    </div>
    <div v-show="!hasDate" class="noMore">暂无数据</div>
    <div v-show="hasDate == 'loading'" class="row center noMore">
      <van-loading type="spinner" color="#999" />
      &nbsp;&nbsp;加载中...
    </div>
    <van-share-sheet
      v-model="issShowSharePanel"
      :options="shareOptions"
      @select="shareSelect"
    />
    <van-overlay :show="isShowMask" @click="isShowMask = false" />
  </div>
</template>

<script>
import { Lazyload } from "vant";
import timesSelector from "./times-selector";
import { house_travel_Info, config } from "../bulkapi/index.js";
import {
  currencyFormat,
  storages,
  judgeType,
  userAgent,
  clientJudge,
} from "@/components/bulk/utils/index.js";

export default {
  name: "tourPage",
  components: {
    timesSelector,
  },
  props: {},
  data() {
    return {
      titleTop: "商品详情",
      chooseDate: "出发日期选择",
      current: 0,
      isShowMask: false,
      issShowSharePanel: false,
      dateObj: {},
      bannerImg: [],
      params: {},
      hasDate: "loading",
      productDetail: "",
      shareOptions: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
      ],
      htmlDom: "",
      timeDown: "",
      timeText: "距离活动还剩",
      chooseTime: new Date(),
      communityId: "",
      param: "",
    };
  },
  watch: {},
  created() {
    this.param = this.$route.query;
    this.communityId = this.param.communityId;
    console.log(this.param, "param");
    let obj = {
      id: this.param.spuId,
      businessTypeId: this.param.businessTypeId,
    };
    this.getProductDetail(obj);
    this.getCountdownTime(this.param.endTime);
  },
  mounted() {
    // if (!judgeType()) {
    //   /*判断iphonex*/
    //   this.$refs.bottombtn.style.height = "65px";
    // }
    storages().set("tourData", this.params);
  },
  methods: {
    selectorValue(paramData) {
      storages().set("tourSend", paramData.tourSend);
      this.chooseTime = paramData.chooseTime;
    },
    jumpChooseData() {
      this.$router.push({
        path: "/travel/tourDate",
        query: {
          chooseTime: this.chooseTime,
          paramData: JSON.stringify(this.param),
        },
      });
    },
    /*活动倒计时*/
    getCountdownTime(time) {
      let nowT = new Date().getTime();
      let endT = this.$util.getDateFromString(time) * 1000;
      if (nowT < endT) {
        this.timeDown = endT - nowT;
        this.timeText = "距离活动还剩";
      } else {
        this.timeText = "活动已结束";
      }
    },
    finish() {
      this.timeText = "活动已结束";
      this.timeDown = "";
    },
    /*商品详情*/
    getProductDetail(params) {
      this.hasDate = "loading";
      this.$http
        .post(house_travel_Info, JSON.stringify(params), config)
        .then((res) => {
          let { status } = res;
          if (status == 200) {
            let resdata = res.data.data;
            let { data, code } = resdata;
            if (code == 200) {
              this.hasDate = true;
              this.params["spuName"] = this.mesContent = data.spuName;
              storages().set("spuName", data.spuName);
              this.dateObj = data;
              this.productDetail = data;
              this.bannerImg = data.picUrlJson.split(",");

              let htmlDom = data.mobileDetail
                .replace("<p>", "")
                .replace("</p>", "");

              htmlDom = htmlDom.replace(
                /display: block;/g,
                "display: block;width:100%"
              );
              this.htmlDom = data.mobileDetail;
              //   this.$refs.wordDetail.innerHTML = htmlDom;
            } else {
              this.hasDate = false;
            }
          } else {
            this.hasDate = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(index) {
      this.current = index;
    },
    shareSelect(val) {
      this.isShowMask = true;
      this.issShowSharePanel = false;
      this.$nextTick(() => {
        this.getQrcode();
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.row {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.row_reseve {
  flex-direction: row-reverse;
  align-items: start;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.start {
  justify-content: start;
}

.center {
  justify-content: center;
}

.spacebetween {
  justify-content: space-between;
}

.end {
  align-items: flex-end;
}

.flex {
  flex: 1;
}

#app .router_class {
  background: #f7f7f7;
  overflow-x: hidden;
  overflow-y: auto;
}

.main {
  width: 100%;
  height: 100%;

  .back-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 100;

    img {
      width: 30px;
      height: 30px;
    }
  }

  .share-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;

    img {
      width: 30px;
      height: 30px;
    }
  }

  .top-swipe {
    background-color: gray;

    .swiper-item {
      width: 375px;
      height: 375px;

      .my-swipe {
        img {
          width: 375px;
          height: 375px;
        }
      }

      .custom-indicator {
        position: absolute;
        z-index: 10;
        right: 5px;
        bottom: 15px;
        padding: 2px 5px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
      }
    }
  }

  .title-content {
    background-color: #ffffff;
    padding-bottom: 20px;
    padding: 15px 20px;

    .price-con {
      .con-one {
        font-size: 18px;
        color: #e8374a;
      }

      .con-two {
        font-size: 14px;
        color: #999999;
        text-decoration: line-through;
        margin-left: 8px;
      }
    }

    .word-con {
      font-size: 16px;
      color: #121212;
      margin-top: 10px;
      line-height: 20px;
    }
  }

  .goods_time {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .goods_time_title {
      width: 140px;
      font-size: 14px;
      font-weight: 400;
      color: #e8374a;
      line-height: 16.5px;
      margin-bottom: 5px;
      text-align: right;
    }

    .block {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 2px;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #e8374a;
    }

    .colon {
      color: #e8374a;
    }
  }

  .product-size {
    background: #fff;
    width: 100%;
    padding: 15px 20px;
    margin-top: 12px;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 400;

    .left {
      .size {
        width: 50px;
        font-weight: 500;
        color: #121212;
      }

      .text {
        color: #333;
        margin: 0 15px;
        line-height: 20px;
      }
    }
  }

  .noMore {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-item: center;
    font-size: 16px;
    color: #999;
  }

  .calendar {
    width: 100%;
    padding-bottom: 25px;
    background-color: #ffffff;
    margin-top: 12px;

    .calendar-title {
      margin-left: 20px;
      padding-top: 16px;
      font-size: 13px;
      color: 13px;
    }
  }

  .order {
    text-align: center;
    color: #979797;
    font-size: 13px;
    margin: 20px 0 90px 0;

    .line {
      display: inline-block;
      border-top: 1px solid #979797;
      width: 45px;
    }

    .txt {
      vertical-align: -8%;
      margin-left: 8px;
      margin-right: 8px;
      padding-bottom: 100px;
    }

    .word-detail {
      margin-top: 16px;

      p>img {
        width: 100%;
      }

      img {
        width: 100%;
      }
    }
  }

  .bottom-button {
    display: flex;
    justify-content: space-between;
    width: 375px;
    height: 80px;
    background: #ffffff;
    position: fixed;
    bottom: -1px;
    z-index: 99;

    .left {
      margin-left: 15px;
      margin-top: 13px;
      display: flex;

      .shop {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          height: 20px;
          width: 20px;
        }

        span {
          font-size: 12px;
          transform: scale(0.8);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(18, 18, 18, 0.8);
        }
      }
    }

    .right {
      margin-top: 13px;
      // margin-right: 15px;
      margin-left: auto;
      margin-right: auto;
      width: 300px;
      height: 39px;
      background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
      border-radius: 8px;
      text-align: center;
      line-height: 39px;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
