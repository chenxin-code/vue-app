<template>
  <div class="main">
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
    <!-- 团购价 倒计时 -->
    <div class="price">
      <div class="one">
        <div>
          <div>团购价</div>
          <div>¥2.99</div>
          <div>¥5.99</div>
        </div>
        <div>已抢232件</div>
      </div>
      <div class="two">
        <div>距离结束还剩</div>
        <van-count-down :time="time">
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
    </div>
    <!--  -->
    <div class="title-content">
      <div class="word-con">
        {{ mesContent }}
      </div>
    </div>
    <!--  -->
    <div class="calendar">
      <div class="calendar-title">{{ '出发日期选择' }}</div>
      <times-selector :dateObj="dateObj" @selectorValue="selectorValue" />
    </div>
    <!--  -->
    <div class="order">
      <span class="line"></span>
      <span class="txt">图文详情</span>
      <span class="line"></span>
      <div class="word-detail" ref="wordDetail"></div>
    </div>
    <!--  -->
    <div class="conten">
      <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="">
    </div>
    <!-- 底部 -->
    <div class="bottom-button" ref="bottomBtn">
      <div class="left">
        <div class="shop">
          <img src="@/assets/housekeep/home@2x.png" alt="" />
          <span>商城</span>
        </div>
        <div class="shop" style="margin-left: 20px">
          <img src="@/assets/housekeep/StarOutline@2x.png" alt="" />
          <span>收藏</span>
        </div>
      </div>
      <div class="right" @click="selectSize">立即购买</div>
    </div>

    <van-popup
      v-model="isShowPopup"
      position="bottom"
      :style="{ height: '80%' }"
      :closeable="true"
      round
    >
      <div class="details-product">
        <div style="display: flex">
          <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
          <div class="right">
            <div class="top-prize">
              <div class="amt">
                88
                <!-- {{ skuObj.salePrice | currencyFormat("¥") }} -->
              </div>
            </div>
            <div class="bottom-text">
              已选180
              <!-- 已选 {{ firstList[selectActive.activeFirst]
              }}{{ secondList[selectActive.activeSecond] }} -->
            </div>
          </div>
        </div>
        <div class="popup-product-size-text">
          <div class="text">规格</div>
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

        <div class="popup-product-size-text" v-if="secondList.length">
          <div class="text">规格</div>
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

        <div class="vant-stepper-block">
          <div class="left"><span>数量</span></div>
          <div class="right">
            <van-stepper
              disable-input
              v-model="productNum"
              integer
              max="99"
              min="1"
            />
          </div>
        </div>

        <div class="popup-bottom-block">
          <div class="bottom-button-block" @click="submit">立即购买</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import timesSelector from "./times-selector";
export default {
  components:{
    timesSelector,
  },
  data() {
    return {
      bannerImg: [
        "https://img01.yzcdn.cn/vant/apple-1.jpg",
        "https://img01.yzcdn.cn/vant/apple-2.jpg"
      ],
      time: '2000000',
      current: 0,
      mesContent: "拉萨+林芝+山南+布达拉宫+大峡谷8日7晚跟团游（5钻）",
      dateObj: {},
      isShowPopup: false,
      firstList: [],
      secondList: [],
      productNum: ''
    };
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    selectorValue(selectorValue) {
      console.log("childValue====>");
      console.log(selectorValue);
      this.$util.storages().set("tourSend", selectorValue);
    },
    selectSize() {
      this.isShowPopup = true;
    },
    submit() {
      this.$util.storages().set("submitHouse_orderDetail", {
        pageParams: this.pageParams,
        productDetail: this.productDetail,
        skuObj: this.skuObj,
        productNum: this.productNum,
      });
      this.$router.push({
        path: "/housekeep/submitHouse",
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.extendCover() {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -0.2rem;
    right: -0.2rem;
    bottom: -0.2rem;
    left: -0.2rem;
  }
}
.main::-webkit-scrollbar { width: 0 !important }
.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #F8F8F8  !important;
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
  .price{
    width: 100%;
    height: 55px;
    background: linear-gradient(-15.819999999999993deg, #FF6266 0%, #FF393E 60%);
    display: flex;
    color: #fff;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    box-sizing: border-box;
    .one{
      >div:nth-child(1){
        display: flex;
        align-items: center;
        div:nth-child(1){
          font-size: 12px;
          margin-right: 5px;
        }
        div:nth-child(2){
          font-size: 27px;
          margin-right: 5px;
        }
        div:nth-child(3){
          font-size: 12px;
          margin-right: 5px;
          text-decoration: line-through;
          font-weight: 300;
        }
      }
    }
    .two div:nth-child(1){
      font-size: 11px;
      margin-bottom: 5px;
    }
    .colon {
      display: inline-block;
      margin: 0 4px;
      color: #fff;
    }
    .block {
      border-radius: 5px;
      display: inline-block;
      width: 19px;
      color: #fff;
      font-size: 11px;
      text-align: center;
      background: #BC001C;
    }
  }
  .title-content {
    background-color: #F8F8F8;
    padding-bottom: 11px;
    height :66px;
    .word-con {
      height :100%;
      width :100%;
      padding : 10px 20px 0 20px;
      box-sizing :border-box;
      background-color: #fff;
      font-size: 16px;
      color: #121212;
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


  .calendar {
    width: 100%;
    height :142px;
    background-color: #ffffff;
    border-radius: 12px;
    .calendar-title {
      padding :16px 0 12px 20px;
      font-size: 13px;
      color: #121212;
    }
  }

  .order {
    text-align: center;
    color: #979797;
    font-size: 13px;
    margin-top: 20px;

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

      img {
        width: 375px !important;
        height: 375px;
      }
    }
  }
  .conten{
    width :100%;
    padding-bottom: 100px;
    img{
      width :100%;
    }
  }
  .bottom-button {
    z-index :999;
    display: flex;
    padding: 0 20px;
    box-sizing :border-box;
    justify-content: space-between;
    align-items :center;
    width: 375px;
    height: 98px;
    background: #ffffff;
    position: fixed;
    bottom: 0;

    .left {
      // margin-left: 15px;
      // margin-top: 13px;
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
          font-size: 14px;
          transform: scale(0.8);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(18, 18, 18, 0.8);
        }
      }
    }
    .right {
      // margin-top: 13px;
      // margin-right: 15px;
      // margin-left: auto;
      // margin-right: auto;
      width: 240px;
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
  .details-product {
  margin: 40px 0;

  img {
    width: 96px;
    height: 96px;
    margin: 0 10px 0 16px;
  }

  .popup-product-size-text {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin: 16px 0 0 16px;
  }

  .popup-product-list-size {
    display: flex;
    flex-wrap: wrap;

    .popup-product-type {
      margin: 8px;
      border-radius: 8px;
      height: 27px;
      line-height: 27px;
      padding: 0 10px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
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
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    background: #ffffff;

    .left {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      margin-left: 15px;

      span {
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #121212;
        margin-right: 15px;
      }
    }

    .right {
      margin-right: 15px;
    }
  }

  .popup-bottom-block {
    width: 375px;
    background: #ffffff;
    box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
    position: absolute;
    bottom: 20px;

    .bottom-button-block {
      width: 321px;
      height: 50px;
      margin-left: 25px;
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

    .top-prize {
      display: flex;
      justify-content: space-between;

      .amt {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
      }
    }

    .bottom-text {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
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
}
</style>
