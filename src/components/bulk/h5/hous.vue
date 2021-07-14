<template>
  <div class="main" v-if="productDetail">
    <div class="house-product-swiper">
      <van-swipe class="my-swipe" :autoplay="3000" @change="onChange">
        <van-swipe-item v-for="item in productDetail.phMainUrl" :key="item"
          ><img :src="item"
        /></van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{ current + 1 }}/{{ productDetail.phMainUrl.length }}
          </div>
        </template>
      </van-swipe>
    </div>
    <!-- 团购价  -->
    <div class="product-message">
      <div class="prize">
        <div class="practical">
          ¥ {{ $util.toDecimal2(productDetail.costPrice) }}
        </div>
        <div class="old">¥ {{ $util.toDecimal2(productDetail.salePrice) }}</div>
      </div>
      <div class="product-desc">{{ productDetail.spuName }}~</div>
    </div>
    <div class="product-size">
      <div class="left">
        <span class="size">规格</span
        ><span class="text">
          {{ selectData.skuName }} {{ selectData.attributeValue }}
        </span>
      </div>
      <div class="right">
        <van-icon name="ellipsis" size="20" @click="selectSize" />
      </div>
    </div>
    <div class="order">
      <span class="line"></span>
      <span class="txt">图文详情</span>
      <span class="line"></span>
      <div class="word-detail" ref="wordDetail"></div>
    </div>
    <div class="conten">
      <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" />
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
      :style="{ height: '60%' }"
      :closeable="true"
      round
    >
      <div class="details-product">
        <div style="display: flex">
          <img :src="selectData.groupbuySkuPicurl" alt="" />
          <div class="right">
            <div class="top-prize row end">
              <div class="amt">
                ¥ {{ $util.toDecimal2(selectData.groupbuyBuyerPrice) }}
              </div>
              <div class="old">
                ¥ {{ $util.toDecimal2(selectData.groupbuyLinePrice) }}
                <span class="old_line"></span>
              </div>
            </div>
            <div class="top-prize">
              <div class="practical">
                库存：{{ selectData.groupbuyStockNumber }}
              </div>
            </div>
            <div class="bottom-text">
              已选 {{ selectData.skuName }} {{ selectData.attributeValue }}
            </div>
          </div>
        </div>
        <div class="popup-product-size-text">
          <div class="text">{{ selectData.skuName }}</div>
        </div>
        <div class="popup-product-list-size">
          <div v-for="(item, index) in productDetail.skuInfoBOList" :key="item">
            <div
              class="popup-product-type row center"
              :class="selectIndex == index ? 'popup-select' : 'popup-default'"
              @click="selectItem(item, index)"
            >
              {{ item.attributeValue }}
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
import { spuInfo, house_travel_Info, config } from "../bulkapi/index.js";
// 134338
export default {
  components: {
    timesSelector,
  },
  data() {
    return {
      bannerImg: [
        "https://img01.yzcdn.cn/vant/apple-1.jpg",
        "https://img01.yzcdn.cn/vant/apple-2.jpg",
      ],
      current: 0,
      isShowPopup: false,
      firstList: [],
      secondList: [],
      productNum: "",
      productDetail: "",
      selectData: "",
      selectIndex: 0,
    };
  },
  mounted() {
    this.skuId = this.$route.query.skuId;
    this.spuId = this.$route.query.spuId;
    this.detailFn(this.spuId);
  },
  methods: {
    /*商品详情*/
    detailFn(spuId) {
      spuId = 134329;
      spuId = 134423;
      let url = spuInfo + "?id=" + spuId;
      url = house_travel_Info;
      let obj = {
        id: spuId,
        businessTypeId: 1,
      };
      this.$http
        .post(url, JSON.stringify(obj), config)
        .then((res) => {
          console.log(res, "detailFn");
          let resdata = res.data.data;
          let { data, code } = resdata;
          if (code == 200) {
            data.phMainUrl = data.phMainUrl.split(",");
            this.selectData = data.skuInfoBOList[0];
            this.selectIndex = 0;
            this.productDetail = data;
            console.log(productDetail, selectData);
          } else {
            this.productDetail = "";
            this.selectData = "";
          }
        })
        .catch((error) => {});
    },
    onChange(index) {
      this.current = index;
    },
    selectItem(item, index) {
      this.selectIndex = index;
      this.selectData = item;
    },
    selectSize() {
      this.isShowPopup = true;
    },
    submit() {
      //   this.$util.storages().set("submitHouse_orderDetail", {
      //     pageParams: this.pageParams,
      //     productDetail: this.productDetail,
      //     skuObj: this.skuObj,
      //     productNum: this.productNum,
      //   });
      this.$router.push({
        path: "/housekeep/submitHouse",
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
// 拓展可点击区域
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

.spacebwteen {
  justify-content: space-between;
}

.end {
  align-items: flex-end;
}

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

.main::-webkit-scrollbar {
  width: 0 !important;
}

.main {
  background: #F8F8F8 !important;
  overflow: auto;
}

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

.conten {
  width: 100%;
  padding-bottom: 100px;

  img {
    width: 100%;
  }
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
    width: 375px;
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
  padding: 10px 20px 0 20x;

  .prize {
    .practical {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e8374a;
    }

    .old {
      margin: 6px 0 0 8px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      text-decoration: line-through;
    }
  }

  .product-desc {
    padding: 10px 0;
    margin-left: 20px;
    font-size: 16px;
    height: 42px;
    // font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #121212;
  }
}

.product-size {
  margin-top: 10px;
  width: 375px;
  height: 48px;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;

  .left {
    margin-left: 15px;

    .size {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #121212;
    }

    .text {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-left: 15px;
    }
  }

  .right {
    margin-right: 15px;
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

.bottom-button {
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
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
    padding: 8px 0;

    .top-prize {
      .amt {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
      }

      .old {
        margin-left: 8px;
        color: #666;
        position: relative;

        .old_line {
          width: 100%;
          position: absolute;
          border-top: 1px solid #666;
          top: 6px;
          left: 0;
        }
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

    // top: 1000px;
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
</style>
