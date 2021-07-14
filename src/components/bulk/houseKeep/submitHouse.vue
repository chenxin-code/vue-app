<template>
  <div>
    <div class="user-message">
      <div
        class="user-content-nodata"
        v-if="noData"
        @click="selectAddress(false)"
      >
        <div class="left">
          <img src="@assets/images/housekeep/user.png" alt="" />
          <span>点击添加联系人信息</span>
        </div>
        <img
          src="@assets/images/housekeep/arrow-icon.png"
          alt=""
          class="arrow"
        />
      </div>
      <div
        class="user-content-data"
        v-if="!noData"
        @click="selectAddress(true)"
      >
        <div class="address">
          <div style="display: flex">
            <div class="label"><span>默认</span></div>
            <span class="jiedao-address"
              >{{ addressObj.provinceName }}{{ addressObj.cityName
              }}{{ addressObj.countryName }}</span
            >
          </div>
          <img
            src="@assets/images/housekeep/arrow-icon.png"
            alt=""
            style="margin-right: 15px"
          />
        </div>
        <div class="details-address">{{ addressObj.address }}</div>
        <div class="ownuser-message">
          {{ addressObj.receiverName
          }}<span style="margin-left: 8px">{{ addressObj.mobile }}</span>
        </div>
      </div>

      <img src="@assets/images/housekeep/ban.png" alt="" class="banner" />
    </div>

    <div class="details-product">
      <div style="display: flex">
        <img :src="skuObj.phMainUrl" alt="" />
        <div class="right">
          <div class="describe">{{ skuObj.skuName }}</div>
          <div style="display: flex">
            <!-- <div class="label" v-for="(item, index) in labelList" :key="index">
              {{ item }}
            </div> -->
          </div>
          <div class="bottom-prize">
            <div class="amt">{{ skuObj.salePrice | currencyFormat("¥") }}</div>
            <div class="num">x {{ productNum }}</div>
          </div>
        </div>
      </div>
      <div class="divLine-solid" style="margin-top: 15px"></div>

      <van-field
        style="margin-top: 14px; border-radius: 12px"
        v-model="remark"
        label="订单备注"
        placeholder="输入订单备注（选填）"
        input-align="right"
      />

      <div class="bottom-sum">
        <van-cell
          title="商品金额"
          :value="
            mathFunction.times(skuObj.salePrice, productNum)
              | currencyFormat('¥')
          "
          style="border-radius: 12px"
          value-class="black-amt"
        />
        <van-cell title=" " style="border-radius: 12px">
          <div slot="default" class="red-amt">
            <span style="color: #333333">合计: </span>
            <span>{{
              mathFunction.times(Number(skuObj.salePrice), Number(productNum))
                | currencyFormat("¥")
            }}</span>
          </div>
        </van-cell>
      </div>
    </div>
    <times-button
      class="times-button"
      :has-cancle="false"
      @submit-click="submit"
    >
      <div class="slot-content">
        <span>需付款:</span
        ><span class="amt">{{
          mathFunction.times(Number(skuObj.salePrice), Number(productNum))
            | currencyFormat("¥")
        }}</span>
      </div>
    </times-button>
  </div>
</template>

<script>
import timesButton from "@/components/times-button";
import mathFunction from "@/utils/mathTools";
import orderService from "@request/orderService";
export default {
  components: { timesButton },
  data() {
    return {
      pageParams: {},
      remark: "",
      noData: true,
      skuObj: {},
      productDetail: {},
      productNum: 0,
      labelList: [],
      mathFunction: mathFunction,
      addressObj: {},
    };
  },
  activated() {
    this.init();
    this.addressObj = this.$store.state.order.adressInfo;
    console.log("obj", this.addressObj);
    this.noData = !this.addressObj.id;
  },
  created() {},
  methods: {
    //初始化
    init() {
      this.pageParams = this.$util.storages().get("submitHouse_orderDetail");
      this.productNum = this.pageParams.productNum;
      this.skuObj = this.pageParams.skuObj;
      this.labelList = this.skuObj.categoryName.split("/");
      console.log("-------------");
    },
    //确认订单
    submit() {
      let { skuId, skuName } = this.skuObj;
      let {
        address,
        cityId,
        cityName,
        countryId,
        countryName,
        mobile,
        provinceId,
        provinceName,
        receiverName,
      } = this.addressObj;
      let params = {
        address: {
          addrDetail: address,
          cityCode: cityId,
          cityName: cityName,
          districtCode: 222222,
          districtName: countryName,
          originalAddrId: countryId,
          provinceCode: provinceId,
          provinceName: provinceName,
          receiverName: receiverName,
          receiverPhone: mobile,
        },
        orderItemList: [
          {
            buyNum: this.productNum,
            itemId: "123",
            itemName: skuName,
            skuId: skuId,
          },
        ],
        billType: 13,
        orderSource: "TIMES_XINGXUAN",
        orderType: "SERVICE",
        paymentMethod: "ONLINE",
        projectId: this.pageParams.pageParams.projectCommunityId,
        tradeRemark: this.remark,
      };
      console.log("params", JSON.stringify(params));
      //核心
      this.$wxsdk.payWay(params);
    },
    selectAddress(flag) {
      if (flag) {
        // 当前已有地址数据，跳转携带地址id
        this.$router.push({
          path: "/order/chooseCommodity",
          query: {
            addressId: "test",
          },
        });
      } else {
        this.$router.push({
          path: "/order/chooseCommodity",
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
.divLine-solid {
  width: 323px;
  margin-left: 15px;
  height: 1px;
  background: #f0f0f0;
}

.user-message {
  width: 351px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;
  margin: 20px 0 0 12px;

  .user-content-nodata {
    // height: 68px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;

      span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 56px;
        margin-left: 10px;
      }

      img {
        height: 20px;
        width: 20px;
        margin-left: 10px;
      }
    }

    .arrow {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  .user-content-data {
    .address {
      display: flex;
      padding: 20px 0 0 15px;
      justify-content: space-between;

      .label {
        width: 35px;
        height: 15px;
        text-align: center;
        line-height: 15px;
        color: #ffffff;
        background: #e8374a;
        border-radius: 12px;
      }

      .jiedao-address {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-left: 8px;
      }

      img {
        width: 20px;
        height: 20px;
        align-items: center;
      }
    }

    .details-address {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
      margin: 5px 15px;
    }

    .ownuser-message {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin-left: 15px;
    }
  }

  .banner {
    width: 351px;
    // position: relative;
    // top: -12px;
  }
}

.details-product {
  padding-top: 15px;
  margin: 16px 12px 0 12px;
  width: 351px;
  height: 185px;
  background: #ffffff;
  box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
  border-radius: 12px;

  img {
    width: 96px;
    height: 96px;
    margin: 0 10px 0 16px;
  }

  .right {
    .describe {
      width: 213px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
    }

    .label {
      width: 55px;
      height: 18px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 11px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      text-align: center;
      margin-top: 5px;
      margin-left: 5px;
    }

    .bottom-prize {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .amt {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #e8374a;
      }

      .num {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
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

  .bottom-sum {
    width: 351px;
    background: #ffffff;
    box-shadow: 0px 6px 30px 0px rgba(71, 77, 96, 0.06);
    border-radius: 20px;
    margin-top: 15px;

    .black-amt {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }

    .red-amt {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #e8374a;
    }
  }
}

.times-button {
  margin-top: 20px;
  padding: 5px 15px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ffffff;

  .slot-content {
    width: 50%;

    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #121212;
    }

    .amt {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e8374a;
    }
  }
}
</style>
