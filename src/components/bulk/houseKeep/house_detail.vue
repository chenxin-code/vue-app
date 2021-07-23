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
    <div v-if="hasDate && hasDate != 'loading'" class="content">
      <div class="house-product-swiper">
        <van-swipe class="my-swipe" :autoplay="3000" @change="onChange">
          <van-swipe-item v-for="(item, index) in sidePicList" :key="index"
            ><img :src="item"
          /></van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">
              {{ current + 1 }}/{{ sidePicList.length }}
            </div>
          </template>
        </van-swipe>
      </div>

      <div class="row spacebetween product-message">
        <div>
          <div class="row end prize">
            <div class="practical">
              ¥{{ $util.toDecimal2(productDetail.proSkuList[0].salePrice) }}
            </div>
            <div class="old">
              ¥{{ $util.toDecimal2(productDetail.proSkuList[0].marketPrice) }}
              <span class="old_line"></span>
            </div>
          </div>
          <div class="product-desc">{{ productDetail.spuName }}</div>
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

      <div class="row spacebetween product-size">
        <div class="row left flex">
          <span class="size">规格</span>
          <span class="text">
            {{ productDetail.proSkuList[0].skuName }}
          </span>
        </div>
        <div class="row center" @click="selectSize">
          <van-icon size="20" name="ellipsis" />
        </div>
      </div>
      <div class="order">
        <div class="row center order_title">
          <span class="line"></span>
          <span class="txt">图文详情</span>
          <span class="line"></span>
        </div>
        <div class="word-detail img-max-width" v-html="htmDom"></div>
      </div>
    </div>
    <div class="row center bottom-button">
      <div class="row center right" @click="selectSize">立即购买</div>
    </div>
    <div v-if="!hasDate" class="noMore">暂无数据</div>
    <div v-show="hasDate == 'loading'" class="row center noMore">
      <van-loading type="spinner" color="#999" />
      &nbsp;&nbsp;加载中...
    </div>
    <van-popup
      v-model="isShowPopup"
      position="bottom"
      :style="{ height: '60%' }"
      :closeable="true"
      round
    >
      <div class="details-product">
        <div class="row start">
          <img :src="skuObj.phMainUrl" alt="" />
          <div class="right">
            <div class="top-prize row end">
              <div class="amt">¥{{ skuObj.salePrice }}</div>
              <div class="old">
                ¥{{ skuObj.marketPrice }}
                <span class="old_line"></span>
              </div>
            </div>
            <div class="bottom-text">已选 {{ skuObj.skuName }}</div>
          </div>
        </div>
        <div class="popup-product-size-text">
          <div class="text">{{ feature[0] ? feature[0].featureName : 0 }}</div>
        </div>

        <div class="popup-product-list-size">
          <div v-for="(item, index) in firstList" :key="index">
            <div
              class="popup-product-type"
              :class="
                selectActive.activeFirst == index
                  ? 'popup-select'
                  : 'popup-default'
              "
              @click="selectActive.activeFirst = index"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div class="popup-product-size-text" v-if="feature[1]">
          <div class="text">{{ feature[1] ? feature[1].featureName : "" }}</div>
        </div>

        <div class="popup-product-list-size">
          <div v-for="(item, index) in secondList" :key="index">
            <div
              class="popup-product-type"
              :class="
                selectActive.activeSecond == index
                  ? 'popup-select'
                  : 'popup-default'
              "
              @click="selectActive.activeSecond = index"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div class="row spacebetween vant-stepper-block">
          <div class="left"><span>数量</span></div>
          <div class="vant-stepper-block-right">
            <van-stepper
              disable-input
              v-model="productNum"
              integer
              max="99"
              min="1"
            />
          </div>
        </div>
        <div class="row center popup-bottom-block">
          <div class="bottom-button-block" @click="submit">立即购买</div>
        </div>
      </div>
    </van-popup>
    <van-overlay :show="isShowMask" @click="isShowMask = false" />

    <div class="product-detail-share" v-show="isShowMask">
      <img :src="sharePostData" alt="" width="283" />
      <div
        class="product-detail-share-poster"
        ref="sharePoster"
        v-if="isShowPost"
      >
        <img :src="imgBase64" alt="" />
        <div class="share-bottom">
          <div class="left">
            <div class="top">¥{{ $util.toDecimal2(skuObj.salePrice) }}</div>
            <div class="bottom">{{ productDetail.spuName }}</div>
          </div>
          <div class="right">
            <div ref="shareQrcode"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { house_travel_Info, config, ServiceMall } from "../bulkapi/index.js";
import {
  currencyFormat,
  storages,
  judgeType,
  userAgent,
} from "@/components/bulk/utils/index.js";
export default {
  data() {
    return {
      selectActive: {
        activeFirst: 0, // 规格一级选择
        activeSecond: 0, // 规格一级选择
      },
      skuObj: {}, // 默认选中sku规格对象
      imgBase64: "",
      isShowPost: true,
      sidePicList: [], // 轮播图列表
      current: 0,
      productDetail: {},
      spuList: [],
      skuList: [],
      firstList: [],
      secondList: [],
      isShowPopup: false,
      isShowMask: false,
      sharePostData: "",
      productNum: 1,
      hasDate: "loading",
      param: "",
      htmDom: "",
      timeText: "距离活动还剩",
      timeDown: "",
      feature: [], //规格类型数组,
      communityId: "",
    };
  },
  activated() {},
  created() {
    this.param = this.$route.query;
    console.log(this.param, "param");
    this.communityId = this.param.communityId;
    let obj = {
      id: this.param.spuId,
      businessTypeId: this.param.businessTypeId,
    };
    this.getProductDetail(obj);
    this.getCountdownTime(this.param.endTime);
  },
  mounted() {
    // if (!judgeType()) {
    //   this.$refs.bottomBtn.style.height = "60px";
    // }
  },
  watch: {
    selectActive: {
      handler() {
        this.targetSize();
      },
      deep: true,
    },
  },
  methods: {
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
    /*去重*/
    unique(arr, val) {
      const res = new Map();
      return arr.filter((item) => !res.has(item[val]) && res.set(item[val], 1));
    },
    // 获取商品详情
    getProductDetail(params) {
      this.$http
        .post(house_travel_Info, JSON.stringify(params), config)
        .then((res) => {
          let { status } = res;
          if (status == 200) {
            let resdata = res.data.data;
            let { data, code } = resdata;
            if (code == 200) {
              this.hasDate = true;
              this.sidePicList = data.picUrlJson.split(",");
              this.productDetail = data;
              this.skuList = data.proSkuList; //sku列表
              this.spuList = data.proSkuFeatureValueList; //规格产品
              /*获取规格标题-目前最多两成*/
              this.feature = this.unique(this.spuList, "featureId");
              let skuStrList = [];
              this.skuList.map((item) => {
                item.phMainUrl = item.pcMainUrl.split(",")[0];
                item.skuPropJson = JSON.parse(item.skuPropJson);
                skuStrList.push(item.skuPropJson[0]);
                let skuStr = "";
                item.skuPropJson.map((items) => {
                  skuStr = skuStr + items.featureValue;
                });
                item.skuStr = skuStr;
              });

              let first = [],
                second = [],
                { feature } = this;
              /*商品规格*/
              skuStrList.map((item) => {
                feature.map((items) => {
                  if (item.featureName == items.featureName) {
                    first.push(item.featureValue);
                  } else {
                    second.push(item.featureValue);
                  }
                });
              });

              this.firstList = first;
              this.secondList = second;
              this.htmDom = data.mobileDetail;
              this.targetSize();
            }
          } else {
            this.hasDate = false;
          }
        });
    },

    /**
     * @description 匹配商品详情对应的规格
     */
    targetSize() {
      let { firstList, secondList, selectActive } = this,
        { activeFirst, activeSecond } = selectActive;
      let targetIndex = 0;
      let skuStr = firstList[activeFirst];
      if (secondList.length > 0) {
        skuStr = firstList[activeFirst] + secondList[activeSecond];
      }
      /*选中*/
      this.skuList.map((item, index) => {
        if (item.skuStr == skuStr) {
          this.skuObj = item;
          targetIndex = index;
        }
      });
      return targetIndex;
    },
    onChange(index) {
      this.current = index;
    },
    /*分享按钮*/
    async clickShare() {
      this.isShowPost = true;
      this.getQrcode();
      let response = await placeOrder.downloadImage({
        imgUrl: this.skuObj.phMainUrl,
        isCompress: true,
      });
      this.imgBase64 = "data:image/png;base64," + response.data.imgBase64;
      this.isShowMask = true;
      this.$nextTick(() => {
        this.downloadPoster();
      });
    },
    shareSelect(val) {
      this.isShowMask = true;
    },
    clickBack() {
      this.$router.back();
    },
    selectSize() {
      this.isShowPopup = true;
    },
    refund() {},
    /**
     * @description 确认订单
     *
     */
    submit() {
      let { skuObj, productNum, param, communityId } = this;
      let token = this.$store.state.ythToken
        ? this.$store.state.ythToken
        : localStorage.getItem("ythToken");
      let { businessTypeId, groupShareCode, headName, headPhone, activityId } =
        param;
      let { spuId, phMainUrl, salePrice, skuId, skuName } = skuObj;
      token =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMzU2MDA4NjkyNSIsInNjb3BlIjpbImFsbCJdLCJpZCI6MjQwNTYyMDM5MDg5OTQ4MjY4MSwiZXhwIjoxNjI1NDQ3ODY0LCJhdXRob3JpdGllcyI6WyJ2aXNpdG9yIl0sImp0aSI6IjNlNzM2YjE4LTQzMmEtNGY1OS04Njk5LWUxMjJkY2ZiMDQwOSIsImNsaWVudF9pZCI6ImFwcF9jIn0.UGhQDskBQJMfooam0Xe8dixTms2fxnGe9wYsKaysO_ipRNEX8OutF0SzyQalvYfINdV2iNzVYsclOHgO9TpA2Q2n4i-fPcCds7m6QC4Wcyi14uLcCdQrnlh01L5hlsJfaiRXwBr7PpCoX1iaY7UtJW9D6eO1nNKM8rQ9BiA2QFd-uPRZPkSF3_S9RCeNBMEDqAJ0nQhApvUUJ3HFmu6hao00FJUnA-0Sdaihpv5d7BbKsUGPg6gV04N5uKOnNzMFSbkFX_SO1oPFM-UDooVFW7MZYrsbhx9e41jTSdENNUWejgo86ywbujHUXHZOlNIEDy1iEjw5pFygaZfuafKlwg";
      let queryData = `&businessType=${businessTypeId}&channel=H5&groupDistributionCode=${groupShareCode}&projectCommunityId=${communityId}&activityId=${activityId}&groupDistrName=${headName}&groupDistrPhone=${headPhone}&orderChannel=1&token=${token}`;
      let chooseData = `?productNum=${productNum}&id=${spuId}&phMainUrl=${phMainUrl}&salePrice=${salePrice}&skuId=${skuId}&skuName=${skuName}`;
      /*服务商城的确认订单页面*/
      location.href = URL + queryData;
      /*服务商城的确认订单页面*/
      let URL = ServiceMall + "housekeep/submitHouse";
      location.href = URL + chooseData + queryData;
    },
    /**
     * @desc 保存海报图
     */
    // TODO 保存海报到本地
    downloadPoster() {
      const that = this;
      html2canvas(that.$refs.sharePoster).then((canvas) => {
        that.sharePostData = canvas.toDataURL("image/png");
        that.isShowPost = false;
      });
    },
    /**
     * @desc 生成二维码
     */
    getQrcode(url) {
      const that = this;
      new Promise((resolve, reject) => {
        new QRcode(that.$refs.shareQrcode, {
          width: "72",
          height: "72",
          text: "可以的",
        });
        resolve();
      });
    },
  },
};
</script>

<style  lang="stylus" scoped type="text/stylus">
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

  .noMore {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    align-item: center;
    font-size: 16px;
    color: #999;
  }

  .house-product-swiper {
    .custom-indicator {
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: 12px;
      width: 38px;
      height: 20px;
      background: #000000;
      border-radius: 6px;
      opacity: 0.3;
      color: #ffffff;
      text-align: center;
      line-height: 20px;
    }

    .my-swipe .van-swipe-item {
      width: 100%;
      height: 375px;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
      background-color: #39a9ed;

      img {
        width: 375px;
        height: 375px;
      }
    }
  }

  .product-message {
    width: 375px;
    background: #ffffff;
    border-radius: 0px 0px 12px 12px;
    padding: 15px 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    align-items: start;

    .prize {
      .practical {
        font-size: 18px;
        color: #e8374a;
      }

      .old {
        font-size: 14px;
        color: #666;
        margin-left: 8px;
        position: relative;

        .old_line {
          position: absolute;
          width: 100%;
          border-top: 1px solid #999;
          top: 6px;
          left: 0;
        }
      }
    }

    .product-desc {
      padding-top: 10px;
      font-size: 14px;
      color: #121212;
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

  .order {
    text-align: center;
    color: #979797;
    font-size: 13px;

    .order_title {
      margin: 15px 0;

      .line {
        border-top: 1px solid #979797;
        width: 45px;
      }

      .txt {
        margin: 0 8px;
      }
    }

    .word-detail {
      padding-bottom: 110px;
      width: 100%;

      img {
        width: 100%;
      }
    }
  }

  .bottom-button {
    width: 100%;
    height: 90px;
    background: #ffffff;
    position: fixed;
    bottom: -1px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

    .right {
      width: 270px;
      height: 40px;
      background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
      border-radius: 8px;
      text-align: center;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .details-product {
    margin: 40px 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 400;

    img {
      width: 96px;
      height: 96px;
      border-radius: 8px;
    }

    .right {
      padding: 8px 0;
      height: 96px;
      margin-left: 15px;
    }

    .popup-product-size-text {
      font-weight: 500;
      color: #333333;
      margin: 16px 0 0 0;
    }

    .popup-product-list-size {
      display: flex;
      flex-wrap: wrap;

      .popup-product-type {
        margin: 8px 8px 8px 0;
        border-radius: 8px;
        height: 27px;
        line-height: 27px;
        padding: 0 10px 0;
        text-align: center;
        font-size: 13px;
      }

      .popup-select {
        background: #fcecee;
        border: 1px solid #e8374a;
        color: #e8374a;
      }

      .popup-default {
        background: #f0f0f0;
        color: #333333;
        border: 1px solid #f0f0f0;
      }

      .popup-disabled {
        background: #f0f0f0;
        color: #999999;
        border: 1px solid #f0f0f0;
      }
    }

    .vant-stepper-block {
      height: 50px;
      background: #ffffff;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;

      .left {
        font-size: 13px;
        color: #999999;

        span {
          font-size: 15px;
          font-weight: 500;
          color: #121212;
          margin-right: 15px;
        }
      }
    }

    .popup-bottom-block {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
      position: absolute;
      bottom: 0px;
      left: 0;
      height: 100px;

      .bottom-button-block {
        width: 320px;
        height: 50px;
        background: linear-gradient(270deg, #f96b7b 0%, #ef2d30 100%);
        text-align: center;
        line-height: 50px;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        border-radius: 12px;
      }
    }

    .right {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;

      .top-prize {
        .amt {
          font-size: 16px;
          color: #e8374a;
        }

        .old {
          position: relative;
          font-size: 14px;
          color: #999;
          margin-left: 10px;

          .old_line {
            position: absolute;
            border-top: 1px solid #999;
            top: 6px;
            left: 0;
            width: 100%;
          }
        }
      }

      .bottom-text {
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
        color: #333333;
      }
    }

    .order-operate {
      display: flex;
      flex-direction: row-reverse;
      margin: 15px 15px 0 0;

      .type {
        width: 80px;
        height: 28px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e8374a;
        line-height: 28px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
      }
    }
  }

  .product-detail-share {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 283px;
    background: #ffffff;
    z-index: 2;
    border-radius: 12px;

    .product-detail-share-poster {
      padding-bottom: 12px;
      position: fixed;

      img {
        width: 283px;
        height: 283px;
      }

      .share-bottom {
        display: flex;
        justify-content: space-between;

        .left {
          margin-left: 12px;
          display: flex;
          flex-direction: column;

          .top {
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #e8374a;
          }

          .bottom {
            width: 170px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #121212;
            margin-top: 5px;
          }
        }

        .right {
          margin-right: 12px;
          margin-top: 10px;
        }
      }
    }

    .product-detail-share-bottom {
      position: fixed;
      bottom: -100px;
      width: 100%;

      .detail-share-bottom-type {
        display: flex;
        justify-content: space-between;

        .share-bottom-type {
          display: flex;
          flex-direction: column;
          text-align: center;

          img {
            width: 56px;
            height: 56px;
          }

          .bottom {
            margin-top: 5px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
